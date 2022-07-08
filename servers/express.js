'use strict';

const fsp = require('fs/promises');
const crypto = require('crypto');
const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');

const Skeleton = require('./skeleton');
const watcher = require('../file-watcher.js');

// multer configs
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    const basename = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${basename}${ext}`);
  }
});
const upload = multer({storage: storage});

// minimist configs
const argvOptions = {
  alias: {
    l: 'logfile'
  },
  default: {
    l: ''
  },
};
const argv = require('minimist')(process.argv.slice(2), argvOptions);

// datarows and globals
let firstTs, lastTs, version;
const eventloopDataRows = [];
const memoryDataRows = [];
const cpuDataRows = [];

// the app
let pathToLogFile = argv.logfile;
let uploadedFiles = [];
const app = express();

// create the routers
const clientRoutes = express.Router();
const apiRoutes = express.Router();

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use(express.static(path.join(__dirname, '../front-end', 'build')));
app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use('/', clientRoutes);

apiRoutes.post('/logfiles', upload.any(), async (req, res) => {
  for(let file of req.files) {
    let filepath = path.join(__dirname, '..', file.path);
    try {
      var contents = await fsp.readFile(filepath, 'utf-8');
      var firstRecord = JSON.parse(contents.slice(0, contents.indexOf('\n')));
      var headerProps = ['ts', 'type', 'entry'];
      var recordProps = Object.getOwnPropertyNames(firstRecord);

      if (!headerProps.every(e => recordProps.includes(e)) && firstRecord.type != 'header') {
        throw new Error('Invalid logile');
      }
      file.status = {uploaded: true, reason: ''};
    } catch (err) {
      file.status = {uploaded: false, reason: 'Invalid logfile!'};
      await fsp.unlink(filepath);
    }
  }
  uploadedFiles.push(...req.files);
  res.status(207).send({files: req.files});
});

apiRoutes.post('/watchfile', async (req, res) => {
  const filepath = path.join(__dirname, '..', 'uploads', req.body.filename);
  try {
    await fsp.access(filepath);
  } catch (err) {
    return res.status(404).send(new Error(`${req.body.filename} was not found!`));    
  }
  pathToLogFile = filepath;
  res.status(200).end(collector);  
});

apiRoutes.get('/logfiles', async (req, res) => {
  let uploadsFolder = path.join(__dirname, '..', 'uploads');
  try {
    var files = await fsp.readdir(uploadsFolder, {encoding: 'utf-8'});
    uploadedFiles = uploadedFiles.filter(file => files.includes(file.filename));
    res.status(200).send(uploadedFiles);
  } catch (err) {
    res.status(500).send(err);
  }
});

apiRoutes.get('/curr-logfile', (req, res) => {
  res.status(200).send({currentLogfile: path.parse(pathToLogFile).base});
});

apiRoutes.get('/timestamps', (req, res) => {
  res.status(200).send({timestamps: {firstTs, lastTs}});
});

apiRoutes.get('/timeseries', function (req, res) {
  let timeseries = {eventloop: eventloopDataRows, memory: memoryDataRows, cpu: cpuDataRows};
  let relStart = (req.query.relStart != undefined) ? Number(req.query.relStart) : firstTs;
  let relEnd = (req.query.relEnd != undefined) ? Number(req.query.relEnd) : lastTs;
  let properties = req.query.timeseries || ['cpu', 'memory', 'eventloop'];

  for (const key of Object.keys(timeseries)) {
    if (!properties.includes(key)) {
      delete timeseries[key];
    } else {
      if (relStart < 0) {
        relStart = lastTs + relStart;
      }
      if (relEnd < 0) {
        relEnd += relEnd;
      }
      timeseries[key] = timeseries[key].filter(e => e.ts >= relStart && e.ts <= relEnd);
    }
  }
  return res.status(200).send({version, range: {relStart, relEnd}, timeseries});
});

clientRoutes.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
});

async function collector() {
  const lines = watcher(pathToLogFile);
  const first = await lines.next();

  if (first.done) {
    throw new Error('No log lines to read');
  }

  const firstRecordTs = JSON.parse(first.value).ts;
  version = JSON.parse(first.value).entry.version;
  firstTs = Number(firstRecordTs);

  if (version > process.env.npm_package_version) {
    console.log(`version ${version} is higher than what route-metrics-display knows about.
    We'll try to decode it but you should upgrade your version of route-metrics-display`);
  }

  for await (const line of lines) {
    if (line === null) {
      continue;
    }

    try {
      const record = JSON.parse(line);
      const entry = record.entry;
      lastTs = Number(record.ts);

      // Delta is in seconds
      const delta = (record.ts - firstRecordTs) / 1e3;
      if (record.type === 'eventloop') {
        // Eventloop delay is in nanoseconds. Make it ms.
        const row = { ts: record.ts, delta };
        const percentiles = [50, 75, 90, 95, 99];
        for (let i = percentiles.length - 1; i >= 0; i--) {
          row[percentiles[i]] = entry[percentiles[i]] / 1e6;
        }
        eventloopDataRows.push(row);
      } else if (record.type === 'proc') {
        // Memory data is in bytes. Make it megabytes
        const externalAvg = entry.externalAvg / 1e6;
        const heapUsedAvg = entry.heapUsedAvg / 1e6;
        const heapTotal = entry.heapTotal / 1e6;
        const rss = entry.rss / 1e6;
        // Cpu data is in microseconds. Make it ms
        cpuDataRows.push({ts: record.ts, delta, user: entry.cpuUserAvg / 1e3, system: entry.cpuSystemAvg / 1e3});
        memoryDataRows.push({ts: record.ts, delta, rss, heapTotal, heapUsedAvg, externalAvg});
      } else {
        continue;
      }
    } catch (e) {
      console.log(e);
    }
  }
}

// create the server and start listening.
let options;
if (argv._.length) {
  const protocols = Skeleton.getProtocols(argv._);
  options = {protocols};
}

const server = new Skeleton(app, options);
server.start()
  .then((n) => {
    // eslint-disable-next-line no-console
    console.log(process.pid);
  })
  .then(() => pathToLogFile && collector());

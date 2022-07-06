'use strict';

const path = require('path');
const fs = require('fs');

const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');

const Skeleton = require('./skeleton');
const watcher = require('../file-watcher.js');

// multer configs
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    cb(null, `${filename}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
})
const upload = multer({
  storage: storage,
  fileFilter: function fileFilter (req, file, cb) {
    if(file.mimetype == 'text/plain') {
      return cb(null, true);
    }
    cb(null, false);
  }
});

// minimist configs
const argvOptions = {
  alias: {
    l: 'logfile',
  },
  default: {
    l: '',
  },
};
const argv = require('minimist')(process.argv.slice(2), argvOptions);

// the datarows
let firstTs, lastTs, version;
const eventloopDataRows = [];
const memoryDataRows = [];
const cpuDataRows = [];

// the app
let pathToLogFile = argv.logfile;
let lastUploadedFiles = [];
const app = express();

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'front-end', 'build')));

app.use(bodyParser.json());

app.post('/api/logfiles', upload.any(), (req, res) => {
  lastUploadedFiles = req.files;
  res.status(200).end();
});

app.get('/api/logfiles', (req, res) => {
  res.status(200).send(lastUploadedFiles);
});

app.post('/api/watchfile', (req, res) => {
  const filepath = path.join(__dirname, '..', 'uploads', req.body.filename);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send(new Error(`${req.body.filename} was not found!`));
    }
    // file should exist here
    pathToLogFile = filepath;
    res.status(200).end(collector);  
  });
});

app.get('/api/curr-logfile', (req, res) => {
  res.status(200).send({currentLogfile: path.parse(pathToLogFile).base});
});

app.get('/api/timestamps', (req, res) => {
  res.status(200).send({timestamps: {firstTs, lastTs}});
});

app.get('/api/timeseries', function (req, res) {
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
        relEnd = lastTs + relEnd;
      }
      timeseries[key] = timeseries[key].filter(e => e.ts >= relStart && e.ts <= relEnd);
    }
  }
  return res.status(200).send({version, range: {relStart, relEnd}, timeseries});
});

app.get('/', function (req, res) {
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
  .then(async () => {
    if (pathToLogFile) {
      await collector();
    }
  });

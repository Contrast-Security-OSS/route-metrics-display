'use strict';

const fsp = require('fs/promises');
const path = require('path');

const express = require('express');

const Skeleton = require('./skeleton');
const watcher = require('../file-watcher.js');

// minimist configs
const argvOptions = {
  alias: {
    l: 'logfile'
  },
  default: {
    l: ''
  },
};
const argv = require("minimist")(process.argv.slice(2), argvOptions);

// datarows and globals
let firstTs, lastTs, version;
const eventloopDataRows = [];
const memoryDataRows = [];
const cpuDataRows = [];

// the app
let pathToLogFile = argv.logfile;
const app = express();

// create the routers
const clientRoutes = express.Router();
const apiRoutes = express.Router();

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(express.static(path.join(__dirname, '../front-end', 'build')));
app.use('/api', apiRoutes);
app.use('/', clientRoutes);

apiRoutes.get('/curr-logfile', (req, res) => {
  res.status(200).send({currentLogfile: path.parse(pathToLogFile).base});
});

apiRoutes.get('/timestamps', (req, res) => {
  res.status(200).send({timestamps: {firstTs, lastTs}});
});

apiRoutes.get('/timeseries', function(req, res) {
  const timeseries = {eventloop: eventloopDataRows, memory: memoryDataRows, cpu: cpuDataRows};
  let relStart = (req.query.relStart != undefined) ? Number(req.query.relStart) : Number(firstTs);
  let relEnd = (req.query.relEnd != undefined) ? Number(req.query.relEnd) : Number(lastTs);
  const properties = req.query.timeseries || ['cpu', 'memory', 'eventloop'];

  if (!pathToLogFile) {
    return res.status(200).send({version, range: {relStart, relEnd}, timeseries});
  } else if (Number.isNaN(relStart) || Number.isNaN(relEnd)) {
    return res.status(400).send({error: 'All timestamps must be numbers!'});
  }

  for (const key of Object.keys(timeseries)) {
    if (!properties.includes(key)) {
      delete timeseries[key];
    } else {
      if(timeseries[key].some(e => Number.isNaN(Number(e.ts)))) {
        return res.status(400).send({error: 'All timestamps must be numbers!'});
      }

      if (relEnd < 0) relEnd += lastTs;
      if (relStart < 0) relStart += lastTs;
      timeseries[key] = timeseries[key].filter(e => e.ts >= relStart && e.ts <= relEnd);
    }
  }
  res.status(200).send({version, range: {relStart, relEnd}, timeseries});
});

clientRoutes.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
});

async function collector() {
  const lines = watcher(pathToLogFile);
  const first = await lines.next();

  if (first.done) {
    throw new Error("No log lines to read");
  }
  firstTs = JSON.parse(first.value).ts;
  
  version = JSON.parse(first.value).entry.version;
  if (version > process.env.npm_package_version) {
    // eslint-disable-next-line no-console
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
      lastTs = record.ts;

      // Delta is in seconds
      const delta = (record.ts - firstTs) / 1e3;
      if (record.type === 'eventloop') {
        // Eventloop delay is in nanoseconds. Make it ms.
        const row = {ts: record.ts, delta};
        const percentiles = [50, 75, 90, 95, 99];
        for (let i = percentiles.length - 1; i >= 0; i--) {
          row[percentiles[i]] = entry[percentiles[i]] / 1e6;
        }
        eventloopDataRows.push(row);
      } else if (record.type === "proc") {
        // Memory data is in bytes. Make it megabytes
        const externalAvg = entry.externalAvg / 1e6;
        const heapUsedAvg = entry.heapUsedAvg / 1e6;
        const heapTotal = entry.heapTotal / 1e6;
        const rss = entry.rss / 1e6;
        // Cpu data is in microseconds. Make it ms
        cpuDataRows.push({
          ts: record.ts,
          delta,
          user: entry.cpuUserAvg / 1e3,
          system: entry.cpuSystemAvg / 1e3,
        });
        memoryDataRows.push({
          ts: record.ts,
          delta,
          rss,
          heapTotal,
          heapUsedAvg,
          externalAvg,
        });
      } else {
        continue;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
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
server
  .start()
  .then((n) => {
    // eslint-disable-next-line no-console
    console.log(process.pid);
  })
  .then(() => pathToLogFile && collector());

'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');

const Skeleton = require('./skeleton');
const watcher = require('../file-watcher.js');

const argvOptions = {
  alias: {
    l: 'logfile'
  },
  default: {
    l: 'route-metrics.log'
  }
};
const argv = require('minimist')(process.argv.slice(2), argvOptions);

// The app
const pathToLogFile = argv['logfile'];
const app = express();

app.get("/api", function (req, res) {
  let first = req.query.first || 0;
  let last = req.query.last || Date.now();
  let timeseries = {eventloop: eventloopDataRows, memory: memoryDataRows, cpu: cpuDataRows};

  for (const key of Object.keys(timeseries)) {
    if (!req.query.timeseries.includes(key)) {
      delete timeseries[key];
    }
  };

  for (const [key, value] of Object.entries(timeseries)) {
    timeseries[key] = timeseries[key].filter(e => (e.ts >= first && e.ts <= last));
  };
  return res.status(200).send({version, range: { first, last }, timeseries});
});

// the datarows
const eventloopDataRows = [];
const memoryDataRows = [];
const cpuDataRows = [];
let version;

async function collector() {
  const lines = watcher(pathToLogFile);
  const first = await lines.next();

  if (first.done) {
    throw new Error('No log lines to read');
  }
  const firstTs = JSON.parse(first.value).ts;
  version = JSON.parse(first.value).entry['version'];

  for await (const line of lines) {
    if (line === null) {
      continue;
    };


    try {
      const record = JSON.parse(line);
      const entry = record.entry;
      const delta = (record.ts - firstTs) / 1e3;

      if (record.type === 'eventloop') {
        // Eventloop delay is in nanoseconds. Make it ms.
        const row = {ts: record.ts, delta: delta};
        const percentiles = [50, 75, 90, 95, 99];
        for (let i = percentiles.length - 1; i >= 0 ; i--) {
          row[percentiles[i]] = entry[percentiles[i]] / 1e6;
        }
        eventloopDataRows.push(row);
      } else if (record.type === 'proc') {
        // Memory data is in bytes. Make it megabytes
        const externalAvg = entry['externalAvg'] / 1e6;
        const heapUsedAvg = entry['heapUsedAvg'] / 1e6;
        const heapTotal = entry['heapTotal'] / 1e6;
        const rss = entry['rss'] / 1e6;
        // Cpu data is in microseconds. Make it ms
        cpuDataRows.push({ts: record.ts, delta: delta, user: entry['cpuUserAvg'] / 1e3, system: entry['cpuSystemAvg'] / 1e3});
        memoryDataRows.push({ts: record.ts, delta, rss, heapTotal, heapUsedAvg, externalAvg});
      } else {
        continue;
      };
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
  .then(n => {
    // eslint-disable-next-line no-console
    console.log(process.pid);
  })
  .then(async () => {
    await collector();
  });

'use strict';

const fs = require('fs');
const path = require('path');

const Skeleton = require('./skeleton');
const watcher = require('../file-watcher.js');

// the app
const express = require('express');
const app = express();

const pathToLogFile = path.join(__dirname, '..', '..', 'node-route-metrics', 'route-metrics.log');
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'pages/templatized.html'), 'utf8');

app.get('/eventloop', function(req, res) {
  const chartOpt = makeChartOptions({title: 'Eventloop lag percentiles (ms)', subtitle: '@contrast/route-metrics'});
  const datarows = makeDataRows(eventloopDataRows);
  const columns  = makeColumnNames();

  const html = populateTemplate(htmlTemplate, chartOpt, columns, datarows);
  res.send(html);
});

app.get('/processor', function(req, res) {
  res.send('Work in progress');
});

app.get('/memory', function(req, res) {
  res.send('Work in progress');
});

function populateTemplate(template, options, columns, datarows) {
  template = template.replace('/* insert: chart-options */', options);
  template = template.replace('/* insert: data.addColumn(type, text); */', columns);
  template = template.replace('/* insert: data.addRows() */', datarows);
  return template;
}

function makeChartOptions(options) {
  let optionsToString = '';
  for (const [key, value] of Object.entries(options)) {
    optionsToString += `${key}: '${value}', `;
  }
  return optionsToString.slice(0, optionsToString.length - 2);
}

function makeColumnNames() {
  return `
    data.addColumn('number', 'seconds');
    data.addColumn('number', '99');
    data.addColumn('number', '95');
    data.addColumn('number', '90');
    data.addColumn('number', '75');
    data.addColumn('number', '50');
  `;
}

function makeDataRows(datarows) {
  return datarows.join(',');
}

// the datarows
const eventloopDataRows = [];
const memoryDataRows = [];
const cpuDataRows = [];

let lastNotification = Date.now();
async function collector() {
  const lines = watcher(pathToLogFile);
  const first = await lines.next();
  // maybe wait for the file to appear? idk.
  if (first.done) {
    throw new Error('no log lines to read');
  }
  const firstRecord = JSON.parse(first.value);
  const firstTs = firstRecord.ts;
  for await (const line of lines) {
    if (line === null) {
      continue;
    }
    // add to data rows - rebase time off of first record ts
    // look for type === eventloop
    // set eventloopDataRows to [deltaTime, 50, 75, 90, 95, 99] values
    try {
      const record = JSON.parse(line);
      if (record.type !== 'eventloop') {
        continue;
      }
      const delta = (record.ts - firstTs) / 1000;
      const entry = record.entry;
      // eventloop delay is in nanoseconds; make them ms.
      const row = [delta];
      const percentiles = [50, 75, 90, 95, 99];
      for (let i = percentiles.length - 1; i >= 0 ; i--) {
        row.push(entry[percentiles[i]] / 1000000);
      }
      eventloopDataRows.push(`[${row}]`);
      if (Date.now() - lastNotification > 60 * 1000) {
        lastNotification = Date.now();
        console.log(`[total data rows: ${eventloopDataRows.length}]`);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

// create the server and start listening.
let options;
if (process.argv.length > 2) {
  const protocols = Skeleton.getProtocols(process.argv.slice(2));
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

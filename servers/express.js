'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');

const Skeleton = require('./skeleton');
const watcher = require('../file-watcher.js');

// The app
const app = express();
const argv = require('minimist')(process.argv.slice(2), { alias: {p: 'protocol', l: 'logfile'} });

const pathToLogFile = argv['logfile'] ? argv['logfile'] : 'route-metrics.log';
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'pages/templatized.html'), 'utf8');

app.get('/eventloop', function(req, res) {
  const chartOpt = makeChartOptions({title: 'Eventloop lag percentiles (ms)', subtitle: '@contrast/route-metrics'});
  const datarows = makeDataRows(eventloopDataRows);
  const columns  = makeEventloopColumnNames();
  
  const html = populateTemplate(htmlTemplate, chartOpt, columns, datarows);
  res.send(html);
});

app.get('/memory', function(req, res) {
  const chartOpt = makeChartOptions({title: 'Insert title here', subtitle: '@contrast/route-metrics'});
  const datarows = makeDataRows(memoryDataRows);
  const columns  = makeMemoryColumnNames();
  
  const html = populateTemplate(htmlTemplate, chartOpt, columns, datarows);
  res.send(html);
});

app.get('/cpu', function(req, res) {
  const chartOpt = makeChartOptions({title: 'Time spent in user and system code respectively (ms)', subtitle: '@contrast/route-metrics'});
  const datarows = makeDataRows(cpuDataRows);
  const columns  = makeCpuColumnNames();

  const html = populateTemplate(htmlTemplate, chartOpt, columns, datarows);
  res.send(html);
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

function makeEventloopColumnNames() {
  return `
    data.addColumn('number', 'seconds');
    data.addColumn('number', '99');
    data.addColumn('number', '95');
    data.addColumn('number', '90');
    data.addColumn('number', '75');
    data.addColumn('number', '50');
  `;
}

function makeMemoryColumnNames() {
  return '';
}

function makeCpuColumnNames() {
  return `
  data.addColumn('number', 'seconds');
  data.addColumn('number', 'User');
  data.addColumn('number', 'System');
  `;
}

function makeDataRows(datarows) {
  return datarows.join(',');
}

// the datarows
const eventloopDataRows = [];
const memoryDataRows = [];
const cpuDataRows = [];

async function collector() {
  const lines = watcher(pathToLogFile);
  const first = await lines.next();

  if (first.done) {
    throw new Error('No log lines to read');
  }
  const firstTs = JSON.parse(first.value).ts;
  
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
        const row = [delta];
        const percentiles = [50, 75, 90, 95, 99];
        for (let i = percentiles.length - 1; i >= 0 ; i--) {
          row.push(entry[percentiles[i]] / 1e6);
        }
        eventloopDataRows.push(`[${row}]`);
      } else if (record.type === 'proc') {
        // Memory data is in bytes. Make it megabytes
        const externalAvg = entry['externalAvg'] / 1e6;
        const heapUsedAvg = entry['heapUsedAvg'] / 1e6;
        const heapTotal = entry['heapTotal'] / 1e6;
        const rss = entry['rss'] / 1e6;

        // Cpu data is in microseconds. Make it ms
        cpuDataRows.push(`[${delta}, ${entry['cpuUserAvg'] / 1e3}, ${entry['cpuSystemAvg'] / 1e3}]`);
        memoryDataRows.push(`[${delta}, ${rss}, ${heapTotal}, ${heapUsedAvg}, ${externalAvg}]`);
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
if (argv['protocol']) {
  // getProtocols() asks for an array of arguments
  const protocols = Skeleton.getProtocols([argv['protocol']]);
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

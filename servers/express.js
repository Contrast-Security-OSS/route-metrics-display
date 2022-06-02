'use strict';

const fs = require('fs');
const path = require('path');

const Skeleton = require('./skeleton');
const watcher = require('../file-watcher.js');

// the app
const express = require('express');
const app = express();


const htmlTemplate = fs.readFileSync(path.join(__dirname, 'pages/templatized.html'), 'utf8');
app.get('/', function(req, res) {
  const html = populateTemplate(htmlTemplate);
  res.send(html);
});

function populateTemplate(template) {
  /* insert: chart-options */
  template = template.replace('/* insert: chart-options */', makeChartOptions());
  template = template.replace('/* insert: data.addColumn(type, text); */', makeColumnNames());
  template = template.replace('/* insert: data.addRows() */', makeDataRows());
  return template;
}

function makeChartOptions() {
  // title: 'Box Office Earnings in First Two Weeks of Opening',
  // subtitle: 'in millions of dollars (USD)'
  return `title: 'Eventloop lag percentiles (ms)',
  subtitle: '@contrast/route-metrics'`;
}

function makeColumnNames() {
  /* insert: data.addColumn(type, text); */
  //data.addColumn('number', 'Time');
  //data.addColumn('number', 'Guardians of the Galaxy');
  //data.addColumn('number', 'The Avengers');
  //data.addColumn('number', 'Transformers: Age of Extinction');
  return `
    data.addColumn('number', 'second');
    data.addColumn('number', '99');
    data.addColumn('number', '95');
    data.addColumn('number', '90');
    data.addColumn('number', '75');
    data.addColumn('number', '50');
  `;
}

// the eventloop datarows
const dataRows = [];

function makeDataRows() {
  /* insert: data.addRows() */
  return dataRows.join(',');
  return `
  [1,  88, 77.8, 66.5, 55.8, 44.8],
  [2,  88, 77.5, 66.5, 55.4, 44.4],
  [3,  88, 77.1, 66.5, 55.7, 44.7],
  [4,  88, 77.8, 66.5, 55.5, 44.5],
  [5,  88, 77.6, 66.5, 55.4, 44.4],
  [6,  88, 77.6, 66.5, 55.7, 44.7],
  [7,  88, 77.3, 66.5, 55.6, 44.6],
  [8,  88, 77.2, 66.5, 55.6, 44.6],
  [9,  88, 77.9, 66.5, 55.8, 44.8],
  [10, 88, 77.9, 66.6, 55.6, 44.6],
  [11, 88, 77.9, 66.7, 55.7, 44.7],
  [12, 88, 77.4, 66.2, 55.2, 44.2],
  [13, 88, 77.3, 66.6, 55.6, 44.6],
  [14, 88, 77.2, 66.4, 55.4, 44.4],
  `;
}

async function collector() {
  const lines = watcher('../route-metrics/route-metrics.log');
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
    // set dataRows to [deltaTime, 50, 75, 90, 95, 99] values
    try {
      const record = JSON.parse(line);
      if (record.type !== 'eventloop') {
        continue;
      }
      const delta = (record.ts - firstTs) / 1000;
      const entry = record.entry;
      // eventloop delay is in nanoseconds by default
      const row = [delta];
      for (const percentile of [50, 75, 90, 95, 99]) {
        row.push(entry[percentile] / 1000000);
      }
      dataRows.push(`[${row}]`);
      console.log('added', dataRows[dataRows.length - 1]);
    } catch(e) {
      console.log(e);
    }
  }
}


//
// create the server and start listening.
//
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

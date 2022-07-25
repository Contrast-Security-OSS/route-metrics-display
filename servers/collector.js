'use strict';

const watcher = require('../file-watcher.js');
const {readLine} = require('./utils');

let cpuDataRows = [], memoryDataRows = [], eventloopDataRows = [], version, firstTs, lastTs;

const clearData = () => {
  cpuDataRows = [];
  memoryDataRows = [];
  eventloopDataRows = [];
};

const getData = () => ({
  cpuDataRows,
  memoryDataRows,
  eventloopDataRows,
  firstTs,
  lastTs,
  version,
});

async function collector(pathToLogFile) {
  clearData();

  const lines = watcher(pathToLogFile);
  const first = await lines.next();

  if (first.done) {
    throw new Error('No log lines to read');
  }

  const firstRecordTs = JSON.parse(first.value).ts;
  version = JSON.parse(first.value).entry.version;
  firstTs = Number(firstRecordTs);

  if (version > process.env.npm_package_version) {
    // eslint-disable-next-line no-console
    console.log(`version ${version} is higher than what route-metrics-display knows about.
      We'll try to decode it but you should upgrade your version of route-metrics-display`);
  }

  for await (const line of lines) {
    if (line === null) {
      continue;
    }

    const data = readLine(
      line,
      cpuDataRows,
      memoryDataRows,
      eventloopDataRows,
      firstTs
    );

    lastTs = data.lastTs;
  }
}

module.exports = {
  collector,
  getData,
};

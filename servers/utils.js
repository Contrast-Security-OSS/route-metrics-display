'use strict';

const setEventLoopData = (record, delta, eventloopDataRows) => {
  const row = {ts: record.ts, delta};
  const percentiles = [50, 75, 90, 95, 99];
  for (let i = percentiles.length - 1; i >= 0; i--) {
    row[percentiles[i]] = record.entry[percentiles[i]] / 1e6;
  }
  eventloopDataRows.push(row);
};

const setProcessData = (record, cpuDataRows, memoryDataRows) => {
  const externalAvg = record.entry.externalAvg / 1e6;
  const heapUsedAvg = record.entry.heapUsedAvg / 1e6;
  const heapTotal = record.entry.heapTotal / 1e6;
  const rss = record.entry.rss / 1e6;

  cpuDataRows.push({
    ts: record.ts,
    user: record.entry.cpuUserAvg / 1e3,
    system: record.entry.cpuSystemAvg / 1e3,
  });
  memoryDataRows.push({
    ts: record.ts,
    rss,
    heapTotal,
    heapUsedAvg,
    externalAvg,
  });
};

const readLine = (
  rowLine,
  cpuDataRows,
  memoryDataRows,
  eventloopDataRows,
  firstTs,
  lastTs
) => {
  try {
    const record = JSON.parse(rowLine);
    
    lastTs = Number(record.ts);
    if (Number.isNaN(lastTs)) {
      throw new Error('Timestamps must be numbers');
    }

    // Delta is in seconds
    const delta = (record.ts - firstTs) / 1e3;
    switch (record.type) {
      case 'eventloop':
        setEventLoopData(record, delta, eventloopDataRows);
        break;
      case 'proc':
        setProcessData(record, cpuDataRows, memoryDataRows);
        break;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  return {
    cpuDataRows,
    memoryDataRows,
    lastTs,
    firstTs,
    eventloopDataRows,
  };
};

module.exports = {readLine};

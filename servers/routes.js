/* eslint-disable no-console */
'use strict';

const path = require('path');

const express = require('express');
const multer = require('multer');
const {readLine} = require('./utils');

const clientRoutes = express.Router();
const apiRoutes = express.Router();

const upload = multer().any();
const fileMiddleware = function(req, res, next) {
  upload(req, res, async(error) => {
    if (error) throw new Error(error.message);
    next();
  });
};

const {getData} = require('./collector');

apiRoutes.post('/logfiles', fileMiddleware, async(req, res) => {
  const files = [];

  try {
    for (const file of req.files) {
      const contents = file.buffer.toString();
      const firstRecord = JSON.parse(contents.slice(0, contents.indexOf('\n')));
      const headerProps = ['ts', 'type', 'entry'];
      const recordProps = Object.getOwnPropertyNames(firstRecord);

      if (!headerProps.every((e) => recordProps.includes(e)) || firstRecord.type != 'header') {
        throw new Error('Invalid log file');
      }

      files.push({contents, fileName: file.originalname});
    }
    
    const result = {};
    for (const {fileName, contents} of files) {
      const cpuDataRows = [], memoryDataRows = [], eventloopDataRows = [];
  
      contents.trim().split('\n').forEach((line) => {
        readLine(line, cpuDataRows, memoryDataRows, eventloopDataRows, 0);
      });
      result[fileName] = {cpu: cpuDataRows, memory: memoryDataRows, eventloop: eventloopDataRows};
    }
    res.status(207).send(result);  
  } catch (err) {
    res.status(400).send({error: err.message});
  }
});

apiRoutes.get('/timestamps', (req, res) => {
  const {firstTs, lastTs} = getData();
  res.status(200).send({timestamps: {firstTs, lastTs}});
});

apiRoutes.get('/timeseries', function(req, res) {
  const {eventloopDataRows, memoryDataRows, cpuDataRows, firstTs, lastTs, version} =
    getData();

  const timeseries = {
    eventloop: eventloopDataRows,
    memory: memoryDataRows,
    cpu: cpuDataRows,
  };

  let relStart = req.query.relStart != undefined ? Number(req.query.relStart) : firstTs;
  let relEnd = req.query.relEnd != undefined ? Number(req.query.relEnd) : lastTs;

  const properties = req.query.timeseries || ['cpu', 'memory', 'eventloop'];

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
      
      timeseries[key] = timeseries[key].filter((e) => e.ts >= relStart && e.ts <= relEnd);
    }
  }

  return res.status(200).send({version, range: {relStart, relEnd}, timeseries});
});

clientRoutes.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
});

module.exports = {clientRoutes, apiRoutes};

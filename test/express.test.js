'use strict';

<<<<<<< HEAD
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

=======
>>>>>>> 9f0a70bfcaf72ba522c1b9f384a8f550cb6a9c5d
const fetch = require('node-fetch');
const FormData = require('form-data');

const Server = require('../servers/server');

const {expect} = require('chai');

describe('API tests', function() {
  describe('tests with static files', function() {
    let testServer;
    before(async function() {
      testServer = new Server(['./servers/express.js', 'http:127.0.0.1:8080', '--logfile=./test/sample-data.log']);
      return testServer.readyPromise;
    });
<<<<<<< HEAD

    after(async function() {
      return testServer.stop({type: 'signal', value: 'SIGKILL'});
    });

    it('returns the current logfile correctly', async function() {
      const response =  await fetch('http://127.0.0.1:8080/api/curr-logfile');
      const expectedData = {currentLogfile: 'sample-data.log'};
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(expectedData);
      expect(response.headers.get('content-type')).to.include('application/json');
    });

    it('returns timestamps correctly', async function() {
      const expectedData = {timestamps: {firstTs: 1655888896593, lastTs: 1655888906678}};
      const response =  await fetch('http://127.0.0.1:8080/api/timestamps');
=======

    after(async function() {
      return testServer.stop({type: 'signal', value: 'SIGKILL'});
    });

    it('returns the current logfile correctly', async function() {
      const response =  await fetch('http://127.0.0.1:8080/api/curr-logfile');
      const expectedData = {currentLogfile: 'sample-data.log'};
>>>>>>> 9f0a70bfcaf72ba522c1b9f384a8f550cb6a9c5d
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(expectedData);
      expect(response.headers.get('content-type')).to.include('application/json');
    });

<<<<<<< HEAD
    it('returns correct data', async function() {
      const expectedData = {
        version: '1.0.0',
        range: {relStart: 1655888897602, relEnd: 1655888906678},
        timeseries: {
          eventloop: [],
          memory: [
            {
              ts: 1655888906678,
              delta: 10.085,
              rss: 57.438208,
              heapTotal: 9.13408,
              heapUsedAvg: 5.0048832,
              externalAvg: 5.849006200000001
            }
          ]
        }
      };

      const params = 'relStart=1655888897602&relEnd=1655888906678&timeseries=eventloop&timeseries=memory';
      const url = `http://127.0.0.1:8080/api/timeseries?${params}`;
      const response =  await fetch(url);
=======
    it('returns timestamps correctly', async function() {
      const expectedData = {timestamps: {firstTs: 1655888896593, lastTs: 1655888906678}};
      const response =  await fetch('http://127.0.0.1:8080/api/timestamps');
>>>>>>> 9f0a70bfcaf72ba522c1b9f384a8f550cb6a9c5d
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(expectedData);
      expect(response.headers.get('content-type')).to.include('application/json');
    });
<<<<<<< HEAD
  });

  describe('tests with live files or no files', function() {
    let testServer;
    before(async function() {
      testServer = new Server(['./servers/express.js', 'http:127.0.0.1:8080']);
      return testServer.readyPromise;
    });

    after(async function() {
      return testServer.stop({type: 'signal', value: 'SIGKILL'});
    });

    it('returns correct data when provided no file', async function() {
      const expectedData = {range: {}, timeseries: {eventloop: [], memory: [], cpu: []}};
      const response =  await fetch('http://127.0.0.1:8080/api/timeseries');
=======

    it('returns correct data', async function() {
      const expectedData = {
        version: '1.0.0',
        range: {relStart: 1655888897602, relEnd: 1655888906678},
        timeseries: {
          eventloop: [],
          memory: [
            {
              ts: 1655888906678,
              delta: 10.085,
              rss: 57.438208,
              heapTotal: 9.13408,
              heapUsedAvg: 5.0048832,
              externalAvg: 5.849006200000001
            }
          ]
        }
      };

      const params = 'relStart=1655888897602&relEnd=1655888906678&timeseries=eventloop&timeseries=memory';
      const url = `http://127.0.0.1:8080/api/timeseries?${params}`;
      const response =  await fetch(url);
>>>>>>> 9f0a70bfcaf72ba522c1b9f384a8f550cb6a9c5d
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(expectedData);
      expect(response.headers.get('content-type')).to.include('application/json');
    });
<<<<<<< HEAD

    it('only allows text files to be uploaded', async function() {
      const form = new FormData();
      form.append('file', fs.createReadStream(path.join(__dirname, 'sample-data.log')));
      form.append('file', fs.createReadStream(path.join(__dirname, 'servers', 'express.js')));

      // upload a couple of files
      let response = await fetch('http://127.0.0.1:8080/api/logfiles', {method: 'POST', body: form});

      // get a list of all the files that were uploaded successfully.
      // Any file that isn't 'text/plain' will be skipped
      response = await fetch('http://127.0.0.1:8080/api/logfiles');
      const data = await response.json();

      // check if everything's right.
      expect(response.status).to.equal(200);
      expect(data.length).to.equal(1);
      expect(data[0].mimetype).to.equal('text/plain');

      const filepath = makeUploadedFilename(data[0].filename);
      await fsp.access(filepath);
      await fsp.unlink(filepath);
    });

    it('starts watching a new logfile when needed', async function() {
      const form = new FormData();
      form.append('file', fs.createReadStream(path.join(__dirname, 'sample-data.log')));

      // upload a file
      let response = await fetch('http://127.0.0.1:8080/api/logfiles', {method: 'POST', body: form});

      // set it as the new logfile
      response = await fetch('http://127.0.0.1:8080/api/logfiles');
      let data = await response.json();
      const newFile = data[0].filename;

      response = await fetch('http://127.0.0.1:8080/api/watchfile', {
        method: 'POST',
        body: JSON.stringify({filename: newFile}),
        headers: {'Content-Type': 'application/json'},
      });
      response = await fetch('http://127.0.0.1:8080/api/curr-logfile');
      data = await response.json();

      // check if everything's good
      expect(response.status).to.equal(200);
      expect(data.currentLogfile).to.equal(newFile);

      const filepath = makeUploadedFilename(newFile);
      await fsp.access(filepath);
      await fsp.unlink(filepath);
    });
=======
>>>>>>> 9f0a70bfcaf72ba522c1b9f384a8f550cb6a9c5d
  });

<<<<<<< HEAD
function makeUploadedFilename(filename) {
  return path.join(__dirname, '..', 'uploads', filename);
}
=======
  describe('tests with live files or no files', function() {
    let testServer;
    before(async function() {
      testServer = new Server(['./servers/express.js', 'http:127.0.0.1:8080']);
      return testServer.readyPromise;
    });

    after(async function() {
      return testServer.stop({type: 'signal', value: 'SIGKILL'});
    });

    it('returns correct data when provided no file', async function() {
      const expectedData = {range: {relStart: null, relEnd: null}, timeseries: {eventloop: [], memory: [], cpu: []}};
      const response =  await fetch('http://127.0.0.1:8080/api/timeseries');
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(expectedData);
      expect(response.headers.get('content-type')).to.include('application/json');
    });
  });
});
>>>>>>> 9f0a70bfcaf72ba522c1b9f384a8f550cb6a9c5d

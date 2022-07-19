'use strict';

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
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(expectedData);
      expect(response.headers.get('content-type')).to.include('application/json');
    });

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
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(expectedData);
      expect(response.headers.get('content-type')).to.include('application/json');
    });
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
      const expectedData = {range: {relStart: null, relEnd: null}, timeseries: {eventloop: [], memory: [], cpu: []}};
      const response =  await fetch('http://127.0.0.1:8080/api/timeseries');
      const data = await response.json();

      expect(response.status).to.equal(200);
      expect(data).to.deep.equal(expectedData);
      expect(response.headers.get('content-type')).to.include('application/json');
    });
  });
});
const fetch = require('node-fetch');

const Server = require('../servers/server');

const { assert } = require('chai');

describe('Server tests', function () {
  before(async function() {
    testServer = new Server(['./servers/express.js','http:localhost:8080','--logfile=./test/sample-data.log']);
    return testServer.readyPromise;
  });

  after(async function() {
    return testServer.stop({type: 'signal', value: 'SIGKILL'});
  });

  it('returns data correctly', async function () {
    const response = await fetch('http:127.0.0.1:8080/api');
    const data = await response.json();

    const expectedData = {
      version: '1.0.0',
      timeseries: {
        eventloop: [
          {
            '50': 31.260671,
            '75': 31.358975,
            '90': 31.801343,
            '95': 36.077567,
            '99': 45.809663,
            delta: 1.008
          }
        ],
        memory: [
          {
            delta: 10.085,
            rss: 57.438208,
            heapTotal: 9.13408,
            heapUsedAvg: 5.0048832,
            externalAvg: 5.849006200000001
          }
        ],
        cpu: [
          { delta: 10.085, user: 66.7, system: 16.6 }
        ]
      }
    }

    assert.equal(response.status, 200);
    assert.include(response.headers.get('content-type'), 'application/json');
    assert.deepEqual(data, expectedData);
  });
});
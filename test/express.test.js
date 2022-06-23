const fetch = require('node-fetch');

const Server = require('../servers/server');

const { expect } = require('chai');

describe('Server tests', function () {
  before(async function() {
    testServer = new Server(['./servers/express.js','http:127.0.0.1:8080','--logfile=./test/sample-data.log']);
    return testServer.readyPromise;
  });

  after(async function() {
    return testServer.stop({type: 'signal', value: 'SIGKILL'});
  });

  it('returns correct data', async function () {
    const url = 'http:127.0.0.1:8080/api?first=1655888897602&last=1655888906678&timeseries=eventloop&timeseries=memory';
    const response = await fetch(url);
    const data = await response.json();

    const expectedData = {
      version: '1.0.0',
      range: {first: 1655888897602, last: 1655888906678},
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

    expect(response.status).to.equal(200);
    expect(response.headers.get('content-type')).to.include('application/json');
    expect(data).to.deep.equal(expectedData);
  });
});

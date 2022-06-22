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

    assert.equal(response.status, 200);
    assert.include(response.headers.get('content-type'), 'application/json');
    assert(data.eventloop != undefined && data.memory != undefined && data.cpu != undefined);
  });
});
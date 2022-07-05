const fs = require('fs');
const path = require('path');

const fetch = require('node-fetch');
const FormData = require('form-data');

const Server = require('../servers/server');

const { expect } = require('chai');

describe('Server tests', function () {
  let testServer;
  afterEach(async function() {
    return testServer.stop({type: 'signal', value: 'SIGKILL'});
  });

  it('returns correct data when provided a static file', async function() {
    testServer = new Server(['./servers/express.js','http:127.0.0.1:8080','--logfile=./test/sample-data.log']);
    await testServer.readyPromise;

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

    const url = 'http://127.0.0.1:8080/api?relStart=1655888897602&relEnd=1655888906678&timeseries=eventloop&timeseries=memory';
    const response =  await fetch(url);
    const data = await response.json();
    
    expect(response.status).to.equal(200);
    expect(response.headers.get('content-type')).to.include('application/json');
    expect(data).to.deep.equal(expectedData);
  });

  it('returns correct data when provided no file', async function() {
    testServer = new Server(['./servers/express.js','http:127.0.0.1:8080']);
    await testServer.readyPromise;
    
    const response =  await fetch('http://127.0.0.1:8080/api');
    const data = await response.json();
    
    const expectedData = {
      range: {},
      timeseries: {
        eventloop: [],
        memory: [],
        cpu: []
      }
    };

    expect(response.status).to.equal(200);
    expect(response.headers.get('content-type')).to.include('application/json');
    expect(data).to.deep.equal(expectedData);
  });

  it('only allows text files to be uploaded', async function() {
    testServer = new Server(['./servers/express.js','http:127.0.0.1:8080']);
    await testServer.readyPromise;
    
    // upload a couple files
    const form = new FormData();
    form.append('file', fs.createReadStream(path.join(__dirname, 'sample-data.log')));
    form.append('file', fs.createReadStream(path.join(__dirname, 'servers', 'express.js')));

    const response =  await fetch('http://127.0.0.1:8080/api/upload', {method: 'POST', body: form});
    const data = await response.json();
    
    // check if everything's right
    expect(response.status).to.equal(200);
    expect(data.files.length).to.equal(1);
    expect(data.files[0].mimetype).to.equal('text/plain');

    // delete any files created during the test
    fs.rm(path.join(__dirname, '..', 'uploads', data.files[0].filename), () => {});
  });

  it('starts watching a new logfile when needed', async function() {
    testServer = new Server(['./servers/express.js','http:127.0.0.1:8080']);
    await testServer.readyPromise;

    // upload a file
    const form = new FormData();
    form.append('file', fs.createReadStream(path.join(__dirname, 'sample-data.log')));

    let response = await fetch('http://127.0.0.1:8080/api/upload', {method: 'POST', body: form});
    let data = await response.json();
    
    // set the new logfile
    const newLogfile = data.files[0].filename;
    response = await fetch('http://127.0.0.1:8080/api/watchfile', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({filename: newLogfile}),
    });

    // check if everything's good
    response = await fetch('http://127.0.0.1:8080/api/curr-logfile');
    data = await response.json();

    expect(response.status).to.equal(200);
    expect(data.currentLogfile).to.equal(newLogfile);

    // delete any files created during the test
    fs.rm(path.join(__dirname, '..', 'uploads', newLogfile), () => {});
  });
});


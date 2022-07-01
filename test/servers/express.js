'use strict';

const Server = require('../../servers/skeleton');

// the app
const express = require('express');
const app = express();

// create the routers
const stats = express.Router();
const echo = express.Router();
const read = express.Router();
const create = express.Router();
const stop = express.Router();

app.use('/', stats);
app.use('/', echo);
app.use('/', read);
app.use('/', create);
app.use('/', stop);

stats.use(express.json({limit: '50mb'}));
echo.use(express.json({limit: '50mb'}));
read.use(express.json({limit: '50mb'}));
create.use(express.json({limit: '50mb'}));

// stringify the string and return it
echo.post('/echo', function(req, res) {
  const s = JSON.stringify(req.body);
  res.send(s);
});

read.post('/read', function(req, res) {
  const body = req.body;
  const keys = Object.keys(body);
  for (const k in keys) {
    const x = body[k];
    if (x === 'xyzzy') {
      body[k] = x.repeat(2);
    }
  }
  res.end(JSON.stringify({referenced: keys.length}));
  return;
});

stop.post('/stop/:code', function(req, res) {
  process.exit(+req.params.code);
});

app.get('/info', function(req, res) {
  res.send(JSON.stringify({info: {useful: 'things'}}));
});

app.get('/random-wait', function(req, res, next) {
  const ms = Math.floor(Math.random() * 100);
  setTimeout(() => {
    res.send({waited: ms});
  }, ms);
});

app.get('/wait/:time/:code?', function(req, res) {
  const time = +req.params.time;
  setTimeout(() => {
    if (req.params.code) {
      res.statusCode = +req.params.code;
      res.send({statusCode: 404, message: 'page not found'});
      return;
    }
    res.send({time});
  }, time);
});

let loopCount = 0;
app.get('/loop/:n', function(req, res) {
  let n = +req.params.n;
  if (Number.isNaN(n) || n < 0 || n > 1000000) {
    n = 1000;
  }
  let b = Buffer.alloc(100000);
  // do a hard loop to impact the eventloop
  for (let i = 0; i < n; i++) {
    // eslint-disable-next-line no-unused-vars
    b = Buffer.alloc(100000);
  }
  loopCount += 1;
  res.send(JSON.stringify({loopCount}));
});

// create the server and start listening.
let options;
if (process.argv.length > 2) {
  const protocols = Server.getProtocols(process.argv.slice(2));
  options = {protocols};
}

const server = new Server(app, options);
server.start()
  .then(n => {
    // eslint-disable-next-line no-console
    console.log(process.pid);
  });

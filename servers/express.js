'use strict';

const fs = require('fs');
const path = require('path');

const Skeleton = require('./skeleton');

const {contrast_agent: agent, contrast_tracker: tracker} = global;

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



// parses what should be a tracked object and stringifies it, returning
// stats but not the original object.
echo.post('/meta', function(req, res, next) {
  const protocol = req.socket.encrypted ? 'https' : 'http';
  const t_start = Date.now();
  const s = JSON.stringify(req.body);
  const response = {
    url: `${protocol}://${req.headers.host}`,
    bytes: s.length,
    stringifyTime: Date.now() - t_start,
    agent: !!agent,
    tracker: !!tracker,
  };
  if (tracker) {
    response.tracked = !!tracker.getData(s);
  }
  res.send(response);
});

// stringify the string and return it
echo.post('/echo', function(req, res, next) {
  const s = JSON.stringify(req.body);
  res.send(s);
});

// stringify the same string but not behind a membrane.
echo.post('/noecho/', function(req, res, next) {
  res.send(JSON.stringify(many));
});

read.post('/read', function(req, res, next) {
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

// stringifies what should be an untracked object
create.post('/create', function(req, res, next) {
  const t_start = Date.now();
  let r;
  if (Array.isArray(req.body)) {
    r = big;
  } else {
    r = {
      'many-keys': many,
      'single-key': single
    }[req.body.name];
  }
  const s = JSON.stringify(r);
  const response = {
    bytes: s.length,
    stringifyTime: Date.now() - t_start,
    agent: !!agent,
    tracker: !!tracker
  };
  if (tracker) {
    response.tracked = tracker.getData(s).tracked;
  }
  res.send(response);
});

stop.post('/stop/:code', function(req, res, next) {
  process.exit(+req.params.code);
});

app.get('/info', function(req, res, next) {
  res.send(JSON.stringify({info: {useful: 'things'}}));
});

app.get('/random-wait', function(req, res, next) {
  const ms = Math.floor(Math.random() * 100);
  setTimeout(() => {
    res.send({waited: ms});
  }, ms);
});

app.get('/wait/:time/:code?', function(req, res, next) {
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

const htmlTemplate = fs.readFileSync(path.join(__dirname, 'pages/insertion-test.html'), 'utf8');
app.get('/', function(req, res) {
  const html = populateTemplate(htmlTemplate);
  res.send(html);
});

function populateTemplate(template) {
  /* insert: chart-options */
  template = template.replace('/* insert: chart-options */', makeChartOptions());
  template = template.replace('/* insert: data.addColumn(type, text); */', makeColumnNames());
  template = template.replace('/* insert: data.addRows() */', makeDataRows());
  return template;
}

function makeChartOptions() {
  // title: 'Box Office Earnings in First Two Weeks of Opening',
  // subtitle: 'in millions of dollars (USD)'
  return `title: 'Eventloop lag percentiles (ms)',
  subtitle: '@contrast/route-metrics'`;
}

function makeColumnNames() {
  /* insert: data.addColumn(type, text); */
  //data.addColumn('number', 'Time');
  //data.addColumn('number', 'Guardians of the Galaxy');
  //data.addColumn('number', 'The Avengers');
  //data.addColumn('number', 'Transformers: Age of Extinction');
  return `
    data.addColumn('number', 'ms');
    data.addColumn('number', '99');
    data.addColumn('number', '95');
    data.addColumn('number', '90');
    data.addColumn('number', '75');
    data.addColumn('number', '50');
  `;
}

function makeDataRows() {
  /* insert: data.addRows() */
  return `
  [1,  88, 77.8, 66.5, 55.8, 44.8],
  [2,  88, 77.5, 66.5, 55.4, 44.4],
  [3,  88, 77.1, 66.5, 55.7, 44.7],
  [4,  88, 77.8, 66.5, 55.5, 44.5],
  [5,  88, 77.6, 66.5, 55.4, 44.4],
  [6,  88, 77.6, 66.5, 55.7, 44.7],
  [7,  88, 77.3, 66.5, 55.6, 44.6],
  [8,  88, 77.2, 66.5, 55.6, 44.6],
  [9,  88, 77.9, 66.5, 55.8, 44.8],
  [10, 88, 77.9, 66.6, 55.6, 44.6],
  [11, 88, 77.9, 66.7, 55.7, 44.7],
  [12, 88, 77.4, 66.2, 55.2, 44.2],
  [13, 88, 77.3, 66.6, 55.6, 44.6],
  [14, 88, 77.2, 66.4, 55.4, 44.4],
  `;
}
//
// create the server and start listening.
//
let options;
if (process.argv.length > 2) {
  const protocols = Skeleton.getProtocols(process.argv.slice(2));
  options = {protocols};
}
const server = new Skeleton(app, options);

server.start()
  .then(n => {
    // eslint-disable-next-line no-console
    console.log(process.pid);
  });

'use strict';

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const {clientRoutes, apiRoutes} = require('./routes');

const app = express();

app.use(express.static(path.join(__dirname, '../front-end', 'build')));
app.use(bodyParser.json()); // TODO - Do we need it.
app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api', apiRoutes);
app.use('/', clientRoutes);

module.exports = {
  app,
};

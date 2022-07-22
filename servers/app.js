/* eslint-disable no-console */
'use strict';

const Skeleton = require('./skeleton');
const {app} = require('./express');
const {collector} = require('./collector');

// minimist configs
const argvOptions = {
  alias: {
    l: 'logfile',
  },
  default: {
    l: '',
  },
};
const argv = require('minimist')(process.argv.slice(2), argvOptions);

// eslint-disable-next-line prefer-const
let options, pathToLogFile = argv.logfile;
if (argv._.length) {
  const protocols = Skeleton.getProtocols(argv._);
  options = {protocols};
}

const server = new Skeleton(app, options);

server
  .start()
  .then(() => {
    console.log(process.pid);
    if (pathToLogFile) {
      collector(pathToLogFile);
    }
  });

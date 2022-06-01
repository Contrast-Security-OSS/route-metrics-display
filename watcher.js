'use strict';

const fs = require('fs');

const file = process.argv[2] || 'route-metrics.log';

const logFile = fs.openSync(file);

fs.watchFile(file, function(curr, prev) {
  const bytes = curr.size - prev.size;
  if (bytes <= 0) {
    console.log('no bytes');
    return;
  }

  const buffer = Buffer.allocUnsafe(bytes);

  const nl = '\n'.charCodeAt(0);
  fs.read(logFile, buffer, 0, bytes, prev.size, function(err, bytesRead, buf) {
    //console.log(buffer.toString());
    if (buf[bytes - 1] !== nl) {
      console.log('not newline terminated');
    } else {
      let nlCount = 0;
      for (let i = 0; i < bytes; i++) {
        if (buf[i] === nl) {
          nlCount += 1;
        }
      }
      console.log('newlines', nlCount);
    }
  });

});

'use strict';

const fs = require('fs');
const fsp = require('fs').promises;

const newline = '\n'.charCodeAt(0);

async function* watcher(file) {
  const handle = await fsp.open(file);

  // makes assumption the file will fit in memory. seems like a reasonable
  // constraint.
  let buffer = await fsp.readFile(file);

  //
  // yield the already-written lines
  //
  const lines = getLines(buffer);
  for (const line of lines) {
    if (line === null) {
      break;
    }
    yield line;
  }
  // anything leftover?
  const remainder = lines.next().value;
  if (remainder) {
    console.log('[leftover bytes]');
  }
  console.log('[starting watchFile]');

  // start watching the file now; maybe we should start watching it
  // before reading it in order to not leave a window where added
  // lines would be missed. but that means that watchFile will need
  // to queue buffers/data that is written after the file is read but
  // before the lines have been handed off. so skip for now, but not
  // a real big deal.
  fs.watchFile(file, function(curr, prev) {
    const bytes = curr.size - prev.size;
    if (bytes <= 0) {
      console.log('no bytes');
      return;
    }

    const buffer = Buffer.allocUnsafe(bytes);


    fs.read(handle.fd, buffer, 0, bytes, prev.size, function(err, bytesRead, buf) {
      const lines = getLines(buffer);
      for (const line of lines) {
        if (line === null) {
          break;
        } else {
          console.log(line);
        }
      }
      const remainder = lines.next().value;
      if (remainder) {
        console.log('more leftover bytes');
      }
    });
  });
}

// this doesn't really need async
function* getLines(buffer) {
  // this indexing could fail if the bytes are invalid utf8. (a byte could look
  // like a newline but be part of an improperly encoded multibyte character.)
  let lastNewlineIx = 0;
  let newlineIx;
  while ((newlineIx = buffer.indexOf(newline, lastNewlineIx)) >= 0) {
    let line = buffer.subarray(lastNewlineIx, newlineIx);
    lastNewlineIx = newlineIx + 1;
    yield line.toString('utf8');
  }

  // no more lines
  yield null;

  if (lastNewlineIx < buffer.length) {
    // something is leftover
    return buffer.subArray(lastNewlineIx)
  }

}

module.exports = watcher;

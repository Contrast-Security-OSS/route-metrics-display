'use strict';

const fs = require('fs');
const fsp = require('fs').promises;

const newline = '\n'.charCodeAt(0);

async function* watcher(file) {
  const logFile = await fsp.open(file);

  // makes assumption the file will fit in memory. seems like a reasonable
  // constraint.
  let buffer = await fsp.readFile(file);

  const lines = getLines(buffer);
  for await (const line of lines) {
    if (line === null) {
      break;
    }
  }
  // anything leftover?
  const remainder = (await lines.next()).value;
  if (remainder) {
    console.log('leftover bytes');
  }

  // start watching the file now; maybe we should start watching it
  // before reading it in order to not leave a window where added
  // lines would be missed. but that means that watchFile will need
  // to queue buffers/data until the previous code is finished.
  fs.watchFile(file, function(curr, prev) {
    const bytes = curr.size - prev.size;
    if (bytes <= 0) {
      console.log('no bytes');
      return;
    }

    const buffer = Buffer.allocUnsafe(bytes);


    fs.read(logFile, buffer, 0, bytes, prev.size, function(err, bytesRead, buf) {
      const lines = getLines(buffer);
      let lc = 0;
      for (const line of lines) {
        if (line === null) {
          break;
        }
        lc += 1;
      }
      console.log('got', lc, 'lines')
      const remainder = lines.next().value;
      if (remainder) {
        console.log('more leftover bytes');
      }
    });
  });
}

// this doesn't really need async
async function* getLines(buffer) {
  // this indexing could fail if the bytes are invalid utf8. (a byte could look
  // like a newline but be part of an improperly encoded multibyte character.)
  let lastNewlineIx = 0;
  let newlineIx;
  while ((newlineIx = buffer.indexOf(newline, lastNewlineIx)) >= 0) {
    let line = buffer.subarray(lastNewlineIx, newlineIx);
    lastNewlineIx = newlineIx;
    yield line.toString('utf8');
  }

  // no more lines
  yield null;

  if (lastNewlineIx < buffer.size - 1) {
    // something is leftover
    return buffer.subArray(lastNewlineIx)
  }

}

module.exports = watcher;

if (module.main === module) {
  async function test() {
    const lines = watcher('../route-metrics/route-metrics.log');
    for await (const line of lines) {
      console.log(line);
    }
  }
  test().then(() => console.log('done'));
}

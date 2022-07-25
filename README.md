# ROUTE-METRICS-DISPLAY

`route-metrics-display` was created to visualize data created from `route-metrics`.
It reads a `route-metrics.log` file and displays all the information provided as charts on a webpage.
The file can be provided either by uploading it or through it's local filepath, in which case `route-metrics-display` is gonna continuously watch that file for changes.

# USAGE

Start your server with `route-metrics` first (https://github.com/Contrast-Security-OSS/node-route-metrics for instructions).

After that, execute `git clone https://github.com/Contrast-Security-OSS/route-metrics-display` to clone the current repository.
Once that's done, do `cd route-metrics-display` to visit the new folder and execute `npm i` to install all the dependencies `route-metrics-display` has.

To start the server, simply execute the following command: `node ./servers/express [http:localhost:8080] [--logfile 'path-to-logfile']`.
Everything surrounded by `[]` is optional.

`http:localhost:8080` determines where the server is gonna run. If you omit it, `route-metrics-display` is gonna default to `http://localhost:8888/`. You can either use http or https. Also, any free port can be used.

`--logfile 'path-to-file'` serves the file to watch. This can be omitted if you want to upload the file instead.

NOTE: Currently, any number of files can be uploaded at once.
NOTE: Watching live files works only if they have been passed through the command-line argument.

Once the server is running, just visit `/` to see the charts.

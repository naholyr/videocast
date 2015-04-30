var http = require("http");
var stream = require("./stream");
var Promise = require("i-promise");

module.exports = function (fileToStream, startTime, ffmpegOutput) {
  if (ffmpegOutput === undefined) {
    ffmpegOutput = process.stdout;
  }

  var server = http.createServer(function (req, res) {
    stream(fileToStream, startTime, ffmpegOutput, res);
  });

  return new Promise(function (resolve, reject) {
    server.listen(0);
    server.once("error", reject);
    server.on("listening", function () {
      server.removeListener("error", reject);
      resolve(server);
    });
  });
};

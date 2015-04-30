"use strict";

var controls = require("./tty-controls");
var serve = require("./serve");
var getLocalIP = require("./local-ip");
var debug = require("debug")("cast");
var Promise = require("i-promise");


module.exports = function (device, fileToStream, startTime, ffmpegOutput) {
  return serve(fileToStream, startTime, ffmpegOutput).then(getStreamURL(device)).then(play(device, 0)).then(function () {
    return fileToStream;
  });
};


function getStreamURL (device) {
  return function (server) {
    var remoteHost = device.host;
    var localPort = server.address().port;

    var ip = getLocalIP(remoteHost);
    if (!ip) {
      throw new Error("Could not guess local IP address");
    }

    var url = "http://" + ip + ":" + localPort + "/stream";
    debug("url", url);

    return url;
  };
}

function play (device, startTime) {
  return function (url) {
    return new Promise(function (resolve, reject) {
      device.play(url, startTime, function (err, status) {
        if (err) {
          reject(err);
        }

        controls.start(device, status);

        resolve();
      });
    });
  };
}

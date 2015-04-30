#!/usr/bin/env node

var cast = require("../lib/cast");
var getDevice = require("../lib/device");

var ffmpegOutput = process.env.DEBUG ? process.stdout : null;


console.log("Looking for Chromecast device...");

getDevice()

.then(function (device) {
  console.log("Found!");
  console.log("Streaming to Chromecast...");
  return device;
})

.then(function (device) {
  return cast(device, process.argv[2], process.argv[3], ffmpegOutput);
})

.then(function (filename) {
  console.log("Now playing %s", filename);
})

.catch(function (err) {
  console.error(err.stack);
  process.exit(1);
});

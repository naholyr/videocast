"use strict";

var debug = require("debug")("controls");

// Recognized controls (I hope values are the same on every system…)
var up = "\u001B\u005B\u0041";
var down = "\u001B\u005B\u0042";
var right = "\u001B\u005B\u0043";
var left = "\u001B\u005B\u0044";
var ctrlc = "\u0003";

// Make process.stdin raw
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

// Global state, this is not very elegant I admit
// But as we need to act on process.stdin, we're going full retard, hum, global, so whatever
var device, receiver, volume;

// Listen to keystrokes
process.stdin.on("data", function (key) {
  // Debug keystrokes
  if (process.env.DEBUG) {
    var code = "";
    for (var i = 0; i < key.length; i++) {
      var charCode = key.charCodeAt(i).toString(16).toUpperCase();
      while (charCode.length < 4) {
        charCode = "0" + charCode;
      }
      code += "\\u" + charCode;
    }
    debug("key", code);
  }

  // Ctrl+C
  if (key === ctrlc) {
    if (device) {
      console.log("Stopping media before exit...");
      device.stop(function () { process.exit(0) });
    } else {
      process.exit(0);
    }
  } else if (receiver) {
    // ↑
    if (key === up) {
      receiver.setVolume({level: volume.level + 0.05, muted: false}, onVolume);
    }
    // ↓
    else if (key === down) {
      receiver.setVolume({level: volume.level - 0.05, muted: false}, onVolume);
    }
  }
});


module.exports = {
  "start": function (_device, status) {
    device = _device;
    receiver = _device.client.receiver;
    volume = status.volume;
  },
  "stop": function () {
    device = receiver = volume = null;
  }
};


function onVolume (err, _volume) {
  if (err) {
    console.error("Could not set volume", err.stack);
  } else {
    console.log("Set volume: " + _volume.level);
    volume = _volume;
  }
}

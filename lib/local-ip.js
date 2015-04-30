"use strict";

var interfaces = require("os").networkInterfaces();

// TODO IPv6 compat
module.exports = function (maskIP) {
  var mask = maskIP.substring(0, maskIP.lastIndexOf(".") + 1);

  for (var intf in interfaces) {
    for (var i = 0; i < interfaces[intf].length; i++) {
      var address = interfaces[intf][i];

      if (address.family !== "IPv4") {
        // Not supported yet
        continue;
      }

      if (address.address.indexOf(mask) === 0) {
        return address.address;
      }
    }
  }

  return null;
}

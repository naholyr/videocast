"use strict";

var chromecastjs = require("chromecast-js");
var Promise = require("i-promise");

module.exports = function () {
  var browser = new chromecastjs.Browser();

  return new Promise(function (resolve, reject) {
    browser.on("deviceOn", function (device) {
      device.connect();
      browser.once("error", reject);
      device.on("connected", function () {
        browser.removeListener("error", reject);
        resolve(device);
      });
    });
  });
};

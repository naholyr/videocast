// Dumb copy from mkvcast: https://github.com/maherbeg/mkvcast

"use strict";

var fs = require("fs");
var spawn = require("child_process").spawn;

module.exports = function (fileToStream, startTime, ffmpegOutput, res) {
  if (!res) {
    res = startTime;
    startTime = null;
  }

  if (!startTime) {
    startTime = "00:00:00";
  }

  var fsStats = fs.statSync(fileToStream);

  res.setHeader("Content-Type", "video/x-matroska");
  res.setHeader("Content-Disposition","inline; filename=" + fileToStream + ";");
  res.setHeader("Content-Transfer-Encoding", "binary");
  res.setHeader("Content-Length", fsStats.size);

  var videoEncodingType = /(mkv|mp4|m4v)$/.test(fileToStream) ? "copy" : "libx264";

  // TODO pipe playback time
  var options = [];

  options.push(
    "-ss", startTime,
    "-i", fileToStream);

  var subtitleFileName = fileToStream.replace(/\..+$/, ".srt'");
  if (fs.existsSync(subtitleFileName)) {
    options.push(
      "-vf", "subtitles='"+ subtitleFileName
    );
  }
  options.push(
    "-c:v", videoEncodingType,
    "-c:a", "aac",
    "-ac", "2",
    "-ab", "192k",
    "-strict", "-2", // Needed for ussing aac over libfaac for other platforms
    "-sn", // Avoid the subtitles track
    "-f", "matroska",
    "-");

  var ffmpeg = spawn("ffmpeg", options, {
    stdio: ["ignore", "pipe", ffmpegOutput ? "pipe" : "ignore"]
  });

  var closeFfmpeg = function() {
    ffmpeg.stdout.unpipe(res);
    if (ffmpegOutput) {
      ffmpeg.stderr.unpipe(ffmpegOutput);
    }

    // SIGINT is apparently not being respected...
    ffmpeg.kill("SIGKILL");
  };

  res.on("close", closeFfmpeg);
  res.on("end", closeFfmpeg);

  ffmpeg.stdout.pipe(res);
  if (ffmpegOutput) {
    ffmpeg.stderr.pipe(ffmpegOutput);
  }
};

# videocast

For Chromecast owners: stream a local video to your Chromecast from command-line. Controls (volume, seek, pause...) are read from your terminal, and video is hosted and converted on the fly so you don't have to worry about anything!

## Requirements

* Node
* ffmpeg

## Installation

```sh
npm install -g videocast
```

## Usage

```sh
cast /path/to/file
```

## This is a work in progress!

### What's working

* Converting and casting to local first Chromecast found (conversion is not a gadget, tested on lots of files, without conversion many have no sound)
* Control sound on a Linux terminal

### What's planned

* More controls (forward, backward, pause)
* Check other platforms (different key codes? crappy encodings? who knows...)
* CLI options (start time, ffmpeg output)
* Remove dependency to ffmpeg (if possible)
* Why not making a fully working TTY player interface?

### Want to contribute?

Don't hesitate to fork and propose pull requests! When project is cloned, best way to test is using debug:

```sh
npm install
DEBUG=* ./bin/cast.js /path/to/file
```

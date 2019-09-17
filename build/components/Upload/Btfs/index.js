"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var btfsClient = require('ipfs-http-client');

var path = require('path');

var fs = require('fs');

var prompt = require('prompt');

var Log = require('../../../lib/Log');

var Spinner = require('../../../lib/Spinner');

function builder(yargs) {
  return yargs.positional('file', {
    type: 'string',
    describe: 'the file or the folder which you want to upload to BTFS',
    require: true
  }).option('host', {
    type: 'string',
    describe: 'host of BTFS endpoint',
    default: 'api.btfs.trongrid.io',
    require: true
  }).option('port', {
    type: 'string',
    describe: 'port of BTFS endpoint',
    default: '443',
    require: true
  }).option('protocol', {
    type: 'string',
    describe: 'protocol of BTFS endpoint',
    default: 'https',
    require: true
  }).example('kaizen upload btfs . => to upload the current folder').example('kaizen upload btfs ./build => to upload the build folder in the current folder').demandOption(['file'], '');
}

function handler(_x) {
  return _handler.apply(this, arguments);
}

function _handler() {
  _handler = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(argv) {
    var host, port, protocol, targetPath, result, btfs, filesReadyToBTFS, hashes, hashObj;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            host = argv.host, port = argv.port, protocol = argv.protocol;

            if (!(argv.file === undefined)) {
              _context.next = 7;
              break;
            }

            Log.NormalLog('Please specify a file path or a folder path');
            Log.NormalLog('Use ' + '\'kaizen upload btfs [file]\''.yellow + ' to upload single file');
            Log.NormalLog('Use ' + '\'kaizen upload btfs [folder]\''.yellow + ' to upload with folder');
            return _context.abrupt("return");

          case 7:
            targetPath = path.resolve('./', argv.file);
            _context.next = 10;
            return confirmUploadDialog(targetPath);

          case 10:
            result = _context.sent;

            if (!(/^yes|y$/i.test(result.confirm) === false)) {
              _context.next = 14;
              break;
            }

            Log.NormalLog("Cancel Upload");
            return _context.abrupt("return");

          case 14:
            Spinner.start();
            btfs = btfsClient(host, port, {
              protocol: protocol
            });
            filesReadyToBTFS = getFilesReadyToBTFS(targetPath);
            _context.next = 19;
            return btfs.add(filesReadyToBTFS);

          case 19:
            hashes = _context.sent;
            fs.writeFileSync(path.resolve('./', 'btfs.json'), JSON.stringify(hashes));
            hashObj = hashes.length === 0 ? hashes[0] : hashes[hashes.length - 1];
            Spinner.stop();
            Log.SuccessLog("Upload files to BTFS Successfully");
            console.log("\nFile/Folder hash: ".concat(hashObj.hash));
            Log.NormalLog('You can access the file through:');
            Log.NormalLog("https://gateway.btfssoter.io/btfs/".concat(hashObj.hash).underline.yellow + '\n'); //Log.NormalLog(`${protocol}://${host}/btfs/${hashObj.hash}`.underline.yellow + '\n');

            _context.next = 34;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](0);
            Spinner.stop();
            Log.ErrorLog('something went wrong!');
            console.error(_context.t0);

          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 29]]);
  }));
  return _handler.apply(this, arguments);
}

function confirmUploadDialog(targetPath) {
  var promptSchema = {
    properties: {
      confirm: {
        message: 'Please ensure you will upload ' + targetPath.yellow + ' to the BTFS (yes/no)',
        required: true
      }
    }
  };
  return new Promise(function (resolve, reject) {
    prompt.start();
    prompt.get(promptSchema, function (error, result) {
      if (error) {
        reject(error);
      } else {
        Log.NormalLog('Start uploading...');
        resolve(result);
      }
    });
  });
}

function recursiveFetchFilePath(path) {
  var files = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var readdirSyncs = fs.readdirSync(path);
  readdirSyncs.forEach(function (item) {
    if (item.includes('.DS_Store')) return;

    switch (fs.statSync("".concat(path, "/").concat(item)).isDirectory()) {
      case true:
        files = recursiveFetchFilePath("".concat(path, "/").concat(item), files);
        break;

      case false:
        files.push("".concat(path, "/").concat(item));
        break;
    }
  });
  return files;
}

function getBTFSContentObject(filePath, targetPath) {
  console.log('Upload File: ' + filePath);
  return {
    path: "public".concat(filePath.replace(targetPath, '')),
    content: fs.readFileSync(filePath)
  };
}

function getFilesReadyToBTFS(targetPath) {
  if (fs.lstatSync(targetPath).isDirectory()) {
    var result = recursiveFetchFilePath(targetPath);
    return result.map(function (file) {
      getBTFSContentObject(file, targetPath);
    });
  } else {
    return fs.readFileSync(targetPath);
  }
}

module.exports = function (yargs) {
  var command = 'btfs [file]';
  var commandDescription = 'Upload file or folder to BTFS';
  yargs.command(command, commandDescription, builder, handler);
};
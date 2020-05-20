"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var cmd = require('node-cmd');

var Spinner = require('../../lib/Spinner');

var Log = require('../../lib/Log');

function builder(yargs) {
  return yargs.option('source', {
    alias: 's',
    type: 'string',
    describe: 'Source of oracle service'
  }).example('kaizen oracle --source chainlink').demandOption(['source'], 'Please enter a source name');
}

function handler(_x) {
  return _handler.apply(this, arguments);
}

function _handler() {
  _handler = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(argv) {
    var source;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            source = argv.source;

            if (source) {
              _context.next = 5;
              break;
            }

            Log.NormalLog('Missing plugin statement.\nPlease using \'kaizen plugins uninstall [plugin]\'');
            return _context.abrupt("return");

          case 5:
            _context.t0 = source;
            _context.next = _context.t0 === 'chainlink' ? 8 : 13;
            break;

          case 8:
            Log.NormalLog('Installing oracle, please wait a second...');
            Spinner.start(); // TODO
            // await chainlinkHandler();

            Spinner.stop();
            Log.SuccessLog("Install oracle ".concat(source, " Successfully"));
            return _context.abrupt("break", 14);

          case 13:
            Log.NormalLog('Oracle source not support yet');

          case 14:
            _context.next = 21;
            break;

          case 16:
            _context.prev = 16;
            _context.t1 = _context["catch"](0);
            Spinner.stop();
            Log.ErrorLog('something went wrong!');
            console.error(_context.t1);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 16]]);
  }));
  return _handler.apply(this, arguments);
}

module.exports = function (yargs) {
  var command = 'oracle';
  var commandDescription = 'Create an oracle service';
  yargs.command(command, commandDescription, builder, handler);
};
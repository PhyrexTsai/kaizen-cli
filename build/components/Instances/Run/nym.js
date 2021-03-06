"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Log = require('../../../lib/Log');

var AWSService = require('../../../lib/aws/AWSService');

var path = require('path');

var fsx = require('fs-extra');

module.exports =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var kaizenrc, region, awsService, isExists, keyPair, instance, instances, configuration;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          kaizenrc = fsx.readJsonSync(path.resolve(__dirname, '../../../../.kaizenrc'));
          region = 'us-east-1';

          if (kaizenrc['accessKey']) {
            Log.NormalLog('Configuration:\n'.underline.yellow + 'accessKey' + ': ' + kaizenrc['accessKey'].yellow);
          } else {
            Log.NormalLog("Please set AWS access key by 'kaizen config set --key accessKey --value [Access Key Value]'");
          }

          if (kaizenrc['secretKey']) {
            Log.NormalLog('Configuration:\n'.underline.yellow + 'secretKey' + ': ' + kaizenrc['secretKey'].yellow);
          } else {
            Log.NormalLog("Please set AWS secret key by 'kaizen config set --key secretKey --value [Secret Key Value]'");
          }

          if (kaizenrc['region']) {
            region = kaizenrc['region'];
          }

          awsService = new AWSService(kaizenrc['accessKey'], kaizenrc['secretKey'], region);
          _context.next = 9;
          return awsService.isKeyPairsExists('kaizen-cli');

        case 9:
          isExists = _context.sent;
          keyPair = '';

          if (isExists) {
            _context.next = 15;
            break;
          }

          _context.next = 14;
          return awsService.createKeyPair();

        case 14:
          keyPair = _context.sent;

        case 15:
          _context.next = 17;
          return awsService.runInstance('nym-loopix-mixnode');

        case 17:
          instance = _context.sent;
          instances = [];

          if (kaizenrc['nym-loopix-mixnode']) {
            instances = kaizenrc['nym-loopix-mixnode'];
            instances.push(instance);
          }

          configuration = _objectSpread({}, kaizenrc, {
            "keyPair": keyPair,
            "nym-loopix-mixnode": instances
          });
          fsx.writeJsonSync(path.resolve(__dirname, '../../../../.kaizenrc'), configuration);
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](0);
          Log.ErrorLog('something went wrong!');
          console.error(_context.t0);

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[0, 24]]);
}));
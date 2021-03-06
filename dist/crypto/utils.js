'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBigPrimeAsync = exports.getRandomBigIntAsync = exports.getRandomNbitBigIntAsync = exports.BIG_TWO = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Returns a random BigInt with the given amount of bits.
 * @param {number} bits Number of bits in the output.
 * @returns {BigInt}
 */
var getRandomNbitBigIntAsync = exports.getRandomNbitBigIntAsync = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(bits) {
    var buf, bi;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _crypto2.default.randomBytesAsync(Math.ceil(bits / 8));

          case 2:
            buf = _context.sent;
            bi = new _jsbn.BigInteger(buf.toString('hex'), 16);

            // Trim the result and then ensure that the highest bit is set

            return _context.abrupt('return', trimBigInt(bi, bits).setBit(bits - 1));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getRandomNbitBigIntAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Returns a random BigInt in the given range.
 * @param {BigInt} min Minimum value (included).
 * @param {BigInt} max Maximum value (excluded).
 * @returns {BigInt}
 */


var getRandomBigIntAsync = exports.getRandomBigIntAsync = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(min, max) {
    var range, bi, buf;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            range = max.subtract(min).subtract(_jsbn.BigInteger.ONE);
            bi = void 0;

          case 2:
            _context2.next = 4;
            return _crypto2.default.randomBytesAsync(Math.ceil(range.bitLength() / 8));

          case 4:
            buf = _context2.sent;


            // Offset the result by the minimum value
            bi = new _jsbn.BigInteger(buf.toString('hex'), 16).add(min);

          case 6:
            if (bi.compareTo(max) >= 0) {
              _context2.next = 2;
              break;
            }

          case 7:
            return _context2.abrupt('return', bi);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getRandomBigIntAsync(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Returns a random prime BigInt value.
 * @param {number} bits Number of bits in the output.
 * @returns {BigInt}
 */


var getBigPrimeAsync = exports.getBigPrimeAsync = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(bits) {
    var bi;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getRandomNbitBigIntAsync(bits);

          case 2:
            _context3.t0 = _jsbn.BigInteger.ONE;
            bi = _context3.sent.or(_context3.t0);


            while (!bi.isProbablePrime()) {
              bi = bi.add(BIG_TWO);
            }

            // Trim the result and then ensure that the highest bit is set
            return _context3.abrupt('return', trimBigInt(bi, bits).setBit(bits - 1));

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getBigPrimeAsync(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Parses a BigInt.
 * @param {BigInt|string|number} obj Object to be parsed.
 * @returns {?BigInt}
 */


exports.parseBigInt = parseBigInt;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsbn = require('jsbn');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_crypto2.default);

var BIG_TWO = exports.BIG_TWO = new _jsbn.BigInteger('2');

/**
 * Trims a BigInt to a specific length.
 * @param {BigInt} bi BigInt to be trimmed.
 * @param {number} bits Number of bits in the output.
 * @returns {BigInt}
 */
function trimBigInt(bi, bits) {
  var trimLength = bi.bitLength() - bits;
  return trimLength > 0 ? bi.shiftRight(trimLength) : bi;
}function parseBigInt(obj) {
  if (obj === undefined) return null;

  return obj instanceof Object ? obj : new _jsbn.BigInteger('' + obj);
}
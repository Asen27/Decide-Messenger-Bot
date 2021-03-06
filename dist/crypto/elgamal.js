'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _jsbn = require('jsbn');

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _decryptedValue = require('./decrypted-value');

var _decryptedValue2 = _interopRequireDefault(_decryptedValue);

var _encryptedValue = require('./encrypted-value');

var _encryptedValue2 = _interopRequireDefault(_encryptedValue);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides methods for the ElGamal cryptosystem.
 */
var ElGamal = function () {
  (0, _createClass3.default)(ElGamal, null, [{
    key: 'generatePrivateKey',


    /**
     * Public key.
     * @type {BigInt}
     * @memberof ElGamal
     */

    /**
     * Safe prime number.
     * @type {BigInt}
     * @memberof ElGamal
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(primeNumber) {
        var p, x;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                p = Utils.parseBigInt(primeNumber);
                _context.next = 3;
                return Utils.getRandomBigIntAsync(Utils.BIG_TWO, p.subtract(_jsbn.BigInteger.ONE));

              case 3:
                x = _context.sent;
                return _context.abrupt('return', x);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function generatePrivateKey(_x) {
        return _ref.apply(this, arguments);
      }

      return generatePrivateKey;
    }()

    /**
     * Private key.
     * @type {BigInt}
     * @memberof ElGamal
     */


    /**
     * Generator.
     * @type {BigInt}
     * @memberof ElGamal
     */

  }, {
    key: 'generateAsync',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var primeBits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2048;
        var q, p, g, x, y;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                q = void 0;
                p = void 0;

              case 2:
                _context2.next = 4;
                return Utils.getBigPrimeAsync(primeBits - 1);

              case 4:
                q = _context2.sent;

                p = q.shiftLeft(1).add(_jsbn.BigInteger.ONE);

              case 6:
                if (!p.isProbablePrime()) {
                  _context2.next = 2;
                  break;
                }

              case 7:
                // Ensure that p is a prime

                g = void 0;

              case 8:
                _context2.next = 10;
                return Utils.getRandomBigIntAsync(new _jsbn.BigInteger('3'), p);

              case 10:
                g = _context2.sent;

              case 11:
                if (g.modPowInt(2, p).equals(_jsbn.BigInteger.ONE) || g.modPow(q, p).equals(_jsbn.BigInteger.ONE) ||
                // g|p-1
                p.subtract(_jsbn.BigInteger.ONE).remainder(g).equals(_jsbn.BigInteger.ZERO) ||
                // g^(-1)|p-1 (evades Khadir's attack)
                p.subtract(_jsbn.BigInteger.ONE).remainder(g.modInverse(p)).equals(_jsbn.BigInteger.ZERO)) {
                  _context2.next = 8;
                  break;
                }

              case 12:
                _context2.next = 14;
                return Utils.getRandomBigIntAsync(Utils.BIG_TWO, p.subtract(_jsbn.BigInteger.ONE));

              case 14:
                x = _context2.sent;


                // Generate public key
                y = g.modPow(x, p);
                return _context2.abrupt('return', new ElGamal(p, g, y, x));

              case 17:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function generateAsync() {
        return _ref2.apply(this, arguments);
      }

      return generateAsync;
    }()

    /**
     * Creates a new ElGamal instance.
     * @param {BigInt|string|number} p Safe prime number.
     * @param {BigInt|string|number} g Generator.
     * @param {BigInt|string|number} y Public key.
     * @param {BigInt|string|number} x Private key.
     */

  }]);

  function ElGamal(p, g, y, x) {
    (0, _classCallCheck3.default)(this, ElGamal);

    this.p = Utils.parseBigInt(p);
    this.g = Utils.parseBigInt(g);
    this.y = Utils.parseBigInt(y);
    this.x = x;
  }

  /**
  * Encrypts a message.
  * @param {string|BigInt|number} m Piece of data to be encrypted, which must
  * be numerically smaller than `p`.
  * @param {BigInt|string|number} [k] A secret number, chosen randomly in the
  * closed range `[1, p-2]`.
  * @returns {EncryptedValue}
  */


  (0, _createClass3.default)(ElGamal, [{
    key: 'encryptAsync',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(m, k) {
        var tmpKey, mBi, p, a, b;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = Utils.parseBigInt(k);

                if (_context3.t0) {
                  _context3.next = 5;
                  break;
                }

                _context3.next = 4;
                return Utils.getRandomBigIntAsync(_jsbn.BigInteger.ONE, this.p.subtract(_jsbn.BigInteger.ONE));

              case 4:
                _context3.t0 = _context3.sent;

              case 5:
                tmpKey = _context3.t0;
                mBi = new _decryptedValue2.default(m).bi;
                p = this.p;
                a = this.g.modPow(tmpKey, p);
                b = this.y.modPow(tmpKey, p).multiply(mBi).remainder(p);
                return _context3.abrupt('return', new _encryptedValue2.default(a, b));

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function encryptAsync(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return encryptAsync;
    }()
  }]);
  return ElGamal;
}();

exports.default = ElGamal;
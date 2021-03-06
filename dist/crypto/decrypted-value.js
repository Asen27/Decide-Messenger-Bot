'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _jsbn = require('jsbn');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stores a value which was decrypted by the ElGamal algorithm.
 */
var DecryptedValue = function () {
  function DecryptedValue(m) {
    (0, _classCallCheck3.default)(this, DecryptedValue);

    switch (typeof m === 'undefined' ? 'undefined' : (0, _typeof3.default)(m)) {
      case 'string':
        this.bi = new _jsbn.BigInteger(new Buffer(m).toString('hex'), 16);
        break;
      case 'number':
        this.bi = new _jsbn.BigInteger('' + m);
        break;
      default:
        this.bi = m;
    }
  }
  /**
   * Decrypted message stored as a BigInt.
   * @type BigInt
   * @memberof DecryptedValue
   */


  (0, _createClass3.default)(DecryptedValue, [{
    key: 'toString',
    value: function toString() {
      return new Buffer(this.bi.toByteArray()).toString();
    }
  }]);
  return DecryptedValue;
}();

exports.default = DecryptedValue;
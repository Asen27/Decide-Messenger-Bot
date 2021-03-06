"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stores an ElGamal-encrypted value.
 */
var EncryptedValue = function () {
  /**
   * @type BigInt
   * @memberof EncryptedValue
   */
  function EncryptedValue(a, b) {
    (0, _classCallCheck3.default)(this, EncryptedValue);

    this.a = a;
    this.b = b;
  }

  /**
   * Performs homomorphic multiplication of the current and the given value.
   * @param {EncryptedValue} encryptedValue Value to multiply the current value
   * with.
   * @returns {EncryptedValue}
   */


  /**
   * @type BigInt
   * @memberof EncryptedValue
   */


  (0, _createClass3.default)(EncryptedValue, [{
    key: "multiply",
    value: function multiply(encryptedValue) {
      return new EncryptedValue(this.a.multiply(encryptedValue.a), this.b.multiply(encryptedValue.b));
    }
  }]);
  return EncryptedValue;
}();

exports.default = EncryptedValue;
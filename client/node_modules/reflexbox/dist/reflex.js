'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _contextTypes = require('./context-types');

var _contextTypes2 = _interopRequireDefault(_contextTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reflex = function reflex(Component) {
  var Reflex = function Reflex(props, context) {
    var config = Object.assign({}, _config2.default, context.reflexbox);
    var next = (0, _css2.default)(config)(props);

    return _react2.default.createElement(Component, next);
  };

  Reflex.contextTypes = _contextTypes2.default;

  return Reflex;
};

exports.default = reflex;
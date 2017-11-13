'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var contextTypes = {
  reflexbox: (0, _propTypes.shape)({
    breakpoints: (0, _propTypes.arrayOf)(_propTypes.number),
    space: (0, _propTypes.arrayOf)(_propTypes.number)
  })
};

exports.default = contextTypes;
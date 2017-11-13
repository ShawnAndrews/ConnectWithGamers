'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// todo: make node version
var style = document.createElement('style');
style.id = 'reflexbox';
style.type = 'text/css';
document.head.appendChild(style);

var sheet = style.sheet;

sheet.insert = function (css) {
  return css.map(function (rule) {
    var l = sheet.cssRules.length;
    sheet.insertRule(rule, l);
  });
};

exports.default = sheet;
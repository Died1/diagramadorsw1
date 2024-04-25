"use strict";

var JavaGenerator = require('./Java/JavaGenerator');

var GeneratorFactory = function GeneratorFactory(editorUi, fileName, language) {
  this.editorUi = editorUi;
  this.fileName = fileName;
  this.language = language;
};

GeneratorFactory.prototype.createGenerator = function () {};

module.exports = GeneratorFactory;
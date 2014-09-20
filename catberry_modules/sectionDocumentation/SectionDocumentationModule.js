'use strict';

module.exports = SectionDocumentationModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(SectionDocumentationModule, BaseModule);

/**
 * Creates new instance of section documentation.
 * @param {ServiceLocator} $serviceLocator Service locator to resolve
 * dependencies.
 * @constructor
 * @extends BaseModule
 */
function SectionDocumentationModule($serviceLocator) {
	BaseModule.call(this, $serviceLocator);
}
'use strict';

module.exports = SectionGetStartedModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(SectionGetStartedModule, BaseModule);

/**
 * Creates new instance of section get started.
 * @param {ServiceLocator} $serviceLocator Service locator to resolve
 * dependencies.
 * @constructor
 * @extends BaseModule
 */
function SectionGetStartedModule($serviceLocator) {
	BaseModule.call(this, $serviceLocator);
}
'use strict';

module.exports = SectionGettingStartedModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(SectionGettingStartedModule, BaseModule);

/**
 * Creates new instance of section get started.
 * @param {ServiceLocator} $serviceLocator Service locator to resolve
 * dependencies.
 * @constructor
 * @extends BaseModule
 */
function SectionGettingStartedModule($serviceLocator) {
	BaseModule.call(this, $serviceLocator);
}
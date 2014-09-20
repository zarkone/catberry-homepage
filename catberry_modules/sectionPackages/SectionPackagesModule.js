'use strict';

module.exports = SectionPackagesModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(SectionPackagesModule, BaseModule);

/**
 * Creates new instance of section packages.
 * @param {ServiceLocator} $serviceLocator Service locator to resolve
 * dependencies.
 * @constructor
 * @extends BaseModule
 */
function SectionPackagesModule($serviceLocator) {
	BaseModule.call(this, $serviceLocator);
}
'use strict';

module.exports = SectionOverviewModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(SectionOverviewModule, BaseModule);

/**
 * Creates new instance of section overview.
 * @param {ServiceLocator} $serviceLocator Service locator to resolve
 * dependencies.
 * @constructor
 * @extends BaseModule
 */
function SectionOverviewModule($serviceLocator) {
	BaseModule.call(this, $serviceLocator);
}
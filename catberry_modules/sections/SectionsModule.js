'use strict';

module.exports = SectionsModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(SectionsModule, BaseModule);

/**
 * Creates new instance of sections module.
 * @param {ServiceLocator} $serviceLocator Service locator to resolve
 * dependencies.
 * @constructor
 * @extends BaseModule
 */
function SectionsModule($serviceLocator) {
	BaseModule.call(this, $serviceLocator);
}

/**
 * Renders navigation placeholder.
 * @returns {Object} Data context.
 */
SectionsModule.prototype.renderNavigation = function () {
	return this.createDataContext();
};
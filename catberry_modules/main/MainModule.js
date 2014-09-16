'use strict';

module.exports = MainModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(MainModule, BaseModule);

/**
 * Creates new instance of main module.
 * @param {ServiceLocator} $serviceLocator Service locator to resolve
 * dependencies.
 * @param {Object} application Object with current application parameters.
 * @constructor
 * @extends BaseModule
 */
function MainModule($serviceLocator) {
	BaseModule.call(this, $serviceLocator);
}

/**
 * Renders root placeholder.
 * @returns {Object} Data context.
 */
MainModule.prototype.renderIndex = function () {
	return this.createDataContext();
};
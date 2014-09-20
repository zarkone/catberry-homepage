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
 * Renders pages placeholder.
 * @returns {Object} Data context.
 */
SectionsModule.prototype.renderPages = function () {
	var dc = this.createDataContext();
	dc.pageType = this.$context.state.pageType;
	return dc;
};
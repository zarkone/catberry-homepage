'use strict';

module.exports = SectionOverview;

var util = require('util'),
	ComponentBase = require('../../lib/ComponentBase');

util.inherits(SectionOverview, ComponentBase);
/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "section-overview" component.
 * @constructor
 */
function SectionOverview() {
	ComponentBase.call(this);
}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
SectionOverview.prototype.render = function () {
	var self = this;
	return this.$context.getStoreData()
		.then(function (data) {
			return self.localizeContext(data);
		});
};

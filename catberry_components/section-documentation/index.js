'use strict';

module.exports = SectionDocumentation;

var util = require('util'),
	ComponentBase = require('../../lib/ComponentBase');

util.inherits(SectionDocumentation, ComponentBase);
/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "section-overview" component.
 * @constructor
 */
function SectionDocumentation() {
	ComponentBase.call(this);
}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
SectionDocumentation.prototype.render = function () {
	var self = this;
	return this.$context.getStoreData()
		.then(function (data) {
			return self.localizeContext(data);
		});
};

/**
 * Binds events.
 */
SectionDocumentation.prototype.bind = function () {
	var window = this.$context.locator.resolve('window'),
		highlights = this.$context.element.querySelectorAll('div.highlight');
	for (var i = 0; i < highlights.length; i++) {
		window.hljs.highlightBlock(highlights[i]);
	}
};
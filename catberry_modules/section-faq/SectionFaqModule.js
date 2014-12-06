'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
module.exports = SectionFaqModule;

/**
 * Creates new instance of "section-faq" module.
 * @constructor
 */
function SectionFaqModule() {
	/* constructor code here */
}

/**
 * Renders index template of module.
 * This method is called when need to render "index" template
 * of module "section-faq".
 * @returns {Promise<Object>|Object|undefined} Data context.
 */
SectionFaqModule.prototype.renderIndex = function () {
	return {text: 'Awesome content'};
};

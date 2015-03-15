'use strict';

module.exports = PageOverview;

var util = require('util'),
	ComponentBase = require('../../lib/ComponentBase');

util.inherits(PageOverview, ComponentBase);

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "page-overview" component.
 * @constructor
 */
function PageOverview() {
	ComponentBase.call(this);
}
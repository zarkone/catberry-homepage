/*
 * catberry-homepage
 *
 * Copyright (c) 2014 Julia Rechkunova and project contributors.
 *
 * catberry-homepage's license follows:
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * This license applies to all parts of catberry-homepage that are not externally
 * maintained libraries.
 */

'use strict';

module.exports = InfoModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(InfoModule, BaseModule);

var STATIC_INFO_FILE_TEMPLATE = '/static/info/%s.html';

/**
 * Creates new instance of info module.
 * @param {ServiceLocator} $serviceLocator Locator to resolve dependencies.
 * @param {Object} application Application configuration object.
 * @constructor
 * @extends BaseModule
 */
function InfoModule($serviceLocator, application) {
	BaseModule.call(this, $serviceLocator);
}

/**
 * Gets static content
 * @param {string} templateName
 * @returns {Promise<Object>} Promise for data context.
 * @private
 */
InfoModule.prototype._getStaticContent = function (templateName) {
	var self = this,
		uri = this.$context.location.clone();

	if (!uri.scheme) {
		uri.scheme = 'http';
	}
	uri.query = null;
	uri.fragment = null;
	uri.path = util.format(STATIC_INFO_FILE_TEMPLATE, templateName);

	return this.uhr.get(uri.toString())
		.then(function (result) {
			return self.createDataContext({
					html: result.content || ''
				});
		});
};

/**
 * Renders static quotes section.
 * @returns {Promise<Object>} Promise for data context.
 */
InfoModule.prototype.renderQuotes = function () {
	return this._getStaticContent('quotes');
};
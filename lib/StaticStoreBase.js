/*
 * catberry-homepage
 *
 * Copyright (c) 2015 Denis Rechkunov and project contributors.
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
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This license applies to all parts of catberry-homepage that are not
 * externally maintained libraries.
 */

'use strict';

module.exports = StaticStoreBase;

var util = require('util');

var STATIC_INFO_FILE_TEMPLATE = '/public/html/%s.html';

/**
 * Creates new instance of basic static store.
 * @constructor
 */
function StaticStoreBase() {
	this._uhr = this.$context.locator.resolve('uhr');
}

/**
 * Current UHR to do requests.
 * @type {UHR}
 * @private
 */
StaticStoreBase.prototype._uhr = null;

/**
 * Current lifetime of data (in milliseconds) that is returned by this store.
 * @type {number} Lifetime in milliseconds.
 */
StaticStoreBase.prototype.$lifetime = 3660000;

/**
 * Loads static content from the server.
 * @returns {Promise<{html: String}>} Promise for HTML.
 */
StaticStoreBase.prototype.load = function () {
	var uri = this.$context.location.clone();

	if (!uri.scheme) {
		uri.scheme = 'http';
	}
	uri.query = null;
	uri.fragment = null;
	uri.path = util.format(STATIC_INFO_FILE_TEMPLATE, this.filename);

	return this._uhr.get(uri.toString())
		.then(function (result) {
			if (result.status.code < 200 || result.status.code >= 400) {
				throw new Error(result.status.text);
			}
			return {
				html: result.content || ''
			};
		});
};
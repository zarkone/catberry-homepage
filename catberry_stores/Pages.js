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

module.exports = Pages;

var ALLOWED_PAGES = {
		main: true
	},
	DEFAULT_PAGE = 'main';

/*
 * This is a Catberry Store file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#stores
 */

/**
 * Creates new instance of the "Pages" store.
 * @constructor
 */
function Pages() {

}

/**
 * Current lifetime of data (in milliseconds) that is returned by this store.
 * @type {number} Lifetime in milliseconds.
 */
Pages.prototype.$lifetime = 60000;

/**
 * Loads data from remote source.
 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
 */
Pages.prototype.load = function () {
	var currentPage = this.$context.state.page;
	if (!currentPage) {
		currentPage = DEFAULT_PAGE;
	}
	currentPage = currentPage.toLowerCase();
	if (!ALLOWED_PAGES.hasOwnProperty(currentPage)) {
		currentPage = DEFAULT_PAGE;
	}

	var activePages = {};
	Object.keys(ALLOWED_PAGES)
		.forEach(function (page) {
			activePages[page] = (page === currentPage);
		});

	return {
		currentPage: currentPage,
		activePages: activePages
	};
};

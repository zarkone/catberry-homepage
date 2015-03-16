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

module.exports = ComponentBase;

var l10nHelper = require('./helpers/l10nHelper');

/**
 * Creates new instance of basic component.
 * @constructor
 */
function ComponentBase() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
ComponentBase.prototype.render = function () {
	return this.localizeContext();
};

/**
 * Adds locale to any data object.
 * @param {Object?} data Optional data object.
 * @returns {Object} Data object with locale.
 */
ComponentBase.prototype.localizeContext = function (data) {
	data = data || {};
	data.locale = l10nHelper.getCurrentLocale(this.$context);
	return data;
};

/**
 * Binds events.
 */
ComponentBase.prototype.bind = function () {
	var loaders = this.$context.element.querySelectorAll('div.loader');

	for (var i = 0; i < loaders.length; i++) {
		loaders[i].style.display = 'none';
	}
};
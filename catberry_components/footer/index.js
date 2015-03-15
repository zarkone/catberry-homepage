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

module.exports = Footer;

var util = require('util'),
	ComponentBase = require('../../lib/ComponentBase');
util.inherits(Footer, ComponentBase);

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "footer" component.
 * @extends ComponentBase
 * @constructor
 */
function Footer() {
	ComponentBase.call(this);
}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
Footer.prototype.render = function () {
	var l10n = this.$context.locator.resolve('localizationProvider'),
		context = this.localizeContext();
	context.copyrightText = util.format(
		l10n.get(context.locale, 'COPYRIGHTS'),
		(new Date()).getFullYear()
	);
	return context;
};
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

module.exports = BaseModule;

var util = require('util');

var LOCALE_COOKIE_NAME = 'locale';

var CACHED_GITHUB_API_HOST = '/githubapi';

/**
 * Create new instance of basic module.
 * @param {ServiceLocator} $serviceLocator Service locator
 * to resolve dependencies.
 * @constructor
 */
function BaseModule($serviceLocator) {
	this.config = $serviceLocator.resolve('config');
	this.locator = $serviceLocator;
	this.uhr = $serviceLocator.resolve('uhr');
	this.l10n = $serviceLocator.resolve('localizationProvider');

	this.cacheGithubApiHost = this.config.application.host +
		CACHED_GITHUB_API_HOST;
}

/**
 * Local Github API host.
 * @type {string}
 */
BaseModule.prototype.cacheGithubApiHost = null;

/**
 * Current localization provider.
 * @type {LocalizationProvider}
 */
BaseModule.prototype.l10n = null;

/**
 * Current Universal HTTP(S) Request.
 * @type {UHR}
 */
BaseModule.prototype.uhr = null;

/**
 * Current service locator.
 * @type {ServiceLocator}
 */
BaseModule.prototype.locator = null;

/**
 * Current config instance.
 * @type {Object}
 */
BaseModule.prototype.config = null;

/**
 * Creates data context with additional info.
 * @param {Object?} basicContext Basic data context.
 */
BaseModule.prototype.createDataContext = function (basicContext) {
	basicContext = basicContext || {};
	basicContext.locale = this.getCookieLocale();
	return basicContext;
};

/**
 * Gets locale from cookies.
 * @returns {string}
 */
BaseModule.prototype.getCookieLocale = function () {
	return this.$context.cookies.get(LOCALE_COOKIE_NAME);
};
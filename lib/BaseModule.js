'use strict';

module.exports = BaseModule;

var util = require('util');

var LOCALE_COOKIE_NAME = 'locale';

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
	this.github = $serviceLocator.resolve('githubApiClient');
}

/**
 * Current Github API client.
 * @type {GithubApiClient}
 */
BaseModule.prototype.github = null;

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
 * @param {Object} basicContext Basic data context.
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
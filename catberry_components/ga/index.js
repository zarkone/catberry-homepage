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

module.exports = Ga;

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "ga" component.
 * @param {Object} $config Current application config.
 * @constructor
 */
function Ga($config) {
	this._config = $config.googleAnalytics || {};
	if (this.$context.isBrowser) {
		this._window = this.$context.locator.resolve('window');
	}
}

/**
 * Google Analytics config.
 * @type {Object}
 * @private
 */
Ga.prototype._config = null;

/**
 * Object "window".
 * @type {Object}
 * @private
 */
Ga.prototype._window = null;

/**
 * Determines if analytics is initialized.
 * @type {boolean}
 * @private
 */
Ga.prototype._isInitialized = false;

/**
 * Returns event binding settings for the component.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
 */
Ga.prototype.bind = function () {
	if (!this._config.id || typeof(this._window.ga) !== 'function') {
		return;
	}
	if (this._isInitialized) {
		return;
	}
	this._isInitialized = true;
	this._window = this.$context.locator.resolve('window');
	this._window.ga('create', this._config.id || null, 'auto');
	this._window.ga('send', 'pageview', getLocation(this.$context));
	this.trackPages();
	this.trackErrors();
};

/**
 * Tracks pages.
 */
Ga.prototype.trackPages = function () {
	if (typeof(this._window.ga) !== 'function') {
		return;
	}

	var self = this;
	// track pages
	this.$context.on('componentRendered', function (event) {
		if (event.name !== 'head') {
			return;
		}
		self._window.ga('send', 'pageview', getLocation(event.context));
	});
};

/**
 * Tracks errors.
 */
Ga.prototype.trackErrors = function () {
	var self = this;
	// track errors
	this.$context.on('error', function (error) {
		self._window.ga('send', 'event', 'error', error ? error.stack : '');
	});
};

/**
 * Gets location for analytics.
 * @param {Object} context Component context.
 * @returns {string} URL.
 */
function getLocation(context) {
	var location = context.location.clone();
	location.scheme = null;
	location.authority = null;

	return location.toString();
}
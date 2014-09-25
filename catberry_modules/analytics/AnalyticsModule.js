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

module.exports = AnalyticsModule;

var util = require('util'),
	BaseModule = require('../../lib/BaseModule');

util.inherits(AnalyticsModule, BaseModule);

/**
 * Creates new instance of analytics module.
 * @param {ServiceLocator} $serviceLocator Locator to resolve dependencies.
 * @param {Object} googleAnalytics Google Analytics configuration.
 * @constructor
 * @extends BaseModule
 */
function AnalyticsModule($serviceLocator, googleAnalytics) {
	BaseModule.call(this, $serviceLocator);

	this._googleAnalytics = googleAnalytics;

	if (!googleAnalytics || !googleAnalytics.id) {
		return;
	}

	if (this.$context.isBrowser) {
		this._window = this.locator.resolve('window');
		this.trackEvents();
		this.trackFormSubmitting();
		this.trackPages();
		this.trackErrors();
	}
}

/**
 * Object "window".
 * @type {Object}
 * @private
 */
AnalyticsModule.prototype._window = null;

/**
 * Google Analytics config.
 * @type {Object}
 * @private
 */
AnalyticsModule.prototype._googleAnalytics = null;

/**
 * Renders tracking code placeholder.
 * @returns {Object} Data context.
 */
AnalyticsModule.prototype.renderTrackingCode = function () {
	return {
		page: this.$context.urlPath,
		googleAnalyticsId: this._googleAnalytics ?
			this._googleAnalytics.id : null
	};
};

/**
 * Tracks events.
 */
AnalyticsModule.prototype.trackEvents = function () {
	if (typeof(this._window.ga) !== 'function') {
		return;
	}
	// track events
	this.$context.on('eventRouted', function (args) {
		if (!args.isStarted) {
			return;
		}
		this._window.ga(
			'send',
			'event',
			'event',
			args.eventName,
			this._window.location.hash || 'empty hash'
		);
	});
};

/**
 * Tracks form submitting.
 */
AnalyticsModule.prototype.trackFormSubmitting = function () {
	if (typeof(this._window.ga) !== 'function') {
		return;
	}
	// track form submitting
	this.$context.on('formSubmitted', function (args) {
		this._window.ga(
			'send',
			'event',
			'form',
			'module: ' + args.moduleName + ', form: ' + args.name,
			this._window.location.hash || 'empty hash'
		);
	});
};

/**
 * Tracks pages.
 */
AnalyticsModule.prototype.trackPages = function () {
	if (typeof(this._window.ga) !== 'function') {
		return;
	}
	// track pages
	this.$context.on('pageRendered', function (args) {
		this._window.ga('send', 'pageview', args.urlPath);
	});
};

/**
 * Tracks errors.
 */
AnalyticsModule.prototype.trackErrors = function () {
	if (typeof(this._window.ga) !== 'function') {
		return;
	}
	// track errors
	this.$context.on('error', function (error) {
		this._window.ga('send', 'event', 'error', error ? error.stack : '');
	});
};

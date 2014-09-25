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

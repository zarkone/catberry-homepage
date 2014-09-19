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
		this.trackEvents();
		this.trackFormSubmitting();
		this.trackPages();
		this.trackErrors();
	}
}

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
	if (typeof(ga) !== 'function') {
		return;
	}
	// track events
	this.$context.on('eventRouted', function (args) {
		if (!args.isStarted) {
			return;
		}
		ga('send', 'event',
			'event',
			args.eventName,
				window.location.hash || 'empty hash'
		);
	});
};

/**
 * Tracks form submitting.
 */
AnalyticsModule.prototype.trackFormSubmitting = function () {
	if (typeof(ga) !== 'function') {
		return;
	}
	// track form submitting
	this.$context.on('formSubmitted', function (args) {
		ga('send', 'event', 'form',
				'module: ' + args.moduleName + ', form: ' + args.name,
				window.location.hash || 'empty hash'
		);
	});
};

/**
 * Tracks pages.
 */
AnalyticsModule.prototype.trackPages = function () {
	if (typeof(ga) !== 'function') {
		return;
	}
	// track pages
	this.$context.on('pageRendered', function (args) {
		ga('send', 'pageview', args.urlPath);
	});
};

/**
 * Tracks errors.
 */
AnalyticsModule.prototype.trackErrors = function () {
	if (typeof(ga) !== 'function') {
		return;
	}
	// track errors
	this.$context.on('error', function (error) {
		ga('send', 'event', 'error', error ? error.stack : '');
	});
};

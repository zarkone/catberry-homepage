'use strict';

module.exports = GithubApiClient;

var util = require('util');

var ERROR_GITHUB_API_HOST = 'Github API host should be specified',
	ERROR_FIELDS_REQUIRED = 'These fields are required: %s',
	TRACE_API_REQUEST_FORMAT =
		'Request to Github API "%s"',
	TRACE_API_RESPONSE_FORMAT =
		'Response from Github API "%s" (%dms)';

/**
 * Creates new instance of Github API client.
 * @param {UHR} $uhr Universal HTTP request.
 * @param {Object} $config Configuration object for Github API.
 * @param {Logger} $logger Logger to log API request.
 * @constructor
 */
function GithubApiClient($uhr, $config, $logger) {
	var githubApi = $config.githubApi || {};

	this._logger = $logger;
	this._unsafeHTTPS = $config.unsafeHTTPS;
	this._uhr = $uhr;
	if (!githubApi.host) {
		throw new Error(ERROR_GITHUB_API_HOST);
	}
	this._host = githubApi.host;
}

/**
 * Current logger.
 * @type {Logger}
 * @private
 */
GithubApiClient.prototype._logger = null;

/**
 * If true HTTPS works without certificate verification.
 * @type {boolean}
 * @private
 */
GithubApiClient.prototype._unsafeHTTPS = false;

/**
 * Current Universal HTTP Request.
 * @type {UHR}
 * @private
 */
GithubApiClient.prototype._uhr = null;

/**
 * Gets any data from Github API.
 * @param {Object} context Module context.
 * @param {string} apiPath Path of API request (i.e. /users/100500).
 * @param {Object?} query Object with query string parameters.
 * @returns {Promise<Object>} Promise for result content.
 */
GithubApiClient.prototype.get = function (context, apiPath, query) {
	return this.request(context, 'get', apiPath, query);
};

/**
 * Does request to Github API.
 * @param {Object} context Module context.
 * @param {string} method HTTP method.
 * @param {string} apiPath API path.
 * @param {Object} query query parameters.
 * @returns {Promise<Object>} Promise for result content.
 */
GithubApiClient.prototype.request =
	function (context, method, apiPath, query) {
		query = query || {};

		var self = this,
			requestUrl = this._buildUrl(apiPath);

		var now = new Date();
		this._logger.trace(util.format(
			TRACE_API_REQUEST_FORMAT, requestUrl));

		return this._uhr[method](requestUrl, {
			data: query,
			unsafeHTTPS: this._unsafeHTTPS
		})
			.then(function (result) {
				self._logger.trace(util.format(TRACE_API_RESPONSE_FORMAT,
					requestUrl, (new Date() - now)
				));

				result.content = typeof(result.content) === 'object' ?
					result.content : {};

				if (isStatusCodeBad(result.status.code)) {
					var reason = new Error(result.status.text);
					reason.details = result.content;
					throw reason;
				}
				return result.content;
			});
	};

/**
 * Builds URL for API request.
 * @param {string} apiPath URL path of API request.
 * @returns {string} URL for API request.
 * @private
 */
GithubApiClient.prototype._buildUrl = function (apiPath) {
	return this._host + apiPath;
};

/**
 * Determines is status code is error.
 * @param {number} statusCode HTTP status code.
 * @returns {boolean} true of code is error.
 */
function isStatusCodeBad(statusCode) {
	return statusCode < 200 || statusCode >= 400;
}
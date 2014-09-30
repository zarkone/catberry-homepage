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
	this._config = githubApi;
}

/**
 * Github API config.
 * @type {Object}
 * @private
 */
GithubApiClient.prototype._config = null;

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
 * Gets readme from Github API.
 * @param {Object} params Object with parameters.
 * @param {string} params.owner Owner of repo.
 * @param {string} params.repo Repo name.
 * @returns {Promise<Object>} Promise for result content.
 */
GithubApiClient.prototype.getReadme = function (params) {
	if (!params.owner || !params.repo) {
		throw new Error(
			util.format(ERROR_FIELDS_REQUIRED, 'owner, repo')
		);
	}
	return this.get('/repos/' + params.owner + '/' + params.repo + '/readme');
};

/**
 * Gets any data from Github API.
 * @param {string} apiPath Path of API request (i.e. /users/100500).
 * @param {Object?} query Object with query string parameters.
 * @returns {Promise<Object>} Promise for result content.
 */
GithubApiClient.prototype.get = function (apiPath, query) {
	return this.request('get', apiPath, query);
};

/**
 * Does request to Github API.
 * @param {string} method HTTP method.
 * @param {string} apiPath API path.
 * @param {Object} query query parameters.
 * @returns {Promise<Object>} Promise for result content.
 */
GithubApiClient.prototype.request =
	function (method, apiPath, query) {
		query = query || {};
		this._updateQueryWithSecret(query);

		var self = this,
			requestUrl = this._buildUrl(apiPath);

		var now = new Date();
		this._logger.trace(util.format(
			TRACE_API_REQUEST_FORMAT, requestUrl));

		return this._uhr[method](requestUrl, {
			data: query,
			unsafeHTTPS: this._unsafeHTTPS,
			headers: {
				Accept: 'application/vnd.github.3.html'
			}
		})
			.then(function (result) {
				self._logger.trace(util.format(TRACE_API_RESPONSE_FORMAT,
					requestUrl, (new Date() - now)
				));

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
	return this._config.host + apiPath;
};

/**
 * Update query object: add client_id and client_secret to it.
 * @param {Object} query query parameters.
 * @private
 */
/*jshint camelcase:false */
GithubApiClient.prototype._updateQueryWithSecret = function (query) {
	query = query || {};
	query.client_id = this._config.clientId;
	query.client_secret = this._config.clientSecret;
};

/**
 * Determines is status code is error.
 * @param {number} statusCode HTTP status code.
 * @returns {boolean} true of code is error.
 */
function isStatusCodeBad(statusCode) {
	return statusCode < 200 || statusCode >= 400;
}
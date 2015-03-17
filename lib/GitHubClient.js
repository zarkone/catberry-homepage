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

module.exports = GitHubClient;

var util = require('util');

var ERROR_GITHUB_API_HOST = 'Github API host should be specified',
	TRACE_API_REQUEST_FORMAT =
		'Request to Github API %s %s',
	TRACE_API_RESPONSE_FORMAT =
		'Response from Github API %s %s (%dms)',
	DOCUMENTATION_URL_RAW = 'https://github.com/catberry/catberry' +
		'/raw/master/docs/',
	DOCUMENTATION_URL = 'https://github.com/catberry/catberry' +
		'/blob/master/docs/';

var DOCUMENTS = {
	'overview.html': 'getReadme',
	'documentation.html': 'getDocumentation'
};

/**
 * Creates new instance of Github API client.
 * @param {UHR} $uhr UHR to do requests.
 * @param {Logger} $logger Logger to log API request.
 * @param {Object} gitHubClient Configuration.
 * @constructor
 */
function GitHubClient($uhr, $logger, gitHubClient) {
	if (!gitHubClient || !gitHubClient.host) {
		throw new Error(ERROR_GITHUB_API_HOST);
	}
	this._uhr = $uhr;
	this._logger = $logger;
	this._config = gitHubClient || {};
}

/**
 * Current logger.
 * @type {Logger}
 * @private
 */
GitHubClient.prototype._logger = null;

/**
 * Current configuration.
 * @type {Object}
 * @private
 */
GitHubClient.prototype._config = null;

/**
 * Current UHR.
 * @type {UHR}
 * @private
 */
GitHubClient.prototype._uhr = null;

/**
 * Gets middleware for Express.
 * @returns {Function} Middleware function.
 */
GitHubClient.prototype.getMiddleware = function () {
	var self = this;
	return function (request, response, next) {
		var urlPath = request.path.toLowerCase(),
			parts = urlPath.split('/'),
			document = parts[parts.length - 1];

		if (!DOCUMENTS.hasOwnProperty(document)) {
			next();
			return;
		}

		var methodName = DOCUMENTS[document];
		self[methodName]()
			.then(function (content) {
				response.send(content);
			})
			.catch(function (error) {
				response.status(503).send(error.message);
			});
	};
};

/**
 * Gets readme from Github API.
 * @returns {Promise<Object>} Promise for result content.
 */
GitHubClient.prototype.getReadme = function () {
	return this.request({
		url: this._buildUrl('/repos/catberry/catberry/readme'),
		method: 'GET',
		headers: {
			Accept: 'application/vnd.github.VERSION.html'
		}
	})
		.then(function (result) {
			return result.content;
		});
};

/**
 * Gets readme from Github API.
 * @returns {Promise<Object>} Promise for result content.
 */
GitHubClient.prototype.getDocumentation = function () {
	var self = this;
	return self.request({
		url: self._buildUrl(
			'/repos/catberry/catberry/contents/docs/index.md'
		),
		headers: {
			Accept: 'application/vnd.github.VERSION.html'
		},
		method: 'GET'
	})
		.then(function (result) {
			return result.content
				// restore fragment navigation
				.replace(/id="user-content-(.+)"/ig, 'id="$1"')
				.replace(/(src|href)="([^#][^"]+)"/ig, function (match, p1, p2) {
					return /^.+:\/\//.test(p2) ?
						match :
						p1 + '="' +
						(p1 === 'src' ?
							DOCUMENTATION_URL_RAW :
							DOCUMENTATION_URL
						) +
						p2 + '"';
				});
		});
};

/**
 * Does request to GitHub API.
 * @param {Object} parameters Request parameters.
 * @returns {Promise.<Object>} Promise for result content.
 */
GitHubClient.prototype.request = function (parameters) {
	if (!this._config.accessToken) {
		return Promise.reject(new Error('No access token specified'));
	}
	parameters = parameters || {};

	this._logger.trace(util.format(
		TRACE_API_REQUEST_FORMAT, parameters.method, parameters.url
	));
	var self = this,
		start = Date.now();

	if (!parameters.data) {
		parameters.data = {};
	}

	// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
	parameters.data.access_token = this._config.accessToken;

	return this._uhr.request(parameters)
		.then(function (result) {
			var duration = Date.now() - start;
			self._logger.trace(util.format(
				TRACE_API_RESPONSE_FORMAT,
				parameters.method, parameters.url, duration
			));
			checkStatus(result.status);
			return result;
		});
};

/**
 * Builds full URL for request.
 * @param {String} path URL path.
 * @returns {String} Full URL to API.
 * @private
 */
GitHubClient.prototype._buildUrl = function (path) {
	return this._config.host + path;
};

/**
 * Checks HTTP status.
 * @param {Object} status UHR status object.
 */
function checkStatus(status) {
	if (status.code < 200 || status.code >= 400) {
		throw new Error(status.text);
	}
}
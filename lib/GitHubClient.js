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

module.exports = GitHubClient;

var util = require('util');

var ERROR_GITHUB_API_HOST = 'Github API host should be specified',
	ERROR_FIELDS_REQUIRED = 'These fields are required: %s',
	TRACE_API_REQUEST_FORMAT =
		'Request to Github API %s %s',
	TRACE_API_RESPONSE_FORMAT =
		'Response from Github API %s %s (%dms)';

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
	this._config = gitHubClient;
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
 * Gets readme from Github API.
 * @param {Object} context Module context.
 * @param {string} owner Owner of repo.
 * @param {string} repository Repo name.
 * @returns {Promise<Object>} Promise for result content.
 */
GitHubClient.prototype.getReadme = function (context, owner, repository) {
	if (!owner || !repository) {
		throw new Error(
			util.format(ERROR_FIELDS_REQUIRED, 'owner, repo')
		);
	}
	return this.request(context, {
		url: this._buildUrl('/repos/' + owner + '/' + repository + '/readme'),
		method: 'GET',
		headers: {
			Accept: 'application/vnd.github.VERSION.html'
		}
	})
		.then(function (result) {
			if (isStatusCodeBad(result.status.code)) {
				throw new Error(result.status.text);
			}
			return result.content;
		});
};

/**
 * Does request to GitHub API.
 * @param {Object} context Module context.
 * @param {Object} parameters Request parameters.
 * @returns {Promise.<Object>} Promise for result content.
 */
GitHubClient.prototype.request = function (context, parameters) {
	parameters = parameters || {};

	this._logger.trace(util.format(
		TRACE_API_REQUEST_FORMAT, parameters.method, parameters.url
	));
	var self = this,
		start = Date.now();

	return this._uhr.request(parameters)
		.then(function (result) {
			var duration = Date.now() - start;
			self._logger.trace(util.format(
				TRACE_API_RESPONSE_FORMAT,
				parameters.method, parameters.url, duration
			));
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

function isStatusCodeBad(code) {
	return (code < 200 || code >= 400);
}
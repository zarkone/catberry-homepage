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

var url = require('url');

/**
 * Cached github api
 * @param {GithubApiClient} githubApi
 * @constructor
 */
function CachedGithubApi (githubApi, expiredAfterMinutes) {
	this._api = githubApi;
	this._cache = {};
	this._expiredAfterMinutes = expiredAfterMinutes || this._expiredAfterMinutes;
}

/**
 * Github Api client
 * @type {GithubApiClient}
 * @private
 */
CachedGithubApi.prototype._api = null;

/**
 * Cache
 * @type {Object}
 * @private
 */
CachedGithubApi.prototype._cache = {};

/**
 * Expired after X hours
 * @type {number}
 * @private
 */
CachedGithubApi.prototype._expiredAfterMinutes = 60;

/**
 * Send JSON response
 * @param {ServerResponse} response
 * @param {Object} data
 */
CachedGithubApi.prototype.sendResponse = function (response, data) {
	response.writeHead(200, {
		'Content-Type': 'application/json'
	});
	response.end(JSON.stringify(data));
};

/**
 * Middleware handler
 * @param {ServerRequest} request
 * @param {ServerResponse} response
 * @param {Function} next
 */
CachedGithubApi.prototype.getMiddleware = function (request, response, next) {
	if (request.method !== 'GET') {
		next();
		return;
	}

	var self = this,
		parsedUrl = url.parse(request.url, true),
		dataFromCache = this.getData(parsedUrl.path);

	if (dataFromCache) {
		this.sendResponse(response, dataFromCache);
		return;
	}

	if (parsedUrl.pathname === '/githubapi/readme') {
		this._api.getReadme(parsedUrl.query)
			.then(function (data) {
				var responseData = {
					content: data,
					info: parsedUrl.query
				};
				self.setData(parsedUrl.path, responseData);
				self.sendResponse(response, responseData);
			}, function () {
				next();
			});
		return;
	}

	next();
};

/**
 * Get from cache
 * @param {string} key
 * @return {Object|null}
 */
CachedGithubApi.prototype.getData = function (key) {
	var storedData = this._cache[key];

	if (!storedData || !storedData.data) {
		return null;
	}

	if ((new Date()).getTime() > storedData.expiredDate) {
		return null;
	}

	return storedData.data;
};

/**
 * Set to cache
 * @param {string} key
 * @param {Object} data
 */
CachedGithubApi.prototype.setData = function (key, data) {
	var expiredDate = new Date();
	expiredDate.setMinutes(expiredDate.getMinutes() + this._expiredAfterMinutes);
	this._cache[key] = {
		data: data,
		expiredDate: expiredDate.getTime()
	};
};

module.exports = function (githubApi, config) {
	var cachedGithubApi = new CachedGithubApi(
		githubApi, config.githubApi.expiredAfterMinutes
	);
	return function (request, response, next) {
		cachedGithubApi.getMiddleware(request, response, next);
	};
};
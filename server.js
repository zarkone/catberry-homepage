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

var l10n = require('catberry-l10n'),
	GithubApiClient = require('./lib/GithubApiClient'),
	catberry = require('catberry'),
	isRelease = process.argv.length === 3 ?
		process.argv[2] === 'release' : undefined;

var http = require('http'),
	path = require('path'),
	publicPath = path.join(__dirname, 'public'),
	connect = require('connect'),
	configLoader = require('./lib/configLoader'),
	config = configLoader.load('server'),
	cat = catberry.create(config),
	app = connect();

config.publicPath = publicPath;
config.isRelease = isRelease === undefined ? config.isRelease : isRelease;

cat.locator.register('githubApiClient', GithubApiClient, config, true);

// registers all localization components in locator
l10n.register(cat.locator);

var localizationLoader = cat.locator.resolve('localizationLoader');

// turn on GZIP when in release mode
if (isRelease) {
	app.use(connect.compress());
}

app.use(connect.static(publicPath));
// sets locale to cookie and handles /l10n.js
app.use(localizationLoader.getMiddleware());
app.use(cat.getMiddleware());
app.use(connect.errorHandler());
http
	.createServer(app)
	.listen(config.server.port || 3000);

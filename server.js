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

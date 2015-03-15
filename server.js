'use strict';

var catberry = require('catberry'),
	isRelease = process.argv.length === 3 ?
		process.argv[2] === 'release' : undefined;

var http = require('http'),
	util = require('util'),
	path = require('path'),
	publicPath = path.join(__dirname, 'public'),
	express = require('express'),
	configLoader = require('./lib/configLoader'),
	config = configLoader.load(),
	templateEngine = require('catberry-handlebars'),
	l10n = require('catberry-l10n'),
	localizationHelper = require('catberry-l10n-handlebars-helper'),
	GitHubClient = require('./lib/GitHubClient'),
	cat = catberry.create(config),
	app = express();

var READY_MESSAGE = 'Ready to handle incoming requests on port %d';

config.publicPath = publicPath;
config.server.port = config.server.port || 3000;
config.isRelease = isRelease === undefined ? config.isRelease : isRelease;

templateEngine.register(cat.locator);
l10n.register(cat.locator);
localizationHelper.register(cat.locator);

var serveStatic = require('serve-static');
app.use('/public', serveStatic(publicPath));

var gitHubClient = cat.locator.resolveInstance(GitHubClient, config);
app.use('/public/html/github', gitHubClient.getMiddleware());

var localizationLoader = cat.locator.resolve('localizationLoader');
app.use(localizationLoader.getMiddleware());

app.use(cat.getMiddleware());

var errorhandler = require('errorhandler');
app.use(errorhandler());

cat.events.on('ready', function () {
	var logger = cat.locator.resolve('logger');
	logger.info(util.format(READY_MESSAGE, config.server.port));
});

http
	.createServer(app)
	.listen(config.server.port);

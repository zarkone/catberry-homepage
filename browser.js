'use strict';

var l10n = require('catberry-l10n'),
	lazyLoader = require('catberry-lazy-loader'),
	GithubApiClient = require('./lib/GithubApiClient'),
	catberry = require('catberry'),
	configLoader = require('./lib/configLoader'),
	config = configLoader.load('client'),
	cat = catberry.create(config);

lazyLoader.register(cat.locator);
l10n.register(cat.locator);
cat.locator.register('githubApiClient', GithubApiClient, config, true);
cat.startWhenReady();

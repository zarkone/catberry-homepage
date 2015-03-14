'use strict';

var catberry = require('catberry'),
	// this config will be replaced by `./config/browser.json` when building
	// because of `browser` field in `package.json`
	configLoader = require('./lib/configLoader'),
	config = configLoader.load(),
	templateEngine = require('catberry-handlebars'),
	l10n = require('catberry-l10n'),
	localizationHelper = require('catberry-l10n-handlebars-helper'),
	cat = catberry.create(config);

// register template provider to Catberry Service Locator
templateEngine.register(cat.locator);
l10n.register(cat.locator);
localizationHelper.register(cat.locator);
cat.startWhenReady();
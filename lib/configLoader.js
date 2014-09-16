'use strict';

var util = require('util');

module.exports = {
	/**
	 * Loads configuration by name and merge it with basic.
	 * @param {string} configuration Configuration name.
	 * @returns {Object} Merged configuration.
	 */
	load: function (configuration) {
		var baseConfig = require('../configs/basic.json'),
			environmentConfig = require('../configs/environment.json');

		return merge(baseConfig, environmentConfig);
	}
};

/**
 * Merges pair of objects into first.
 * @param {Object} obj1 First object.
 * @param {Object} obj2 Second object.
 * @returns {Object} Merged object.
 */
function merge(obj1, obj2) {
	if (typeof(obj1) !== 'object') {
		return obj2;
	}

	Object.keys(obj2)
		.forEach(function (key) {
			if (util.isArray(obj2[key]) &&
				util.isArray(obj1[key])) {
				obj1[key] = obj1[key].concat(obj2[key]);
			} else if (typeof(obj2[key]) === 'object' &&
				typeof(obj1[key]) === 'object') {
				obj1[key] = merge(obj1[key], obj2[key]);
			} else {
				obj1[key] = obj2[key];
			}
		});
	return obj1;
}
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

var util = require('util');

module.exports = {
	/**
	 * Loads configuration and merge basic and
	 * environment-related configuration.
	 * @returns {Object} Merged configuration.
	 */
	load: function () {
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
'use strict';

// this file defines rules how URLs in request router will be translated to
// catberry's module-render methods.

function getPageMap(pageName) {
	return function (state) {
		state.sections = state.sections || {};
		state.sections.pageType = pageName;
		return state;
	};
}

module.exports = [
	{
		expression: '/',
		map: getPageMap('main')
	},
	{
		// /overview
		expression: '/overview',
		map: getPageMap('overview')
	}
	,
	{
		// /get-started
		expression: '/getting-started',
		map: getPageMap('getting-started')
	},
	{
		// /documentation
		expression: '/documentation',
		map: getPageMap('documentation')
	},
	{
		// /packages
		expression: '/packages',
		map: getPageMap('packages')
	}
];
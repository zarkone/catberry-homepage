'use strict';

var isRelease = false,
	path = require('path'),
	util = require('util'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	minifyCSS = require('gulp-minify-css'),
	clean = require('gulp-rimraf'),
	es = require('event-stream'),
	fs = require('fs'),
	raster = require('gulp-raster'),
	rename = require('gulp-rename'),
	svgmin = require('gulp-svgmin'),
	kss = require('gulp-kss'),
	less = require('gulp-less');

var STYLE_GUIDE_OVERVIEW = 'overview.md',
	STYLE_GUIDE_TEMPLATE = 'template',
	LESS_IMPORT_FORMAT = '@import "%s";',
	MAIN_MODULE = 'main',
	STYLE_FILENAME = 'style.css',
	STYLE_LESS_FILE = 'style.less';

var DIRECTORY_NAMES = {
	LESS: 'less',
	TEMPORARY: '_tmp',
	CATBERRY_MODULES: 'catberry_modules',
	COMPILED: 'compiled',
	PLACEHOLDERS: 'placeholders',
	PUBLIC: 'public',
	ASSETS: 'assets',
	STYLEGUIDE: 'styleguide',
	CSS: 'css'
};

var DIRECTORIES = {
	CATBERRY_MODULES: path.join(process.cwd(),
		DIRECTORY_NAMES.CATBERRY_MODULES),
	DESTINATION: path.join(process.cwd(), DIRECTORY_NAMES.PUBLIC),
	COMPILED_LESS: path.join(process.cwd(), DIRECTORY_NAMES.CATBERRY_MODULES,
		MAIN_MODULE, DIRECTORY_NAMES.ASSETS, DIRECTORY_NAMES.CSS,
		DIRECTORY_NAMES.COMPILED),
	STYLE_GUIDE_DESTINATION: path.join(process.cwd(), DIRECTORY_NAMES.PUBLIC,
		DIRECTORY_NAMES.STYLEGUIDE),
	STYLE_GUIDE_SOURCE: path.join(process.cwd(), DIRECTORY_NAMES.STYLEGUIDE)
};

var IN_MODULE_GLOBS = {
	LESS: path.join(DIRECTORY_NAMES.LESS, '**', '*.less'),
	STYLES: path.join('**', '*.css'),
	SCRIPTS: path.join('**', '*.js'),
	IMAGES_PNG: path.join('**', '*.png'),
	SVG: path.join('**', '*.svg'),
	IMAGES_JPG: path.join('**', '*.jpg'),
	IMAGES_GIF: path.join('**', '*.gif'),
	OTHER_ASSETS: path.join('**', '!(*.css|*.js|*.png|*.jpg|*.gif)'),
	ALL: '*'
};

var TASKS = {
	CLEAN_PUBLIC: 'clean-public',
	CLEAN_LESS: 'clean-less',
	CLEAN_TEMPORARY: 'clean-tmp',
	CLEAN_STYLEGUIDE: 'clean-styleguide',
	REMOVE_TEMPORARY: 'remove-tmp',
	BUILD: 'build',
	RELEASE: 'release',
	CLEAN: 'clean',
	COMPILE_LESS: 'less',
	SVG_TO_PNG: 'svg2png',
	PROCESS_STYLES: 'process-styles',
	PUBLISH_JOINED_STYLES: 'publish-styles',
	PUBLISH_IMAGES: 'publish-images',
	PUBLISH_SCRIPTS: 'publish-scripts',
	PUBLISH_OTHER_ASSETS: 'publish-other-assets',
	STYLEGUIDE: 'styleguide',
	REGISTER_WATCH: 'watch'
};

// always make required folder for compiled styles
(function () {
	var currentPath = path.sep;
	DIRECTORIES.COMPILED_LESS
		.split(path.sep)
		.forEach(function (part) {
			currentPath = path.join(currentPath, part);
			if (!fs.existsSync(currentPath)) {
				fs.mkdirSync(currentPath);
			}
		});
})();

gulp.task(TASKS.CLEAN, [
	TASKS.CLEAN_PUBLIC,
	TASKS.CLEAN_TEMPORARY,
	TASKS.CLEAN_LESS,
	TASKS.CLEAN_STYLEGUIDE
]);

gulp.task(TASKS.REGISTER_WATCH, [TASKS.BUILD],
	function () {
		if (isRelease) {
			return;
		}
		registerWatch();
	});

gulp.task(TASKS.BUILD, [
	TASKS.SVG_TO_PNG,
	TASKS.PUBLISH_JOINED_STYLES,
	TASKS.PUBLISH_SCRIPTS,
	TASKS.PUBLISH_IMAGES,
	TASKS.PUBLISH_OTHER_ASSETS,
	TASKS.REMOVE_TEMPORARY
]);

gulp.task(TASKS.RELEASE, function () {
	isRelease = true;
	gulp.start(TASKS.BUILD);
});

gulp.task(TASKS.STYLEGUIDE, [TASKS.COMPILE_LESS], function () {
	return gulp.src(getLessFileWithAllStyles())
		.pipe(less())
		.pipe(kss({
			overview: path.join(DIRECTORIES.STYLE_GUIDE_SOURCE,
				STYLE_GUIDE_OVERVIEW),
			templateDirectory: path.join(DIRECTORIES.STYLE_GUIDE_SOURCE,
				STYLE_GUIDE_TEMPLATE)
		}))
		.pipe(gulp.dest(DIRECTORIES.STYLE_GUIDE_DESTINATION));
});

// clean public folder
gulp.task(TASKS.CLEAN_PUBLIC,
	function () {
		return getCleanTaskForPath(DIRECTORIES.DESTINATION);
	});

// clean styleguide
gulp.task(TASKS.CLEAN_STYLEGUIDE,
	function () {
		return getCleanTaskForPath(DIRECTORIES.STYLE_GUIDE_DESTINATION);
	});

// clean all compiled LESS files
gulp.task(TASKS.CLEAN_LESS, function () {
	return getCleanTaskForPath(DIRECTORIES.COMPILED_LESS);
});

// remove temporary directory after style processing is over
gulp.task(TASKS.CLEAN_TEMPORARY, function () {
	return getCleanTaskForPath(path.join(process.cwd(),
		DIRECTORY_NAMES.TEMPORARY));
});

// remove temporary directory after style processing is over
gulp.task(TASKS.REMOVE_TEMPORARY,
	[TASKS.PUBLISH_JOINED_STYLES], function () {
		return getCleanTaskForPath(path.join(process.cwd(),
			DIRECTORY_NAMES.TEMPORARY));
	});

gulp.task(TASKS.COMPILE_LESS, function () {
	return gulp.src(getLessFileWithAllStyles())
		.pipe(less())
		.pipe(gulp.dest(DIRECTORIES.COMPILED_LESS));
});

gulp.task(TASKS.SVG_TO_PNG, [TASKS.PUBLISH_OTHER_ASSETS], function () {
	return gulp.src(path.join(DIRECTORIES.DESTINATION, IN_MODULE_GLOBS.SVG))
		.pipe(svgmin())
		.pipe(gulp.dest(DIRECTORIES.DESTINATION))
		.pipe(raster())
		.pipe(rename({extname: '.png'}))
		.pipe(imagemin())
		.pipe(gulp.dest(DIRECTORIES.DESTINATION));
});

// process styles when temporary directory is clean
gulp.task(TASKS.PROCESS_STYLES, [TASKS.COMPILE_LESS], function () {
	var tmpPath = path.join(
		process.cwd(),
		DIRECTORY_NAMES.TEMPORARY);

	var stylesPath = path.join(
		DIRECTORIES.CATBERRY_MODULES,
		IN_MODULE_GLOBS.ALL,
		DIRECTORY_NAMES.ASSETS,
		IN_MODULE_GLOBS.STYLES
	);
	return gulp.src(stylesPath)
		.pipe(concat(STYLE_FILENAME))
		.pipe(gulp.dest(tmpPath));
});

// join all style into one file when public directory is clean
gulp.task(TASKS.PUBLISH_JOINED_STYLES, [TASKS.PROCESS_STYLES],
	function () {
		var stylesPath = path.join(process.cwd(),
			DIRECTORY_NAMES.TEMPORARY, IN_MODULE_GLOBS.STYLES);

		var stream = gulp.src(stylesPath)
			.pipe(concat(STYLE_FILENAME));

		if (isRelease) {
			stream = stream.pipe(minifyCSS());
		}

		return stream.pipe(gulp.dest(DIRECTORIES.DESTINATION));
	});

// public all images when public directory is clean
gulp.task(TASKS.PUBLISH_IMAGES, [TASKS.SVG_TO_PNG], function () {
	var tasks = [],
		sourcePathAssets = path.join(
			DIRECTORIES.CATBERRY_MODULES,
			IN_MODULE_GLOBS.ALL,
			DIRECTORY_NAMES.ASSETS),
		sourcePathPng = path.join(sourcePathAssets, IN_MODULE_GLOBS.IMAGES_PNG),
		sourcePathJpg = path.join(sourcePathAssets, IN_MODULE_GLOBS.IMAGES_JPG),
		sourcePathGif = path.join(sourcePathAssets, IN_MODULE_GLOBS.IMAGES_GIF);

	var pngTask = gulp.src(sourcePathPng);
	if (isRelease) {
		pngTask = pngTask.pipe(imagemin());
	}
	tasks.push(pngTask.pipe(gulp.dest(DIRECTORIES.DESTINATION)));

	var jpgTask = gulp.src(sourcePathJpg);
	if (isRelease) {
		jpgTask = jpgTask.pipe(imagemin());
	}
	tasks.push(jpgTask.pipe(gulp.dest(DIRECTORIES.DESTINATION)));

	var gifTask = gulp.src(sourcePathGif);
	if (isRelease) {
		gifTask = gifTask.pipe(imagemin());
	}
	tasks.push(gifTask.pipe(gulp.dest(DIRECTORIES.DESTINATION)));

	return es.concat.apply(null, tasks);
});

gulp.task(TASKS.PUBLISH_SCRIPTS, function () {
	var sourcePath = path.join(
		DIRECTORIES.CATBERRY_MODULES,
		IN_MODULE_GLOBS.ALL,
		DIRECTORY_NAMES.ASSETS,
		IN_MODULE_GLOBS.SCRIPTS
	);

	var stream = gulp.src(sourcePath);

	if (isRelease) {
		stream = stream.pipe(uglify());
	}

	return stream.pipe(gulp.dest(DIRECTORIES.DESTINATION));
});

gulp.task(TASKS.PUBLISH_OTHER_ASSETS, function () {
	var sourcePath = path.join(
		DIRECTORIES.CATBERRY_MODULES,
		IN_MODULE_GLOBS.ALL,
		DIRECTORY_NAMES.ASSETS,
		IN_MODULE_GLOBS.OTHER_ASSETS
	);

	return gulp.src(sourcePath)
		.pipe(gulp.dest(DIRECTORIES.DESTINATION));
});

function registerWatch() {
	var modulesPath = path.join(
		process.cwd(),
		DIRECTORY_NAMES.CATBERRY_MODULES,
		IN_MODULE_GLOBS.ALL
	);

	var assetsPath = path.join(
		modulesPath,
		DIRECTORY_NAMES.ASSETS
	);

	var lessPath = path.join(modulesPath,
		IN_MODULE_GLOBS.LESS
	);
	gulp.watch([lessPath], [
		TASKS.PUBLISH_JOINED_STYLES,
		TASKS.REMOVE_TEMPORARY
	]);

	var imagesPathPng = path.join(
		assetsPath,
		IN_MODULE_GLOBS.IMAGES_PNG
	);
	var imagesPathJpg = path.join(
		assetsPath,
		IN_MODULE_GLOBS.IMAGES_JPG
	);
	var imagesPathGif = path.join(
		assetsPath,
		IN_MODULE_GLOBS.IMAGES_GIF
	);
	gulp.watch([
			imagesPathPng,
			imagesPathJpg,
			imagesPathGif
		],
		[TASKS.PUBLISH_IMAGES]
	);

	var scriptsPath = path.join(
		assetsPath,
		IN_MODULE_GLOBS.SCRIPTS
	);
	gulp.watch(scriptsPath, [TASKS.PUBLISH_SCRIPTS]);

	var otherAssetsPath = path.join(
		assetsPath,
		IN_MODULE_GLOBS.OTHER_ASSETS
	);
	gulp.watch(otherAssetsPath, [TASKS.PUBLISH_OTHER_ASSETS]);
}

/**
 * Gets gulp clean task for specified path.
 * @param {string} folderPath Folder path.
 * @returns {Stream} Gulp task stream.
 * @private
 */
function getCleanTaskForPath(folderPath) {
	return gulp.src(folderPath)
		.pipe(clean());
}

/**
 * Gets folder names of catberry modules.
 * @param {string} directory
 * @return {Array.<string>}
 */
function getFolders(directory) {
	return fs.readdirSync(directory)
		.filter(function (file) {
			return fs.statSync(path.join(directory, file)).isDirectory();
		});
}

/**
 * Reorders folders. Moves "main" module to the first position.
 * @param {Array.<string>} folders
 * @return {Array.<string>}
 */
function reorderFolders(folders) {
	var mainIndex = folders.indexOf(MAIN_MODULE);
	if (mainIndex == -1) {
		return folders;
	}
	folders.splice(mainIndex, 1);
	folders.unshift(MAIN_MODULE);
	return folders;
}

/**
 * Creates single file with imports of all less styles from modules.
 * @param {Array.<string>} folders
 * @return {string} filename
 */
function createImportFile(folders) {
	var content = [];
	folders.forEach(function (folder) {
		var lessFile = path.join(DIRECTORY_NAMES.CATBERRY_MODULES, folder,
			DIRECTORY_NAMES.LESS, STYLE_LESS_FILE);
		// don't import style if file does not exist
		if (fs.existsSync(lessFile)) {
			content.push(util.format(LESS_IMPORT_FORMAT, lessFile));
		}
	});

	var filename = path.join(DIRECTORIES.COMPILED_LESS, STYLE_LESS_FILE);
	fs.writeFileSync(filename, content.join('\n'));
	return filename;
}

/**
 * Gets name of less file including imports of all styles.
 * @return {string} filename
 */
function getLessFileWithAllStyles() {
	var folders = reorderFolders(getFolders(DIRECTORIES.CATBERRY_MODULES));
	return createImportFile(folders);
}
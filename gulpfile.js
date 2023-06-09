const gulp = require('gulp');
const gulpIf = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const htmlPartial = require('gulp-html-partial');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const clean = require('gulp-clean');

const mergeStream = require('merge-stream');

const cssmin = require('gulp-cssmin');
const cssbeautify = require('gulp-cssbeautify');
const sourcemaps = require('gulp-sourcemaps');
const jsImport = require('gulp-js-import');

const isProd = process.env.NODE_ENV === 'prod';



const paths = {
    src: './src',
    dist: './dist',
    html: {
        top: { src: './src/*.{html,htm,php}', dist: './dist/' },
        about: { src: './src/about/*.{html,htm,php}', dist: './dist/about/' },
        contact: { src: './src/contact/*.{html,htm,php}', dist: './dist/contact/' }
    },
    css: { src: './src/assets/css/*.scss', dist: './dist/assets/css/', utils: "./src/assets/css/**/*.scss" },
    js: { src: './src/assets/js/*.js', dist: './dist/assets/js/' },
    images: { src: './src/assets/images/*.*', dist: './dist/assets/images/' },
};
const htmlFile = ['./src/*.html', './src/**/*.html'];


function serve() {
    browserSync.init({
        server: {
            baseDir: paths.dist
        }
    });

    // Watch tasks
    Object.entries(paths.html).forEach(([key, path]) => {

        gulp.watch(path.src).on('change', gulp.series(rebuildHtml(key), browserSync.reload));

    });
    gulp.watch(htmlFile).on('change', gulp.series(buildHTML, browserSync.reload));
    gulp.watch([paths.css.src, paths.css.utils]).on('change', gulp.series(buildCSS, browserSync.reload));
    gulp.watch(paths.js.src).on('change', gulp.series(buildJS, browserSync.reload));
    gulp.watch(paths.images.src).on('change', gulp.series(compressImages, browserSync.reload));

}
function rebuildHtml(page) {
    return function () {
        return gulp.src(paths.html[page].src)
            .pipe(htmlPartial({
                basePath: "./src/components/",
            }))
            .pipe(gulpIf(isProd, htmlmin({
                collapseWhitespace: true
            })))
            .pipe(gulp.dest(paths.html[page].dist));
    }
}

function buildHTML() {
    const streams = Object.values(paths.html)
        .map(path => {
            return gulp.src(path.src)
                .pipe(htmlPartial({
                    basePath: "./src/components/",
                }))
                .pipe(gulpIf(isProd, htmlmin({
                    collapseWhitespace: true
                })))
                .pipe(gulp.dest(path.dist));
        });

    return mergeStream(streams);
}



// style
function buildCSS() {
    return gulp.src(paths.css.src)
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(cssbeautify({
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        }))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulp.dest(paths.css.dist));
}
// script
function buildJS() {
    return gulp.src(paths.js.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(browserify())
        .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest(paths.js.dist));
}


// image
function cleanImages() {

    if (paths.images.dist + "*.*") {
        return gulp.src(paths.images.dist, { read: false })
            .pipe(clean());
    }
}
function minifyImages() {
    return gulp.src(paths.images.src)
        .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest(paths.images.dist));
}
function createWebp() {
    return gulp.src(paths.images.src)
        .pipe(gulpIf(isProd, imagemin({
            progressive: true
        })))
        .pipe(webp())
        .pipe(gulp.dest(paths.images.dist));
}
const compressImages = gulp.series(minifyImages, createWebp);

const buildImages = gulp.series(cleanImages, minifyImages, createWebp);
exports.buildImages = buildImages;

// clean all
function cleanDist() {
    if (paths.dist) {
        return gulp.src(paths.dist, { read: false })
            .pipe(clean());
    }
}

const build = gulp.series(buildHTML, gulp.parallel(buildCSS, buildJS, compressImages));
exports.build = build;

exports.default = gulp.series(cleanDist, build, serve);

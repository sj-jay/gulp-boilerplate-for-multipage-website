# gulp-boilerplate-for-multipage-website


description:~

This code is a Gulp-based build system that compiles HTML, CSS, and JavaScript files, optimizes images, and serves the website locally.

The code requires several Gulp plugins, including gulp-if, gulp-htmlmin, gulp-html-partial, gulp-sass, gulp-autoprefixer, gulp-babel, gulp-concat, gulp-browserify, gulp-uglify, gulp-imagemin, gulp-webp, gulp-clean, merge-stream, gulp-cssmin, gulp-cssbeautify, gulp-sourcemaps, and gulp-js-import.

The code defines several paths for source and distribution directories for HTML, CSS, JavaScript, and images. It also defines several Gulp tasks, including serve, rebuildHtml, buildHTML, buildCSS, buildJS, cleanImages, minifyImages, createWebp, compressImages, buildImages, and cleanDist.

The serve task starts a local development server and watches for changes in HTML, CSS, JavaScript, and images. The rebuildHtml task compiles and minifies HTML files and outputs them to the corresponding distribution directory. The buildHTML task does the same for all HTML files. The buildCSS task compiles, beautifies, and minifies CSS files. The buildJS task transpiles, concatenates, and minifies JavaScript files. The cleanImages task removes all files in the image distribution directory. The minifyImages task optimizes images. The createWebp task creates WebP versions of images. The compressImages task runs both minifyImages and createWebp. The buildImages task runs cleanImages, minifyImages, and createWebp sequentially. The cleanDist task removes all files in the distribution directory. The build task runs buildHTML, buildCSS, buildJS, and compressImages in parallel. The default task runs cleanDist, build, and serve sequentially.


how to use:~

clone : "git clone https://github.com/sj-jay/gulp-boilerplate-for-multipage-website.git"

install dependencies : "npm install"

start dev server : "npm run start"

bulid for production : "npm run build"

*add new pages in to src folder and 
in gulpfile.js add new pages src and dist to "paths" object  

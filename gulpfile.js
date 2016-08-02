/// <reference path="typings/index.d.ts" />
'use strict'
const child_process = require('child_process');
const spawn = child_process.spawn;
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const gulpts = require('gulp-typescript');
const prettydiff = require('gulp-prettydiff');
const path = require('path');

const serverProject = gulpts.createProject('tsconfig.json', {
    typescript: require('typescript'),
    module: "commonjs"
});

const tsProject = gulpts.createProject('tsconfig.json', {
    typescript: require('typescript'),
    module: "es2015"
});

gulp.task('serverCompile', () => {
    gulp.src('src/server/**/*.ts')
        .pipe(gulpts(serverProject))
        .js
        .pipe(prettydiff({
            lang: 'js',
            mode: 'minify'
        }))
        .pipe(gulp.dest('build/server'));
});

gulp.task('tsCompile', () => {
    gulp.src('src/client/**/*.ts')
        .pipe(gulpts(tsProject))
        .js
        .pipe(prettydiff({
            lang: 'js',
            mode: 'minify'
        }))
        .pipe(gulp.dest('build/client'));
});

gulp.task('nodemon', (cb) => {
    nodemon({
        script: 'build/server/',
        watch: 'build/',
        ignore: ['build/client/**/*']
    }).on('start', cb);
});

gulp.task('watch', ['tsCompile', 'serverCompile','start'], () => {
    gulp.watch('src/server/**/*.ts', ['serverCompile']);
    gulp.watch('src/client/**/*.ts', ['tsCompile']);
});

gulp.task('start', () => {
    gulp.start('nodemon');
});

gulp.task('default', () => {
    let process;
    function restart() {
        if (process) process.kill();
        process = spawn('gulp', ['watch'], { stdio: 'inherit' });
    }
    gulp.watch('gulpfile.js', restart);
    restart();
});

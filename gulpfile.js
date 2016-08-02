/// <reference path="typings/index.d.ts" />

const gulp = require('gulp');
const gulpts = require('gulp-typescript');
const prettydiff = require('gulp-prettydiff');

const serverProject = gulpts.createProject('tsconfig.json', {
    typescript: require('typescript'),
    module : "commonjs"
});

const tsProject = gulpts.createProject('tsconfig.json', {
    typescript: require('typescript'),
    module : "es2015"
});

gulp.task('serverCompile', () => {
    gulp.src('src/**/*.ts')
        .pipe(gulpts(serverProject))
        .js
        .pipe(prettydiff({
            lang: 'js',
            mode: 'minify'
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('serverCompile', () => {
    gulp.src('src/**/*.ts')
        .pipe(gulpts(tsProject))
        .js
        .pipe(prettydiff({
            lang: 'js',
            mode: 'minify'
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('nodemon', (cb) => {
    let called = false;

    return nodemon({
        script: 'src/server/js/',
        watch: 'src/server/',
        ext: 'ts',
        tasks: (changedFiles) => {
            let tasks = [];
            changedFiles.forEach(file => {
                if (path.extname(file) === '.ts' && !~tasks.indexOf("serverCompile"))
                    tasks.push("serverCompile");
            });
            return tasks;
        }
    });
});

gulp.task('default', ['tsCompile'], () => {
    gulp.watch('src/**/*.ts', ['tsCompile']);
});
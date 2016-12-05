import del from 'del'
import gulp from 'gulp'
import eslint from 'gulp-eslint'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import notifier from 'node-notifier'
import runSequence from 'run-sequence'
import named from 'vinyl-named'
import webpack from 'webpack-stream'


const BROWSER_LIST = ['last 2 versions', 'iOS >= 8', 'Android >= 4.4']


gulp.task('lint', () => {
  return gulp.src(['src/js/**/*.es6']) // lint のチェック先を指定
    .pipe(plumber({
      // エラーをハンドル
      errorHandler: function(error) {
        // var taskName = 'eslint';
        // var title = '[task]' + taskName + ' ' + error.plugin;
        // var errorMsg = 'error: ' + error.message;
        // // ターミナルにエラーを出力
        // console.error(title + '\n' + errorMsg);
        // // エラーを通知
        // notifier.notify({
        //   title: title,
        //   message: errorMsg,
        //   time: 3000
        // });
      },
    }))
    .pipe(eslint({eslintrc: true})) // .eslintrc を参照
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(plumber.stop())
})


gulp.task('cleanScripts', del.bind(null, ['./static/ssd-labeling/js/*.chunked.js']))


gulp.task('scripts', () => {
  return gulp.src(['src/js/main.es6'])
    .pipe(named())
    .pipe(webpack(require('./webpack.config.js'), null, (err, stats) => {
      if(!err) {
        let elapsedTime = (stats.endTime - stats.startTime) / 1000.
        notifier.notify({
          title: 'gulp scripts',
          message: `Webpack build. ${elapsedTime}secs`,
        })
      } else {
        notifier.notify({
          title: 'gulp scripts',
          message: 'Error on `scripts`: <%= err %>',
        })
      }
    }))
    .pipe(gulp.dest('static/ssd-labeling/js/'))
})


gulp.task('styles', () => {
  return gulp.src(['src/css/main.css'])
    .pipe(postcss([
      require('postcss-import'),
      require('postcss-mixins'),
      require('postcss-extend'),
      require('postcss-nested'),
      require('postcss-simple-vars'),
      require('postcss-color-function'),
      require('postcss-calc'),
      require('postcss-cssnext')({browsers: BROWSER_LIST}),
    ]))
    .pipe(gulp.dest('static/ssd-labeling/css/'))
})


gulp.task('watch', () => {
  gulp.watch(['src/js/**/*.es6'], () => {
    return runSequence('cleanScripts', ['lint', 'scripts'])
  })
  gulp.watch(['src/css/**/*.css'], ['styles'])
})


gulp.task('default', ['lint', 'scripts', 'styles'])
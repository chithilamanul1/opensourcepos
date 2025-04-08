import gulp from 'gulp'
import clean from 'gulp-clean'
import rev from 'gulp-rev'
import concat from 'gulp-concat'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'
import inject from 'gulp-inject'
import tar from 'gulp-tar'
import zip from 'gulp-zip'

import { pipeline } from 'node:stream/promises'

// Clean Task
gulp.task('clean', () => {
  return pipeline(
    gulp.src('./public/resources', { read: false, allowEmpty: true }),
    clean()
  )
})

// Compress Task
gulp.task('compress', () => {
  const sources = [
    'app*/**/*', 'public*/**/*', 'vendor*/**/*', '*.md', 'LICENSE',
    'docker*', 'Dockerfile', '**/.htaccess', 'writable*/**/*', '.env'
  ]
  const tarStream = gulp.src(sources, { allowEmpty: true }).pipe(tar('opensourcepos.tar')).pipe(gulp.dest('dist'))
  const zipStream = gulp.src(sources, { allowEmpty: true }).pipe(zip('opensourcepos.zip')).pipe(gulp.dest('dist'))
  return pipeline(tarStream, zipStream)
})

// Copy Bootswatch 3 themes
gulp.task('copy-bootswatch', async () => {
  const themes = [
    'cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'journal',
    'lumen', 'paper', 'readable', 'sandstone', 'simplex', 'slate',
    'spacelab', 'superhero', 'united', 'yeti'
  ]
  for (const theme of themes) {
    await pipeline(
      gulp.src(`./node_modules/bootswatch/${theme}/*.min.css`),
      gulp.dest(`public/resources/bootswatch/${theme}`)
    )
  }
  return pipeline(
    gulp.src('./node_modules/bootswatch/fonts/*.*', { encoding: false }),
    gulp.dest('public/resources/bootswatch/fonts')
  )
})

// Copy Bootswatch 5 themes
gulp.task('copy-bootswatch5', async () => {
  const themes = [
    'cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'journal',
    'lumen', 'sandstone', 'simplex', 'slate', 'spacelab',
    'superhero', 'united', 'yeti'
  ]
  for (const theme of themes) {
    await pipeline(
      gulp.src(`./node_modules/bootswatch5/dist/${theme}/*.min.css`),
      gulp.dest(`public/resources/bootswatch5/${theme}`)
    )
  }
})

// Debug JS injection task
gulp.task('debug-js', () => {
  const debugJS = gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/jquery-form/src/jquery.form.js',
    './node_modules/jquery-validation/dist/jquery.validate.js',
    './node_modules/jquery-ui-dist/jquery-ui.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './node_modules/bootstrap3-dialog/dist/js/bootstrap-dialog.js',
    './node_modules/jasny-bootstrap/dist/js/jasny-bootstrap.js',
    './node_modules/bootstrap-datetime-picker/js/bootstrap-datetimepicker.js',
    './node_modules/bootstrap-select/dist/js/bootstrap-select.js',
    './node_modules/bootstrap-table/dist/bootstrap-table.js',
    './node_modules/bootstrap-table/dist/extensions/export/bootstrap-table-export.js',
    './node_modules/bootstrap-table/dist/extensions/mobile/bootstrap-table-mobile.js',
    './node_modules/bootstrap-table/dist/extensions/sticky-header/bootstrap-table-sticky-header.js',
    './node_modules/moment/min/moment.min.js',
    './node_modules/bootstrap-daterangepicker/daterangepicker.js',
    './node_modules/es6-promise/dist/es6-promise.js',
    './node_modules/file-saver/dist/FileSaver.js',
    './node_modules/html2canvas/dist/html2canvas.js',
    './node_modules/jspdf/dist/jspdf.umd.js',
    './node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js',
    './node_modules/tableexport.jquery.plugin/tableExport.min.js',
    './node_modules/chartist/dist/chartist.js',
    './node_modules/chartist-plugin-pointlabels/dist/chartist-plugin-pointlabels.js',
    './node_modules/chartist-plugin-tooltips/dist/chartist-plugin-tooltip.js',
    './node_modules/chartist-plugin-axistitle/dist/chartist-plugin-axistitle.js',
    './node_modules/chartist-plugin-barlabels/dist/chartist-plugin-barlabels.js',
    './node_modules/bootstrap-notify/bootstrap-notify.js',
    './node_modules/js-cookie/src/js.cookie.js',
    './node_modules/bootstrap-tagsinput-2021/dist/bootstrap-tagsinput.js',
    './node_modules/bootstrap-toggle/js/bootstrap-toggle.js',
    './node_modules/clipboard/dist/clipboard.js',
    './public/js/imgpreview.full.jquery.js',
    './public/js/manage_tables.js',
    './public/js/nominatim.autocomplete.js'
  ])
    .pipe(rev())
    .pipe(gulp.dest('public/resources/js'))

  return gulp.src('./app/Views/partial/header.php')
    .pipe(inject(debugJS, {
      addRootSlash: false,
      ignorePath: '/public/',
      starttag: '<!-- inject:debug:js -->'
    }))
    .pipe(gulp.dest('./app/Views/partial'))
})

// Production JS bundle + injection
gulp.task('prod-js', async () => {
  const prod0js = gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(rev())
    .pipe(gulp.dest('public/resources'))

  const opensourcepos1 = gulp.src([
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/bootstrap-table/dist/bootstrap-table.min.js',
    './node_modules/moment/min/moment.min.js',
    './node_modules/jquery-ui-dist/jquery-ui.min.js',
    './node_modules/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js',
    './node_modules/jasny-bootstrap/dist/js/jasny-bootstrap.min.js',
    './node_modules/bootstrap-select/dist/js/bootstrap-select.min.js',
    './node_modules/bootstrap-table/dist/extensions/sticky-header/bootstrap-table-sticky-header.min.js',
    './node_modules/bootstrap-tagsinput-2021/dist/bootstrap-tagsinput.min.js',
    './node_modules/bootstrap-toggle/js/bootstrap-toggle.min.js',
    './node_modules/bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js',
    './node_modules/bootstrap-table/dist/extensions/mobile/bootstrap-table-mobile.min.js',
    './node_modules/bootstrap-notify/bootstrap-notify.min.js',
    './node_modules/clipboard/dist/clipboard.min.js',
    './node_modules/jquery-form/dist/jquery.form.min.js',
    './node_modules/jquery-validation/dist/jquery.validate.min.js',
    './node_modules/bootstrap-datetime-picker/js/bootstrap-datetimepicker.min.js',
    './node_modules/es6-promise/dist/es6-promise.min.js',
    './node_modules/file-saver/dist/FileSaver.min.js',
    './node_modules/html2canvas/dist/html2canvas.min.js',
    './node_modules/chartist/dist/chartist.min.js',
    './node_modules/jspdf/dist/jspdf.umd.min.js',
    './node_modules/chartist-plugin-pointlabels/dist/chartist-plugin-pointlabels.min.js',
    './node_modules/chartist-plugin-axistitle/dist/chartist-plugin-axistitle.min.js',
    './node_modules/chartist-plugin-tooltips/dist/chartist-plugin-tooltip.min.js',
    './node_modules/chartist-plugin-barlabels/dist/chartist-plugin-barlabels.min.js',
    './node_modules/tableexport.jquery.plugin/tableExport.min.js'
  ])

  const opensourcepos2 = gulp.src([
    './node_modules/bootstrap-daterangepicker/daterangepicker.js',
    './node_modules/js-cookie/src/js.cookie.js',
    './public/js/imgpreview.full.jquery.js',
    './public/js/manage_tables.js',
    './public/js/nominatim.autocomplete.js'
  ])
    .pipe(uglify())

  const combined = gulp.series(() => opensourcepos1, () => opensourcepos2)

  const prod1js = combined()
    .pipe(concat('opensourcepos.min.js'))
    .pipe(rev())
    .pipe(gulp.dest('./public/resources/'))

  return gulp.src('./app/Views/partial/header.php')
    .pipe(inject(
      gulp.series(() => prod0js, () => prod1js)(),
      {
        addRootSlash: false,
        ignorePath: '/public/',
        starttag: '<!-- inject:prod:js -->'
      }
    ))
    .pipe(gulp.dest('./app/Views/partial'))
})

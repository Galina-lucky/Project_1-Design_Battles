// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

function html() {
  return src('src/**/*.html') 
  .pipe(dest('dist/'))
  .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
  return src('src/scss/main.scss')
  .pipe(sass().on('error', sass.logError)) 
  .pipe(concat('main.min.css')) // Конкатенируем в файл app.min.js
  .pipe(autoprefixer({ overrideBrowserslist: ['last 3 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
  .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
  .pipe(dest('dist/css/')) // Выгрузим результат в папку "src/css/"
  .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function scripts() {
  return src([ // Берём файлы из источников
    'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
    'src/js/**/*.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
    ])
  .pipe(concat('main.min.js')) // Конкатенируем в один файл
  .pipe(uglify()) // Сжимаем JavaScript
  .pipe(dest('dist/js/')) // Выгружаем готовый файл в папку назначения
  .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function images() {
  return src('src/img/**/*') // Берём все изображения из папки источника
  .pipe(newer('dist/img/')) // Проверяем, было ли изменено (сжато) изображение ранее
  .pipe(imagemin()) // Сжимаем и оптимизируем изображеня
  .pipe(dest('dist/img/')) // Выгружаем оптимизированные изображения в папку назначения
}

function cleanimg() {
  return del('dist/img/**/*', { force: true }) // Удаляем всё содержимое папки "src/images/dest/"
}

function cleandist() {
  return del('dist/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
}

function startwatch() { 
  // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(['src/js/**/*.js', '!src/**/*.min.js'], scripts);
  
  // Мониторим файлы препроцессора на изменения
  watch('src/scss/**/*.scss', styles);

  // Мониторим папку-источник изображений и выполняем images(), если есть изменения
  watch('src/img/**/*', images);

  // Мониторим файлы HTML на изменения
  watch('src/**/*.html', html);
}

// Определяем логику работы Browsersync
function browsersync() {
  browserSync.init({ // Инициализация Browsersync
    server: { baseDir: 'dist/' }, // Указываем папку сервера
    notify: false, // Отключаем уведомления
    online: true // Режим работы: true или false
  })
}

exports.html = html;
  // Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;
  // Экспортируем функцию styles() в таск styles
exports.styles = styles;
// Экспорт функции images() в таск images
exports.images = images;
// Экспортируем функцию cleanimg() как таск cleanimg
exports.cleanimg = cleanimg;
// Экспортируем функцию cleandist() как таск cleandist
exports.cleandist = cleandist;
 // Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = series(cleandist, html, styles, scripts, images, parallel(startwatch, browsersync));
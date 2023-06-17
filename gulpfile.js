/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const fs = require('fs-extra');
const gulp = require('gulp');
const { watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
// const fileinclude = require('gulp-file-include');
const replace = require('gulp-replace');

const structure = require('./structure.json');
const settings = require('./settings.json');

exports.default = defaultTask;

exports.start = start;
exports.build = build;

exports.slides = addSlides;
exports.delete_slides = deleteSlides;
exports.shared = addShared;
exports.structure = addStructure;
exports.settings = addSettings;
// exports.includes = addIncludes;

exports.buildStyles = buildStyles;
exports.buildHtml = buildHtml;
exports.buildJs = buildJs;
exports.buildImg = buildImg;
exports.buildFonts = buildFonts;

function defaultTask(cb) {
  watch('./src/slides/**/*.html', buildHtml);
  watch('./src/**/*.scss', buildStyles);
  watch('./src/**/*.js', buildJs);
  watch('./src/**/*.{gif,jpg,png,svg}', buildImg);
  watch('./src/shared/media/fonts/*.{woff,woff2,ttf,otf}', buildFonts);
  cb();
}

function start(cb) {
  addSlides(cb);
  addShared(cb);
  // addIncludes(cb);

  cb();
}

function build(cb) {
  fs.rmSync('./build', { recursive: true, force: true });

  buildHtml();
  buildStyles();
  buildJs();
  buildImg();
  buildFonts();

  cb();
}

function addSlides(cb) {
  console.log('add slides');
  const slides = getSlides(structure);

  slides.forEach((slide) => {
    if (!slide) return;

    const templateDir = './template/slide';
    const slideDir = `./src/slides/${slide}`;

    try {
      fs.copySync(templateDir, slideDir, {
        overwrite: false,
        errorOnExist: true,
      });
      console.log('\x1b[32m', `${slide} created`);
      console.log('\x1b[0m');
    } catch (err) {
      // console.error(err);
      console.log('\x1b[31m', `${slide} already exists`);
      console.log('\x1b[0m');
    }
  });

  cb();
}

function deleteSlides(cb) {
  console.log('delete slides');

  const src = './src/slides';
  const structureSlides = getSlides(structure);
  const srcSlides = getFoldersFrom(src);
  const slidesToDelete = [];

  srcSlides.forEach((slide) => {
    if (!structureSlides.includes(slide)) slidesToDelete.push(slide);
  });

  slidesToDelete.forEach((slide) => {
    if (!slide) return;

    fs.rmSync(`./src/slides/${slide}`, { recursive: true, force: true });
    console.log('\x1b[31m', `${slide} deleted`);
    console.log('\x1b[0m');
  });

  cb();
}

function addShared(cb) {
  console.log('add shared');

  const templateDir = './template/shared';
  const sharedDir = './src/shared';

  try {
    fs.copySync(templateDir, sharedDir, {
      overwrite: false,
      errorOnExist: true,
    });
    console.log('\x1b[32m', 'shared created');
    console.log('\x1b[0m');
  } catch (err) {
    // console.error(err);
    console.log('\x1b[31m', 'shared already exists');
    console.log('\x1b[0m');
  }

  addStructure(cb);
  addSettings(cb);

  cb();
}

function addStructure(cb) {
  console.log('update structure');

  const file = './structure.json';
  const sharedDir = './src/shared/js/structure.json';

  try {
    fs.copyFileSync(file, sharedDir);
    console.log('\x1b[32m', 'structure updated');
    console.log('\x1b[0m');
  } catch (err) {
    console.error(err);
  }

  cb();
}

function addSettings(cb) {
  console.log('update settings');

  const file = './settings.json';
  const sharedDir = './src/shared/js/settings.json';

  try {
    fs.copyFileSync(file, sharedDir);
    console.log('\x1b[32m', 'settings updated');
    console.log('\x1b[0m');
  } catch (err) {
    console.error(err);
  }

  cb();
}

// function addIncludes(cb) {
//   const templateDir = './template/_includes';
//   const includesDir = './src/_includes';

//   try {
//     fs.copySync(templateDir, includesDir, {
//       overwrite: false,
//       errorOnExist: true,
//     });
//     console.log('\x1b[32m', '_includes created');
//     console.log('\x1b[0m');
//   } catch (err) {
//     // console.error(err);
//     console.log('\x1b[31m', '_includes already exists');
//     console.log('\x1b[0m');
//   }

//   cb();
// }

function getSlides(str) {
  const slides = [];

  str.content.forEach((chapter) => {
    str.chapters[chapter].includes.forEach((slide) => {
      slides.push(slide);
    });
  });

  return slides;
}

function getFoldersFrom(path) {
  const folders = [];
  fs.readdirSync(path, { withFileTypes: true }).forEach((direct) => {
    if (direct.isDirectory()) folders.push(direct.name);
  });

  return folders;
}

function buildStyles() {
  const src = './src/**/*.scss';
  const dest = './build/';
  return gulp
    .src(src)
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(dest));
}

function buildHtml() {
  const src = './src/slides/**/*.html';
  const dest = './build/slides';
  return gulp
    .src(src)
    .pipe(replace('__shared__', replaceShared()))
    .pipe(gulp.dest(dest));
}

function replaceShared() {
  const { mode } = settings;
  let pathToShared = '';

  if (mode === 'dev') {
    pathToShared = './../../shared';
  } else if (mode === 'veeva') {
    pathToShared = './shared';
  }

  return pathToShared;
}

function buildJs() {
  const src = './src/**/*.{js,json}';
  const dest = './build/';
  return gulp.src(src).pipe(gulp.dest(dest));
}

function buildImg() {
  const src = './src/**/*.{gif,jpg,png,svg}';
  const dest = './build/';
  return gulp.src(src).pipe(gulp.dest(dest));
}

function buildFonts() {
  const src = './src/shared/media/fonts/*.{woff,woff2,ttf,otf}';
  const dest = './build/shared/media/fonts';
  return gulp.src(src).pipe(gulp.dest(dest));
}

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const fs = require('fs-extra');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

const structure = require('./structure.json');

exports.default = defaultTask;
exports.slides = addSlides;
exports.delete_slides = deleteSlides;
exports.shared = addShared;
exports.buildStyles = buildStyles;
exports.buildHtml = buildHtml;

function defaultTask(cb) {
  console.log('gulp test');
  cb();
}

function addSlides(cb) {
  console.log('add slides');
  let slides = getSlides(structure);

  // eslint-disable-next-line
  slides = slides.filter((slide) => {
    if (isSlideCreated(slide)) {
      console.log('\x1b[33m', `${slide} already exists`);
      console.log('\x1b[0m');
    } else {
      return slide;
    }
  });

  slides.forEach((slide) => {
    if (!slide) return;

    const templateDir = './template/slide';
    const slideDir = `./src/slides/${slide}`;

    try {
      fs.copySync(templateDir, slideDir, { overwrite: true });
      console.log('\x1b[32m', `${slide} created`);
      console.log('\x1b[0m');
    } catch (err) {
      console.error(err);
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

  // fs.ensureDirSync(sharedDir);

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

  cb();
}

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

function isSlideCreated(slide) {
  const slidePath = `./src/slides/${slide}`;

  return fs.existsSync(slidePath);
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
  return gulp.src(src).pipe(gulp.dest(dest));
}

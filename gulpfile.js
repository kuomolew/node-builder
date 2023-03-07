/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const fse = require('fs-extra');

const structure = require('./structure.json');

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
      fse.copySync(templateDir, slideDir, { overwrite: true });
      console.log('\x1b[32m', `${slide} created`);
      console.log('\x1b[0m');
    } catch (err) {
      console.error(err);
    }
  });

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

function isSlideCreated(slide) {
  const slidePath = `./src/slides/${slide}`;

  return fse.existsSync(slidePath);
}

exports.default = defaultTask;
exports.slide = addSlides;

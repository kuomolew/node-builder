/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');

const structure = require('./structure.json');

exports.default = defaultTask;
exports.slides = addSlides;
exports.delete_slides = deleteSlides;

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

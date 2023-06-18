import structure from './structure.json' assert { type: 'json' };
import settings from './settings.json' assert { type: 'json' };

window.navi = {
  slides() {
    return getSlides(structure);
  },
  allSlides() {
    return getAllSlides(structure);
  },
  hiddenSlides() {
    return getHiddenSlides(structure);
  },
  currentSlide() {
    return getCurrentSlide();
  },
  next() {
    getNextSlide()
      ? this.goTo(getNextSlide())
      : console.log('There is no next slide');
  },
  prev() {
    getPrevSlide()
      ? this.goTo(getPrevSlide())
      : console.log('There is no previous slide');
  },
  goTo(slide) {
    if (settings.mode === 'veeva') {
      veevaGoTo(slide);
    } else if (settings.mode === 'dev') {
      devGoTo(slide);
    }
  },
};

const body = document.getElementsByTagName('body')[0];

const hammerTime = new Hammer(body);
hammerTime.on('swipeleft swiperight', (event) => {
  if (event.type === 'swipeleft') {
    navi.next();
  } else if (event.type === 'swiperight') {
    navi.prev();
  }
});

function getAllSlides(str) {
  const slides = [];

  str.content.forEach((chapter) => {
    str.chapters[chapter].includes.forEach((slide) => {
      slides.push(slide);
    });
  });

  return slides;
}

function getSlides(str) {
  const slides = [];
  const hiddenSlides = getHiddenSlides(str);

  str.content.forEach((chapter) => {
    str.chapters[chapter].includes.forEach((slide) => {
      if (!hiddenSlides.includes(slide)) slides.push(slide);
    });
  });

  return slides;
}

function getHiddenSlides(str) {
  const slides = [];

  str.hiddenChapters.forEach((chapter) => {
    str.chapters[chapter].includes.forEach((slide) => {
      slides.push(slide);
    });
  });

  return slides;
}

function getNextSlide() {
  let slides = getSlides(structure);
  const currentIndex = slides.indexOf(getCurrentSlide());

  return currentIndex >= slides.length - 1
    ? undefined
    : slides[currentIndex + 1];
}

function getPrevSlide() {
  let slides = getSlides(structure);
  const currentIndex = slides.indexOf(getCurrentSlide());

  return currentIndex <= 0 ? undefined : slides[currentIndex - 1];
}

function getCurrentSlide() {
  let current = '';
  const url = window.location.href.split('/').reverse();
  for (let i of url) {
    if (i && !i.includes('.html')) {
      current = i;
      break;
    }
  }

  return current;
}

function devGoTo(slide) {
  let url = window.location.href.split('/').reverse();
  for (let i in url) {
    if (url[i] && !url[i].includes('.html')) {
      url[i] = slide;
      break;
    }
  }
  url = url.reverse().join('/');
  window.location.href = url;
}

function veevaGoTo(slide) {
  com.veeva.clm.gotoSlide(`${slide}.zip`, '');
}

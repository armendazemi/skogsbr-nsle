import { generateRandomID } from './utils.js';

export default class SwiperSlider extends HTMLElement {
  constructor () {
    super();
    this.swiperContainer = this.querySelector('.swiper-container');
    this.uniqueId = generateRandomID(25);
    this.swiperContainer.classList.add(this.uniqueId);
    this.tumbsSwiper = null;

    // Define default configuration
    this.defaultConfig = {
      autoplay: null,
      loop: null,
      fade: null,
      speed: 300,
      delay: 3000,
      slides: 'auto',
      slidesTablet: null,
      slidesDesktop: null,
      spaceBetween: '12',
      spaceBetweenDesktop: '12',
      freeMode: 'false',
      initialSlide: null,
      direction: 'horizontal',
      directionDesktop: 'horizontal',
      thumbs: null,
    };

    // Extract configuration from attributes
    let config = {};
    for (const [key, value] of Object.entries(this.defaultConfig)) {
      const attributeValue = this.getAttribute(key);
      config[key] = attributeValue !== null ? attributeValue : value;
    }

    // Initialize thumbs slider
    if (config.thumbs) {
      this.tumbsSwiper = this.initThumbsSlider(config.thumbs);
    }

    this.mainSwiperConfig = this.generateSwiperConfig(config);
    this.swiper = new Swiper(this.swiperContainer, this.mainSwiperConfig);
  }

  generateSwiperConfig (config) {
    // Initialize Swiper
    config = {
      loop: config.loop === 'true',
      effect: config.fade === 'true' ? 'fade' : 'slide',
      speed: parseInt(config.speed),
      slidesPerView: config.slides === 'auto' ? 'auto' : parseFloat(config.slides),
      spaceBetween: parseInt(config.spaceBetween),
      freeMode: config.freeMode === 'true',
      initialSlide: config.initialSlide ? (config.initialSlide === 'last' ? this.querySelectorAll('.swiper-slide').length - 1 : 0) : 0,
      direction: config.direction,
      watchOverflow: true,
      thumbs: {
        swiper: this.tumbsSwiper,
      },

      pagination: {
        el: `.${this.uniqueId} .swiper-pagination`,
        clickable: true,
      },

      navigation: {
        nextEl: `.${this.uniqueId} .swiper-button-next`,
        prevEl: `.${this.uniqueId} .swiper-button-prev`,
      },

      autoplay:
        config.autoplay === 'true'
          ? {
            delay: parseInt(config.delay),
          }
          : 'false',

      breakpoints: {
        768: {
          slidesPerView: config.slidesTablet ? (config.slidesTablet === 'auto' ? 'auto' : parseFloat(config.slidesTablet)) : config.slides === 'auto' ? 'auto' : parseFloat(config.slides),
        },
        992: {
          slidesPerView: config.slidesDesktop ? (config.slidesDesktop === 'auto' ? 'auto' : parseFloat(config.slidesDesktop)) : config.slides === 'auto' ? 'auto' : parseFloat(config.slides),
          spaceBetween: config.spaceBetweenDesktop,
          direction: config.directionDesktop,
        },
      },
    };
    console.log(config);
    return config;
  }

  initThumbsSlider (thumbsSelector) {
    const thumbsElement = document.getElementById(thumbsSelector);
    const swiperContainer = thumbsElement.querySelector('.swiper-container');
    let thumbsSwiperConfig = {};
    for (const [key, value] of Object.entries(this.defaultConfig)) {
      const attributeValue = thumbsElement.getAttribute(key);
      thumbsSwiperConfig[key] = attributeValue !== null ? attributeValue : value;
    }

    thumbsSwiperConfig = this.generateSwiperConfig(thumbsSwiperConfig);
    return new Swiper(swiperContainer, thumbsSwiperConfig);
  }
}

customElements.define('swiper-slider', SwiperSlider);

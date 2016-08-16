'use strict';

define(['domReady!', 'jquery', 'app/flex-carousel'], function (doc, jquery) {
    jquery('#main-carousel').flexCarousel();
    jquery('#carousel-movies').flexCarousel();    
});
'use strict';

define(['./flex-carousel', 'jquery'], function (flexCarousel, jquery) {
    jquery(function () {
        jquery('#main-carousel').flexCarousel();
        jquery('#carousel-movies').flexCarousel();
    });
});
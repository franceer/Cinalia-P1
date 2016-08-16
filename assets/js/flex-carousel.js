'use strict';

define(['jquery'], function (jquery) {
 
    (function ($) {
        $.fn.flexCarousel = function (options) {

            var $this = this;
            var carousels = [];

            var settings = $.extend({
                toggleButtonClass: '.toggle',
                paginButtonClass: '.pagin'
            }, options);

            var init = function () {
                $this.each(function () {
                    carousels.push(new FlexCarousel(jquery(this), settings));
                });
                
                return $this;
            };            

            return init();
        };
    }(jquery));

    function FlexCarousel($carousel, settings) {
        this.$carouselNode = $carousel,
        this.$toggleButtons = jquery(settings.toggleButtonClass + '[data-slide=' + this.$carouselNode.attr('id') + ']'),
        this.$paginButtons = jquery(settings.paginButtonClass + '[data-slide=' + this.$carouselNode.attr('id') + '] button');

        this.setupButtonHandlers();
    }

    FlexCarousel.prototype = function () {

        var setupButtonHandlers = function () {
            this.setToggleButtonClick();
            this.setPaginButtonClick();
        };

        var setToggleButtonClick = function () {
            var t = this;

            this.$toggleButtons.on('click', function (e) {
                var $currSliderControl = jquery(e.currentTarget);
                var $seats = t.$carouselNode.find('> .carousel-seat');
                var $newSeat;
                var $el = $seats.filter('.is-ref');

                $el.removeClass('is-ref');
                if ($currSliderControl.attr('data-toggle') === 'next') {
                    $newSeat = next($el, $seats);
                    t.$carouselNode.removeClass('is-reversing');
                } else {
                    $newSeat = prev($el, $seats);
                    t.$carouselNode.addClass('is-reversing');
                }

                t.$carouselNode.removeClass('is-set');
                $newSeat.addClass('is-ref').css('order', 1);

                if (t.$carouselNode.hasClass('main'))
                    t.changeActivePage($newSeat);

                for (var i = 2; i <= $seats.length; i++) {
                    $newSeat = next($newSeat, $seats, 0).css('order', i);
                }

                return setTimeout(function () {
                    return t.$carouselNode.addClass('is-set');
                }, 50);
            });
        };

        var setPaginButtonClick = function () {
            var t = this;

            if (!t.$paginButtons)
                return;

            this.$paginButtons.on('click', function (e) {

                t.$carouselNode.fadeOut(300, function () {
                    var $paginLink = jquery(e.currentTarget);
                    t.$paginButtons.filter('.active').removeClass('active');
                    var indexOfActive = $paginLink.addClass('active').index();
                    indexOfActive = indexOfActive === 0 ? 4 : indexOfActive - 1;
                    var $seats = t.$carouselNode.find('> .carousel-seat').removeClass('is-ref');
                    var $newSeat = $seats.filter(':eq(' + indexOfActive + ')');
                    $newSeat.addClass('is-ref').css('order', 1);

                    for (var i = 2; i <= $seats.length; i++) {
                        $newSeat = next($newSeat, $seats).css('order', i);
                    }

                    t.$carouselNode.fadeIn('fast');
                });
            });
        };

        var next = function ($el, $seats) {
            if ($el.next().length) {
                return $el.next();
            } else {
                return $seats.first();
            }
        };

        var prev = function ($el, $seats) {
            if ($el.prev().length) {
                return $el.prev();
            } else {
                return $seats.last();
            }
        };

        var changeActivePage = function ($newSeat) {
            var newSeatIndex = $newSeat.index();
            newSeatIndex = newSeatIndex === 4 ? 0 : newSeatIndex + 1;

            this.$paginButtons.filter('.active').removeClass('active');
            this.$paginButtons.filter(':eq(' + newSeatIndex + ')').addClass('active');
        }

        return {
            setupButtonHandlers: setupButtonHandlers,
            setPaginButtonClick: setPaginButtonClick,
            setToggleButtonClick: setToggleButtonClick,
            changeActivePage: changeActivePage
        };
    }();
});
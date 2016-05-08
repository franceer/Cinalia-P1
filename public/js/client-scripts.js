$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1) {
            $('header').addClass("sticky");
        }
        else {
            $('header').removeClass("sticky");
        }
    });

    var $player = $('.plyr'),
        playerElement = $player[0],
        animating = false;
    //////////////////////////////////////////
    $('.video-overlay').on('click', function () {
        $(this).hide();
        $(this).parent()[0].plyr.play();
    });
    $('.left').on('click', function (event) {
        if (animating)
            return;

        var length = $('#objects li').length;

        $('#objects li').each(function (index, element) {        
            var $element = $(element);
            var newOrder = +$element.css('order') + 1;
            newOrder = newOrder >= length ? 0 : newOrder;
            $element.css('order', newOrder).removeClass('first');

            if (newOrder === 0)
                $element.addClass('first').css('margin-left', '-50px');
        }).promise().done(function () { 
            animating = true;
            $('#objects .first').animate({'margin-left': '0px'}, 500, 'linear', function () { animating = false;});
        });
        
    });
    $('.right').on('click', function (event) {
        if (animating)
            return;

        var length = $('#objects li').length;
        animating = true;

        $('#objects .first').animate({ 'margin-left': '-50px' }, 500, 'linear',function () {
            animating = false;
             
            $.each($('#objects li'), function (index, element) {
                var $element = $(element);
                var newOrder = +$(element).css('order') - 1;
                newOrder = newOrder < 0 ? length - 1 : newOrder;
                $(element).css('order', newOrder).removeClass('first');
                
                if (newOrder === 0)
                    $element.addClass('first');
                else if (newOrder === length - 1)
                    $element.css('margin-left', 0);
            });            
        });       
    });
    $.each($('#objects li'), function (index, element) {        
        $(element).css('order', index).data('order', index).on('mouseenter', function (event) {
            event.stopPropagation();
            var $ul = $(event.target).parent('.film-assets');
            if (!$ul.hasClass('expanded'))
                $ul.addClass('expanded');
           
        }).on('mouseleave', function (event) {
            event.stopPropagation();
            var $ul = $(event.target).parent('.film-assets');
            if ($ul.hasClass('expanded'))
                $ul.removeClass('expanded');
        });
    });
    //////////////////////////////////////////
    $('#products ul').on('click', 'li', function (event) {
        event.stopPropagation();
        playerElement.plyr.pausedBeforeNavigatingProducts = playerElement.plyr.media.paused;
        var targetElement = this;
        
        if (!playerElement.plyr.media.paused)
            playerElement.plyr.pause();
        
        
        playerElement.plyr.backupTime = +playerElement.plyr.media.currentTime;
        playerElement.plyr.seek($(this).data('time-code'));
        $(document).on('click', function (event) {
            if (this == targetElement)
                return;
            
            var wasPaused = playerElement.plyr.pausedBeforeNavigatingProducts;
            playerElement.plyr.pausedBeforeNavigatingProducts = undefined;
            
            if (!wasPaused)
                playerElement.plyr.play();
            
            playerElement.plyr.seek(playerElement.plyr.backupTime);
            $(this).off('click');
        });
    });
    
    $player.on('timeupdate', function (event) {
        var plyrObject = playerElement.plyr;       
        
        if (plyrObject.pausedBeforeNavigatingProducts === undefined) {
            var roundedCurrentTime = Math.round(plyrObject.media.currentTime * 100) / 100;
            
            if (roundedCurrentTime === playerElement.tickTime)
                return;
            
            var forward = roundedCurrentTime > playerElement.tickTime;
            var $products = $('#products ul');
            var $lastProductInjected = $products.children('.visible:last');
            
            $products.children(':not(.visible)').each(function (index, element) {
                var $element = $(element);

                if (forward && $element.data('time-code') <= roundedCurrentTime) {
                    $element.css('margin-left', '100px').animate({ 'opacity': 1, 'margin-left': '0' }).addClass('visible');
                }
                else if(!forward && $element.data('time-code') >= roundedCurrentTime) {
                    $element.animate({ 'opacity': 0, 'margin-left': '100px' }, function () {
                        $(this).removeClass('visible').css('margin-left', '0');
                    });
                }
            });
           

            //var getPositions = function () {
            //    return $.grep(Object.keys(timelineArray), function (key) {
            //        if (forward) {
            //            var startTime = $lastProductInjected.length === 0 ? 0 : $lastProductInjected.data('time-code');
            //            return key > startTime && key <= roundedCurrentTime;
            //        }                    
            //        else {
            //            return key < plyrObject.media.duration && key >= roundedCurrentTime;
            //        }
            //    });
            //}
            
            //var positions = getPositions();
            ////console.log(forward?'forward':'backward');
            //$.each(positions, function (index1, position) {
            //    var products = timelineArray[position];
            //    var elementExists = $('li[data-time-code =' + position + ']').length > 0;
                
            //    $.each(products, function (index2, product) {
            //        if (forward) {
            //            if (elementExists) {
            //                $('li[data-time-code="' + position + '"][data-product-title="' + product.Title + '"]').animate({ 'opacity': 1, 'margin-left': '0' }).addClass('visible');                            
            //            } else {
            //                if ($products.children().length === 0)
            //                    $products.parent().addClass('visible');

            //                injectProducts(product, position);
            //            }
            //        } else {
            //            $('li[data-time-code="' + position + '"][data-product-title="' + product.Title + '"]').animate({ 'opacity': 0, 'margin-left': '100px' }).removeClass('visible');
            //        }
            //    });
            //});           
        }

        playerElement.tickTime = roundedCurrentTime;
    });
    initHighlights();
});

function initHighlights() {
    $('.pagin a').on('click', function (e) {
        e.preventDefault();
        var $carousel = $('#video-carousel');
        $carousel.fadeOut(300, function () {
            var $paginLink = $(e.currentTarget);
            $('.pagin .active').removeClass('active');
            var indexOfActive = $paginLink.addClass('active').parent().index();
            indexOfActive = indexOfActive === 0 ? 4 : indexOfActive - 1;
            var $seats = $carousel.find('> .carousel-seat').removeClass('is-ref');
            var $newSeat = $seats.filter(':eq(' + indexOfActive + ')');
            $newSeat.addClass('is-ref').css('order', 1);

            for (var i = 2; i <= $seats.length; i++) {
                $newSeat = next($newSeat, $seats).css('order', i);
            }

            $carousel.fadeIn('fast');
        });        
    });

    $('.toggle').on('click', function (e) {
        var $currSliderControl = $(e.currentTarget);
        var $carousel = $currSliderControl.data('slide') === undefined ? $currSliderControl.closest($currSliderControl.data('parent')) : $($currSliderControl.data('slide') + ":eq(0)");
        var $seats = $carousel.find('> .carousel-seat');
        var $newSeat;
        var $el = $seats.filter('.is-ref');

        // Info: e.target is what triggers the event dispatcher to trigger and e.currentTarget is what you assigned your listener to.

        $el.removeClass('is-ref');
        if ($currSliderControl.data('toggle') === 'next') {
            $newSeat = next($el, $seats);
            $carousel.removeClass('is-reversing');
        } else {
            $newSeat = prev($el, $seats);
            $carousel.addClass('is-reversing');
        }

        $carousel.removeClass('is-set');
        $newSeat.addClass('is-ref').css('order', 1);

        if ($carousel.hasClass('main'))
            changeActivePage($newSeat);

        for (var i = 2; i <= $seats.length; i++) {
            $newSeat = next($newSeat, $seats).css('order', i);
        }
        return setTimeout(function () {
            return $carousel.addClass('is-set');
        }, 50);        
    });

    function next($el, $seats) {
        if ($el.next().length) {
            return $el.next();
        } else {
            return $seats.first();
        }
    }

    function prev($el, $seats) {
        if ($el.prev().length) {
            return $el.prev();
        } else {
            return $seats.last();
        }
    }

    function changeActivePage($newSeat) {
        var newSeatIndex = $newSeat.index();
        newSeatIndex = newSeatIndex === 4 ? 0 : newSeatIndex + 1;
        var $paginElements = $('.pagin li');
        $paginElements.children('.active').removeClass('active');
        $paginElements.filter(':eq(' + newSeatIndex + ')').children('a').addClass('active');
    }
}

function initVideoCarousel() {
    var $videoCarousel = $('#player-carousel');
    $videoCarousel.find('.controls button').on('click', function (e) {
        $currentButton = $(e.currentTarget);
        $videoSheets = $videoCarousel.find('ul>li.row')
        $currentActiveVideo = $videoSheets.filter('.active');

        if ($currentButton.data('toggle') === 'next') {
            $newSeat = next($currentActiveVideo);
            $carousel.removeClass('is-reversing');
        } else {
            $newSeat = prev($currentActiveVideo);
            $carousel.addClass('is-reversing');
        }

        function next($el) {
            if ($el.next().length) {
                return $el.next();
            } else {
                return $videoSheets.first();
            }
        }

        function prev($el) {
            if ($el.prev().length) {
                return $el.prev();
            } else {
                return $videoSheets.last();
            }
        }
    });
}

function hideDomElement($element) {
    $element.fadeOut().hide(1000);
}

function injectProducts(product, position) {
        var $li = $('<li data-product-title="' + product.Title + '" data-time-code="' + position + '" class="visible"><img src="' + product.PictureURL + '" /></li>').css({ 'margin-left': '100px', 'opacity': 0 });
        
        //if ($('#products > li').length >= 3)
        //    hideDomElement($('#products > li:first'));
        
        $('#products ul').append($li).children(':last').animate({ 'opacity': 1, 'margin-left': '0' });
    }  
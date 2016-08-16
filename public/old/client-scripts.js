'use strict';
    //$(window).scroll(function () {
    //    if ($(this).scrollTop() > 1) {
    //        $('header').addClass("sticky");
    //    }
    //    else {
    //        $('header').removeClass("sticky");
    //    }
    //});

    //var $player = $('.plyr'),
    //    playerElement = $player[0],
    //    animating = false;
    ////////////////////////////////////////////
    //$('.video-overlay').on('click', function () {
    //    $(this).hide();
    //    $(this).parent()[0].plyr.play();
    //});
    
    //$.each($('#objects li'), function (index, element) {        
    //    $(element).css('order', index).data('order', index).on('mouseenter', function (event) {
    //        event.stopPropagation();
    //        var $ul = $(event.target).parent('.film-assets');
    //        if (!$ul.hasClass('expanded'))
    //            $ul.addClass('expanded');
           
    //    }).on('mouseleave', function (event) {
    //        event.stopPropagation();
    //        var $ul = $(event.target).parent('.film-assets');
    //        if ($ul.hasClass('expanded'))
    //            $ul.removeClass('expanded');
    //    });
    //});
    //////////////////////////////////////////
    //$('#products ul').on('click', 'li', function (event) {
    //    event.stopPropagation();
    //    playerElement.plyr.pausedBeforeNavigatingProducts = playerElement.plyr.media.paused;
    //    var targetElement = this;
        
    //    if (!playerElement.plyr.media.paused)
    //        playerElement.plyr.pause();
        
        
    //    playerElement.plyr.backupTime = +playerElement.plyr.media.currentTime;
    //    playerElement.plyr.seek($(this).data('time-code'));
    //    $(document).on('click', function (event) {
    //        if (this == targetElement)
    //            return;
            
    //        var wasPaused = playerElement.plyr.pausedBeforeNavigatingProducts;
    //        playerElement.plyr.pausedBeforeNavigatingProducts = undefined;
            
    //        if (!wasPaused)
    //            playerElement.plyr.play();
            
    //        playerElement.plyr.seek(playerElement.plyr.backupTime);
    //        $(this).off('click');
    //    });
    //});
    
    //$player.on('timeupdate', function (event) {
    //    var plyrObject = playerElement.plyr;       
        
    //    if (plyrObject.pausedBeforeNavigatingProducts === undefined) {
    //        var roundedCurrentTime = Math.round(plyrObject.media.currentTime * 100) / 100;
            
    //        if (roundedCurrentTime === playerElement.tickTime)
    //            return;
            
    //        var forward = roundedCurrentTime > playerElement.tickTime;
    //        var $products = $('#products ul li');
    //        let modifications = 0;
            
    //        if (forward) {
    //            $products.filter(':not(.visible)').each(function (index, element) {
    //                var $element = $(element);

    //                if ($element.attr('data-time-code') <= roundedCurrentTime) {
                        
    //                    $element.animate({ 'opacity': 1 }).addClass('visible');            
                           
    //                    if ($products.filter('.visible').length > 16) {
    //                        modifications++;

    //                        if (!playerElement.unsyncAssets)
    //                            $('button[data-toggle=prev]').show();
    //                    }
    //                }                  
    //            });                
    //        } else {
    //            $products.filter('.visible').each(function (index, element) {
    //                var $element = $(element);

    //                if ($element.attr('data-time-code') >= roundedCurrentTime) {
    //                    $element.animate({ 'opacity': 0 }).removeClass('visible');

    //                    if ($products.filter('.visible').length >= 16)
    //                        modifications++;                        
    //                }
    //            });
    //        }

    //        $products.filter('[data-current=true]').removeAttr('data-current');
    //        $products.filter('.visible:last').attr('data-current', 'true');
    //        animateTimelineOnTimeUpdate(modifications, forward);
    //    }

    //    playerElement.tickTime = roundedCurrentTime;
    //});

    //function animateTimelineOnTimeUpdate(modifications, forward) {
    //    let $carousel = $('.timeline-bar');
    //    let $seats = $carousel.find('> .carousel-seat');
    //    let $newSeat;

    //    if ($seats.filter('.visible').length <= 16) {
    //        playerElement.unsyncAssets = false;
    //        $('button[data-toggle=next]').hide();
    //        $('button[data-toggle=prev]').hide();
    //    }

    //    if (modifications === 0 || playerElement.unsyncAssets)
    //        return;
            
    //    let assetIndex = modifications - 1;
    //    let $el = $seats.filter('.is-ref');
    //    $el.removeClass('is-ref');

    //    if (forward) {
    //        $newSeat = next($el, $seats, assetIndex);
    //        $carousel.removeClass('is-set').css('transform', 'translateX(' + (775/16) * (assetIndex + 1) + 'px)');
    //    } else {
    //        $newSeat = prev($el, $seats, assetIndex);
    //        $carousel.removeClass('is-set').css('transform', 'translateX(-' + (775 / 16) * (assetIndex + 1) + 'px)');
    //    }


    //    $newSeat.addClass('is-ref').css('order', 1);

    //    if ($newSeat.attr('data-position') && $newSeat.attr('data-position') === 'last')
    //        $('button[data-toggle=prev]').hide();
    //    else
    //        $('button[data-toggle=prev]').show();

    //    for (var i = 2; i <= $seats.length; i++) {
    //        $newSeat = next($newSeat, $seats, 0).css('order', i);

    //        if (i === 18 && $newSeat.attr('data-position') && $newSeat.attr('data-position') === 'first')
    //            $('button[data-toggle=next]').hide();                
    //        else if (i === 17 && $newSeat.attr('data-current')) {
    //            $('button[data-toggle=next]').hide();                
    //        }                           
    //    }

    //    return setTimeout(function () {
    //        return $carousel.css('transform', '').addClass('is-set');
    //    }, 50);
    //}

    //function next($el, $seats, positionIndex) {
    //    let $nextElements = $el.nextAll();

    //    if ($nextElements.length < positionIndex + 1)
    //        $nextElements = $seats;

    //    return $nextElements.eq(positionIndex);
    //}

    //function prev($el, $seats, positionIndex) {
    //    let $prevElements = $el.prevAll();

    //    if ($prevElements.length <= positionIndex) {
    //        positionIndex = ($seats.length - 1) - Math.abs($prevElements.length - positionIndex);
    //        $prevElements = $seats;
    //    }

    //    return $prevElements.eq(positionIndex);
    //}

    //$('.start').click(function (e) {
    //    let $carousel = $('.timeline-bar');
    //    let $seats = $carousel.find('> .carousel-seat');
    //    let $newSeat = $seats.last();

    //    $('.is-ref').removeClass('is-ref');
    //    let order = ($seats.length - $newSeat.css('order')) + 1;
    //    $carousel.removeClass('is-set').css('transform', 'translateX(-' + (775 / 16) * order + 'px)');
    //    $newSeat.addClass('is-ref').css('order', 1);

    //    for (var i = 2; i <= $seats.length; i++) {
    //        $newSeat = next($newSeat, $seats, 0).css('order', i);
    //    }

    //    $('button[data-toggle=prev]').hide();

    //    if ($seats.length > 16)
    //        $('button[data-toggle=next]').show();

    //    return setTimeout(function () {
    //        return $carousel.css('transform', '').addClass('is-set');
    //    }, 50);
    //});

    //$('.current').click(function (e) {
    //    let $carousel = $('.timeline-bar');
    //    let $seats = $carousel.find('> .carousel-seat');
    //    let $newSeat = prev($('[data-current]'), $seats, 15);

    //    $('.is-ref').removeClass('is-ref');
    //    let order = ($newSeat.css('order') - 1) < 16 ? ($newSeat.css('order') - 1) : 16;
    //    $carousel.removeClass('is-set').css('transform', 'translateX(' + (775 / 16) * order + 'px)');
    //    $newSeat.addClass('is-ref').css('order', 1);      

    //    for (var i = 2; i <= $seats.length; i++) {
    //        $newSeat = next($newSeat, $seats, 0).css('order', i);          
    //    }

    //    $('button[data-toggle=next]').hide();

    //    if ($seats.length > 16)
    //        $('button[data-toggle=prev]').show();

    //    return setTimeout(function () {
    //        return $carousel.css('transform', '').addClass('is-set');
    //    }, 50);
    //});
$(function () {

    //$('#look-products-section #product-lines .asset-img, .timeline-bar .asset-img').mouseenter(function (e) {
    //    console.log('In: ' + $(this).attr('class') + ' id: ' + $(this).attr('id'));

    //    $(this).velocity('stop').velocity({ marginRight: 200 }, { duration: 200 });
    //    $(this).children('a').velocity('stop').velocity({ scale: 2 }, { duration: 100 });
    //    $(this).children('.asset-info').velocity('stop').velocity({ opacity: 1, width: 250 }, { delay: 100, duration: 100 }).children().velocity('stop').velocity({ opacity: 1 }, { delay: 200 });

    //}).mouseleave(function (e) {
    //    console.log('Out: ' + $(this).attr('class') + ' id: ' + $(this).attr('id'));

    //    $(this).velocity('stop').velocity({ marginRight: 30 }, { duration: 200 });
    //    $(this).children('.asset-info').velocity("stop").velocity({ opacity: 0, width: 0 }, { duration: 100 }).children().velocity('stop').velocity({ opacity: 0 });
    //    $(this).children('a').velocity("stop").velocity({ scale: 1 }, { duration: 100, delay: 100 });
    //});

    //if (inIframe()) {
    //    $('.modal-hidden').hide();
    //    $('.container').removeClass('container').addClass('container-fluid');
    //}

    //function inIframe() {
    //    try {
    //        return window.self !== window.top;
    //    } catch (e) {
    //        return true;
    //    }
    //}

    //$('#pagin button').on('click', function (e) {
    //    var $carousel = $('#main-carousel');
    //    $carousel.fadeOut(300, function () {
    //        var $paginLink = $(e.currentTarget);
    //        $('#pagin .active').removeClass('active');
    //        var indexOfActive = $paginLink.addClass('active').index();
    //        indexOfActive = indexOfActive === 0 ? 4 : indexOfActive - 1;
    //        var $seats = $carousel.find('> .carousel-seat').removeClass('is-ref');
    //        var $newSeat = $seats.filter(':eq(' + indexOfActive + ')');
    //        $newSeat.addClass('is-ref').css('order', 1);

    //        for (var i = 2; i <= $seats.length; i++) {
    //            $newSeat = next($newSeat, $seats).css('order', i);
    //        }

    //        $carousel.fadeIn('fast');
    //    });
    //});

    //$('.toggle').on('click', function (e) {
    //    playerElement.unsyncAssets = true;
    //    var $currSliderControl = $(e.currentTarget);
    //    var $carousel = $currSliderControl.attr('data-slide') === undefined ? $currSliderControl.closest($currSliderControl.attr('data-parent')) : $($currSliderControl.attr('data-slide') + ":eq(0)");
    //    var $seats = $carousel.find('> .carousel-seat');
    //    var $newSeat;
    //    var $el = $seats.filter('.is-ref');            

    //    // Info: e.target is what triggers the event dispatcher to trigger and e.currentTarget is what you assigned your listener to.

    //    $el.removeClass('is-ref');
    //    if ($currSliderControl.attr('data-toggle') === 'next') {
    //        $newSeat = next($el, $seats, 0);
    //        $carousel.removeClass('is-reversing');
    //    } else {
    //        $newSeat = prev($el, $seats, 0);
    //        $carousel.addClass('is-reversing');
    //    }

    //    $carousel.removeClass('is-set');
    //    $newSeat.addClass('is-ref').css('order', 1);

    //    if ($newSeat.attr('data-position') && $newSeat.attr('data-position') === 'last')
    //        $('button[data-toggle=prev]').hide();
    //    else
    //        $('button[data-toggle=prev]').show();

    //    if ($carousel.hasClass('main'))
    //        changeActivePage($newSeat);

    //    //let showNext = true;

    //    for (var i = 2; i <= $seats.length; i++) {
    //        $newSeat = next($newSeat, $seats, 0).css('order', i);

    //        //if(i === 17 && $newSeat.attr('data-current')){
    //        //    showNext = false;
    //        //    playerElement.unsyncAssets = false;
    //        //}

    //        //if (i === 18 && $newSeat.attr('data-position') && $newSeat.attr('data-position') === 'first') {
    //        //    showNext = false;
    //        //}                        
    //    }

    //    //if (showNext)            
    //    //    $('button[data-toggle=next]').show();
    //    //else
    //    //    $('button[data-toggle=next]').hide();

    //    return setTimeout(function () {
    //        return $carousel.addClass('is-set');
    //    }, 50);
    //});

    //function changeActivePage($newSeat) {
    //    var newSeatIndex = $newSeat.index();
    //    newSeatIndex = newSeatIndex === 4 ? 0 : newSeatIndex + 1;
    //    var $paginElements = $('#pagin button');
    //    $paginElements.filter('.active').removeClass('active');
    //    $paginElements.filter(':eq(' + newSeatIndex + ')').addClass('active');
    //}
    

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
});


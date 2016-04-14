$(function () {

    var $player = $('.plyr'),
        playerElement = $player[0],
        animating = false;
    //////////////////////////////////////////
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
});

function hideDomElement($element) {
    $element.fadeOut().hide(1000);
}

function injectProducts(product, position) {
        var $li = $('<li data-product-title="' + product.Title + '" data-time-code="' + position + '" class="visible"><img src="' + product.PictureURL + '" /></li>').css({ 'margin-left': '100px', 'opacity': 0 });
        
        //if ($('#products > li').length >= 3)
        //    hideDomElement($('#products > li:first'));
        
        $('#products ul').append($li).children(':last').animate({ 'opacity': 1, 'margin-left': '0' });
    }  
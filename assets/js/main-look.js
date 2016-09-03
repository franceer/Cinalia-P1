'use strict';

define(['jquery', 'raphael', 'velocity'], function (jquery, Raphael, velocity) {
   
    function LookLineBuilder() {
        var t = this;

        this.drawPaths();
        this.setLineHoverHandler();

        jquery(window).resize(function () {
            t.paper.remove();
            t.drawPaths();
            t.setLineHoverHandler();
        });
    }

    LookLineBuilder.prototype = function () {
        var drawPaths = function () {
            var t = this;
            this.$lookProducts = jquery('#look-products');
            this.topLeftOffset = this.$lookProducts.offset();
            this.topLeftCoord = { 'X': this.topLeftOffset.left, 'Y': this.topLeftOffset.top };
            this.paper = Raphael(0, 0, '100%', '100%');
            jquery(this.paper.canvas).attr('id', 'product-paths')

            jquery('.matching-icon').each(function () {

                var $markerElement = jquery(this);
                var $lineAsset = jquery('#' + $markerElement.data('asset-line'));

                if ($lineAsset.length === 0) {
                    $markerElement.remove();
                    return true;
                }

                var markerCenter = getCenterCoord($markerElement);                
                var lineLeftCenter = getLeftCenterCoord($lineAsset);
                drawPath(t.paper, $markerElement.data('asset-line'), markerCenter, lineLeftCenter);
            });
        };

        var drawPath = function (paper, lineID, markerCenter, lineLeftCenter) {
            var width = lineLeftCenter.X - markerCenter.X;
            var middleX = markerCenter.X + Math.abs(width / 2);
            var line = 'M' + markerCenter.X + ' ' + markerCenter.Y + ' L' + middleX + ' ' + markerCenter.Y + ' L' + middleX + ' ' + lineLeftCenter.Y + ' L' + lineLeftCenter.X + ' ' + lineLeftCenter.Y;
            var path = paper.path(line);
            jquery(path[0]).addClass('product-path').data('asset-line', lineID);
        };

        var getCenterCoord = function ($element) {
            var offset = $element.offset();
            //var offset2 = $element[0].getBoundingClientRect();
            //console.log('top: ' + offset2.top + 'left: ' + offset2.left);
            //console.log('Jquery : top: ' + offset.top + 'left: ' + offset.left);
            var width = $element.width();
            var height = $element.height();

            var centerX = offset.left + width / 2;
            var centerY = offset.top + height / 2;
            return { 'X': centerX, 'Y': centerY };
        };

        var getLeftCenterCoord = function ($element) {
            var offset = $element.offset();
            var height = $element.height();

            var centerX = offset.left;
            var centerY = offset.top + height / 2;
            return { 'X': centerX, 'Y': centerY };
        };

        var setLineHoverHandler = function () {
            jquery('.product-line').off('mouseenter mouseleave').hover(function (e) {
                var index = jquery(this).prevAll('.product-line').length;
                jquery('#product-paths path:nth-of-type(' + (index + 1) + ')').addClass('visible');
            }, function (e) {
                var index = jquery(this).prevAll('.product-line').length;
                jquery('#product-paths path:nth-of-type(' + (index + 1) + ')').removeClass('visible');
            });
        };

        return {
            drawPaths: drawPaths,
            setLineHoverHandler: setLineHoverHandler
        };
    }();
    jquery(function () {
        new LookLineBuilder();

        jquery('#look-products-section #product-lines .asset-img').mouseenter(function (e) {
            try {               
                jquery(this).velocity('stop').velocity({ marginRight: 200 }, { duration: 200 });
                jquery(this).children('a').velocity('stop').velocity({ scale: 1.5 }, { duration: 100 });
                jquery(this).children('.asset-info').velocity('stop').velocity({ opacity: 1, width: 250 }, { delay: 100, duration: 100 }).children().velocity('stop').velocity({ opacity: 1 }, { delay: 200 });
            } catch (err) { console.log(err.message); }

        }).mouseleave(function (e) {
            try {                
                jquery(this).velocity('stop').velocity({ marginRight: 30 }, { duration: 200 });
                jquery(this).children('.asset-info').velocity("stop").velocity({ opacity: 0, width: 0 }, { duration: 100 }).children().velocity('stop').velocity({ opacity: 0 });
                jquery(this).children('a').velocity("stop").velocity({ scale: 1 }, { duration: 100, delay: 100 });
            } catch (err) { console.log(err.message); }
        });
    });    
});
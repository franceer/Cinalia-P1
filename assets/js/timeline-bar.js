'use strict';

define(['jquery', 'velocity', './pickedin-player'], function (jquery, velocity, PickedInPlayer) {

    function TimelineBar($timelineBarNode, pickedInPlayer) {
        this.$nodeElement = $timelineBarNode,
        this.pickedInPlayer = pickedInPlayer,
        this.shifts = 0,
        this.$startButton = $timelineBarNode.parent().siblings('button[data-action=start]'),
        this.$prevButton = $timelineBarNode.parent().siblings('button[data-action=prev]'),
        this.$nextButton = $timelineBarNode.parent().siblings('button[data-action=next]'),
        this.$syncButton = $timelineBarNode.parent().siblings('button[data-action=sync]'),
        this.$assets = $timelineBarNode.children(),
        this.$isRefElement = $timelineBarNode.children('.is-ref'),
        this.$firstElement = $timelineBarNode.children(':first'),
        this.$lastElement = $timelineBarNode.children(':last'),
        this.$currentElement = $timelineBarNode.children('[data-current=true]'),
        this.assetNumber = 14,
        this.unsyncAssets = false;
		
		if(this.$assets.length <= this.assetNumber){
			this.$isRefElement.removeClass('is-ref');
			this.$isRefElement = this.$firstElement.addClass('is-ref');
			this.$nodeElement.addClass('no-slide');
		}			

        this.setControlButtonHandlers();
        this.setAssetMouseHandlers();        
    }

    TimelineBar.prototype = function () {

        var nextAssets = function ($el, $seats, positionIndex) {
            var $nextElements = $el.nextAll();

            if ($nextElements.length < positionIndex + 1)
                $nextElements = $seats;

            return $nextElements.eq(positionIndex);
        };

        var prevAssets = function ($el, $seats, positionIndex) {
            var $prevElements = $el.prevAll();

            if ($prevElements.length <= positionIndex) {
                positionIndex = ($seats.length - 1) - Math.abs($prevElements.length - positionIndex);
                $prevElements = $seats;
            }

            return $prevElements.eq(positionIndex);
        };

        var onTimeUpdate = function () {
            this.showMediaAssets();           
            this.animateCarousel();
            this.actualizeControlButtons();            
        };

        var showMediaAssets = function () {
            var t = this;
            var assetsVisibility = this.pickedInPlayer.forward ? ':not(.visible)' : '.visible';
            this.shifts = 0;

            this.$assets.filter(assetsVisibility).each(function () {
                var $asset = jquery(this);
                var isInTime = $asset.attr('data-time-code') <= t.pickedInPlayer.roundedCurrentTime;

                if (isInTime && t.pickedInPlayer.forward) {
                    $asset.velocity({ 'opacity': 1 }).addClass('visible');

                    if (t.$assets.filter('.visible').length > t.assetNumber)
                        t.shifts++;
                }
                else if (!isInTime && !t.pickedInPlayer.forward) {
                    $asset.velocity({ 'opacity': 0 }).removeClass('visible');

                    if (t.$assets.filter('.visible').length >= t.assetNumber)
                        t.shifts++;
                }
            });

            this.$currentElement.removeAttr('data-current');
            this.$currentElement = this.$assets.filter('.visible:last').attr('data-current', 'true');
        };

        var animateCarousel = function (buttonAction) {

            if (this.shifts === 0 || (this.unsyncAssets && !buttonAction))
                return;

            var t = this;
            var assetIndex = this.shifts - 1;
            this.$isRefElement.removeClass('is-ref');
            var forward;

            if((buttonAction && (buttonAction === 'next' || buttonAction === 'sync')))
                forward = true;
            else if((buttonAction && (buttonAction === 'prev' || buttonAction === 'start')))
                forward = false;
            else
                forward = this.pickedInPlayer.forward

            if (forward) {
                this.$isRefElement = nextAssets(this.$isRefElement, this.$assets, assetIndex);
                this.$nodeElement.removeClass('is-set').css('transform', 'translateX(' + (this.$nodeElement.width() / this.assetNumber) * (assetIndex + 1) + 'px)');
            } else {
                this.$isRefElement = prevAssets(this.$isRefElement, this.$assets, assetIndex);
                this.$nodeElement.removeClass('is-set').css('transform', 'translateX(-' + (this.$nodeElement.width() / this.assetNumber) * (assetIndex + 1) + 'px)');
            }


            var $newSeat = this.$isRefElement.addClass('is-ref').css('order', 1);            

            for (var i = 2; i <= this.$assets.length; i++) {
                $newSeat = nextAssets($newSeat, this.$assets, 0).css('order', i);
            }

            return setTimeout(function () {
                //t.$isRefElement.css('opacity', 0);
                return t.$nodeElement.css('transform', '').addClass('is-set');
            }, 50);
        };

        var setAssetMouseHandlers = function () {
            this.$nodeElement.find('.asset-img').mouseenter(function (e) {
                console.log(e.target.className);
                jquery(this).children('a').velocity('stop').velocity({ scale: 2 }, { duration: 100 });
                jquery(this).children('.asset-info').velocity('stop').velocity({ opacity: 1, maxWidth: 500 }, { delay: 100, duration: 100, display: 'flex' }).children().velocity('stop').velocity({ opacity: 1 }, { delay: 200 });

            }).mouseleave(function (e) {
                jquery(this).children('.asset-info').velocity("stop").velocity({ opacity: 0, maxWidth: 0 }, { duration: 100, display: 'none' }).children().velocity('stop').velocity({ opacity: 0 });
                jquery(this).children('a').velocity("stop").velocity({ scale: 1 }, { duration: 100, delay: 100 });
            });
        };

        var setControlButtonHandlers = function () {
            var t = this;

            this.$nodeElement.parent().siblings('button[data-action]').on('click', function (e) {
                var action = jquery(this).attr('data-action');

                switch (action) {
                    case 'prev':
                        t.shifts = 1;
                        t.unsyncAssets = true;
                        t.animateCarousel(action);
                        break;
                    case 'next':
                        t.shifts = 1;
                        t.unsyncAssets = true;
                        t.animateCarousel(action);

                        if (t.$currentElement.css('order') == (t.assetNumber + 1))
                            t.unsyncAssets = false;

                        break;
                    case 'start':
                        t.shifts = (t.$assets.length - t.$assets.last().css('order')) + 1;
                        t.unsyncAssets = true;
                        t.animateCarousel(action);
                        break;
                    case 'sync':
                        var calc = prevAssets(jquery('[data-current]'), t.$assets, t.assetNumber - 1).css('order') - 1;
                        t.shifts = calc < t.assetNumber ? calc : t.assetNumber;
                        t.animateCarousel(action);
                        t.unsyncAssets = false;
                        break;
                }

                t.actualizeControlButtons();
            });
        };

        var actualizeControlButtons = function () {
            if (this.$assets.filter('.visible').length <= this.assetNumber) {
                this.$nextButton.prop('disabled', true);
                this.$prevButton.prop('disabled', true);
                this.$startButton.prop('disabled', true);
                this.$syncButton.prop('disabled', true);
                return;
            }

            if (this.$isRefElement.attr('data-position') === 'last') {
                this.$prevButton.prop('disabled', true);
                this.$startButton.prop('disabled', true);
            }
            else {
                this.$prevButton.prop('disabled', false);
                this.$startButton.prop('disabled', false);
            }

            //if (nextAssets(this.$isRefElement, this.$assets, this.assetNumber + 1).attr('data-position') === 'first')
            //    this.$nextButton.hide();
            if (this.$currentElement.css('order') == (this.assetNumber + 1)) {
                this.$nextButton.prop('disabled', true);
                this.$syncButton.prop('disabled', true);
            } else{
                this.$nextButton.prop('disabled', false);
                this.$syncButton.prop('disabled', false);
            }
        };

        return {
            onTimeUpdate: onTimeUpdate,
            showMediaAssets: showMediaAssets,
            animateCarousel: animateCarousel,
            actualizeControlButtons: actualizeControlButtons,
            setControlButtonHandlers: setControlButtonHandlers,
            setAssetMouseHandlers: setAssetMouseHandlers
        };
    }();

    return TimelineBar;
});
'use strict';

define(['jquery', 'app/timeline-bar'], function (jquery, TimelineBar) {

    function PickedInPlayer($player, timelineClass) {
        var t = this;
        this.$plyrObject = $player,
        this.plyrInstance = $player[0].plyr,
        this.pausedBeforeNavigatingProducts,
        this.previousTickTime,
        this.roundedCurrentTime = Math.round(this.plyrInstance.media.currentTime * 100) / 100,
        this.forward = true,
        this.timelineBarObjects = [],
        this.$overlay = $player.children('.video-overlay');
        
        $player.next('.assets-nav').find(timelineClass).each(function () {
            t.timelineBarObjects.push(new TimelineBar($(this), t));
        });

        this.setOverlayHandlers();
        this.setOnTimeUpdate();
    }

    PickedInPlayer.prototype = function () {

        var actualize = function () {
            this.roundedCurrentTime = Math.round(this.plyrInstance.media.currentTime * 100) / 100;

            if (this.roundedCurrentTime === this.previousTickTime)
                throw 'Ticking too fast';

            this.forward = this.roundedCurrentTime > this.previousTickTime;
        };

        var setOnTimeUpdate = function () {
            var t = this;

            this.$plyrObject.on('timeupdate', function (e) { 
                try {
                    t.actualize();
                } catch (err) {
                    return;
                }

                if (t.pausedBeforeNavigatingProducts === undefined) {
                    $.each(t.timelineBarObjects, function () {
                        this.onTimeUpdate();
                    });
                }

                t.previousTickTime = t.roundedCurrentTime;
            });
        };

        var setOverlayHandlers = function () {
            var t = this;

            this.$overlay.on('click', function (e) {
                t.$overlay.hide();
                t.plyrInstance.play();
            });

            this.$plyrObject.on('play', function (e) {
                t.$overlay.hide();
            });
        };

        return {
            setOnTimeUpdate: setOnTimeUpdate,
            actualize: actualize,
            setOverlayHandlers: setOverlayHandlers
        };
    }();

    return PickedInPlayer;
});
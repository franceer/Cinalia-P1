'use strict';

define(['jquery', './timeline-bar'], function (jquery, TimelineBar) {

    function PickedInPlayer(plyrInstance, $playerObj, timelineClass) {
        var t = this;
        this.plyrInstance = plyrInstance,
        this.pausedBeforeNavigatingProducts,
        this.previousTickTime,
        this.roundedCurrentTime = Math.round(this.plyrInstance.getCurrentTime() * 100) / 100,
        this.forward = true,
        this.timelineBarObjects = [],
        this.$overlay = $playerObj.children('.video-overlay');
        
        $playerObj.next('.assets-nav').find(timelineClass).each(function () {
            t.timelineBarObjects.push(new TimelineBar(jquery(this), t));
        });

        this.setOverlayHandlers();
        this.setOnTimeUpdate();
    }

    PickedInPlayer.prototype = function () {

        var actualize = function () {
            this.roundedCurrentTime = Math.round(this.plyrInstance.getCurrentTime() * 100) / 100;

            if (this.roundedCurrentTime === this.previousTickTime)
                throw 'Ticking too fast';

            this.forward = this.roundedCurrentTime > this.previousTickTime;
        };

        var setOnTimeUpdate = function () {
            var t = this;

            this.plyrInstance.on('timeupdate', function (e) {
                //if (t.updating) {
                //    console.log('updating return');
                //    return;
                //}

                //t.updating = true;

                try {
                    t.actualize();
                } catch (err) {
                    console.log(err);
                    return;
                }

                if (t.pausedBeforeNavigatingProducts === undefined) {
                    jquery.each(t.timelineBarObjects, function () {
                        this.onTimeUpdate();
                    });
                }
                                
                t.previousTickTime = t.roundedCurrentTime;
                //t.updating = false;
            });
        };

        var setOverlayHandlers = function () {
            var t = this;

            this.$overlay.on('click', function (e) {
                t.$overlay.hide();
                t.plyrInstance.play();
            });

            this.plyrInstance.on('play', function (e) {
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
'use strict';

define(['./pickedin-player', 'plyr', 'bootstrap','tether', 'jquery'], function (PickedInPlayer, plyr, bootstrap, tether, jquery) {
   
    // JavaScript source code
    (function ($) {
        $.fn.timelinePlayer = function (options) {
            var $this = this;
            var pickedInPlayers = [];

            // This is the easiest way to have default options.
            var settings = $.extend({
                // These are the defaults.
                timelineClass: ".timeline-bar",
            }, options);

            var init = function () {
                plyr.setup($this.get());

                $this.each(function () {
                    pickedInPlayers.push(new PickedInPlayer($(this), settings.timelineClass));
                });
            };

            init();

            return $this;
        };
    }(jquery));

    jquery(function () {
        jquery('.pickedin-player').timelinePlayer();        
    });
});


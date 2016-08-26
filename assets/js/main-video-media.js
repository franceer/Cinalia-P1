'use strict';

define(['./pickedin-player', 'plyr', 'bootstrap','tether', 'jquery'], function (PickedInPlayer, plyr, bootstrap, tether, jquery) {
   
    // JavaScript source code
    (function ($) {
        $.fn.timelinePlayer = function (selector, options) {
            var $this = this;
            var pickedInPlayers = [];

            // This is the easiest way to have default options.
            var settings = $.extend({
                // These are the defaults.
                timelineClass: ".timeline-bar",
            }, options);

            var init = function () {
                $this.each(function () {
                    var playerInstance = plyr.setup(this, { controls: ['play', 'progress', 'current-time', 'mute', 'volume'] });
                    pickedInPlayers.push(new PickedInPlayer(playerInstance[0], $(this), settings.timelineClass));
                });
            };

            init();

            return $this;
        };
    }(jquery));

    jquery(function () {
        jquery('.pickedin-player').timelinePlayer('.pickedin-player');
        jquery('#filter-products').change(function (e) {
            jquery.get(window.location.href, { filter: $(this).val() }).done(function (data) {
                jquery('#filtered-assets').replaceWith(data);
            });
        });
    });
});


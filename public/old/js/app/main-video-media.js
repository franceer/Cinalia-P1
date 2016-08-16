'use strict';

define(['domReady!','jquery', 'plyr', 'app/pickedin-player', 'bootstrap'], function (doc, jquery, plyr, PickedInPlayer, bootstrap) {
   
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
        jquery('.plyr').timelinePlayer().init();
        jquery('a[data-modal]').on('click', function (e) {
            e.preventDefault();

            jquery('#myModal iframe').attr('src', jquery(this).attr('href'));
            setTimeout(function () {
                $('#myModal').modal();
            }, 300);
        });
    });
});


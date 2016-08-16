'use strict';

define(['jquery', 'pickedin-player'], function (jquery, PickedInPlayer) {

    // JavaScript source code
    (function ($) {
        $.fn.timelinePlayer = function (options) {
            let pickedInPlayers = {};

            // This is the easiest way to have default options.
            let settings = $.extend({
                // These are the defaults.
                timelineClass: ".timeline-bar",
            }, options);

            let init = function () {
                plyr.setup(this.get());

                this.each(function () {
                    pickedInPlayers.push(new PickedInPlayer($(this)));
                });

                setupHandlers();
            }

            let showMediaAssets = function ($assets, show) {
                let modifications = 0;
                let assetsVisibility = show ? '.visible' : ':not(.visible)';
                let isInTime = $element.attr('data-time-code') <= roundedCurrentTime;

                $assets.filter(assetsVisibility).each(function () {
                    if (isInTime && show) {
                        $element.animate({ 'opacity': 1 }).addClass('visible');

                        if ($products.filter('.visible').length > settings.elementsNumberInBar)
                            modifications++;
                    }
                    else if (!isInTime && !show) {
                        $element.animate({ 'opacity': 0 }).removeClass('visible');

                        if ($products.filter('.visible').length >= settings.elementsNumberInBar)
                            modifications++;
                    }
                });

                return modifications;
            }

            // Greenify the collection based on the settings variable.
            return this.css({
                init: settings.color,
                backgroundColor: settings.backgroundColor
            });

        };
    }(jquery));
});

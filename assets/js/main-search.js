'use strict';

define(['jquery'], function (jquery) {
   
    // JavaScript source code
    (function ($) {
        $.fn.paginate = function (options) {
            var $this = this;            

            // This is the easiest way to have default options.
            var settings = $.extend({
                // These are the defaults.
                
            }, options);

            var init = function () {
                $this.each(function () {
                    $currentPaginate = $(this);
                    var itemCount = $currentPaginate.attr('data-item-count');
                    var pageCount = $currentPaginate.attr('data-page-count');

                    if (pageCount === '1')
                        $currentPaginate.hide();

                    var currentPage = getParameterByName('page') ? getParameterByName('page') : $currentPaginate.attr('data-current-page');
                    buildPages(pageCount, currentPage);
                });
            };

            var buildPages = function (pageCount, currentPage) {
                var html = '';

                for (var i = 1; i <= pageCount; i++) {
                    var url = removeParam('page', window.location.href);

                    html += parseInt(currentPage) === i ? '<li class="active">' : '<li>';
                    html += '<a href="' + url + '&page=' + i + '">'+ i + '</a></li>';
                }

                $currentPaginate.append(html);
            };

            var getParameterByName = function (name, url) {
                if (!url)
                    url = window.location.href;

                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);

                if (!results || !results[2])
                    return null;

                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            };

            var removeParam = function (key, sourceURL) {
                var rtn = sourceURL.split('?')[0],
                    param,
                    params_arr = [],
                    queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
                if (queryString !== '') {
                    params_arr = queryString.split('&');
                    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                        param = params_arr[i].split('=')[0];
                        if (param === key) {
                            params_arr.splice(i, 1);
                        }
                    }
                    rtn = rtn + '?' + params_arr.join('&');
                }
                return rtn;
            };

            init();

            return $this;
        };
    }(jquery));

    jquery(function () {
        jquery('.pagination').paginate();        
    });
});


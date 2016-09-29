webpackJsonp([8],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function($) {'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (jquery) {
	    jquery(function () {
	        let navButtons = jquery('.nav-button button');
	        navButtons.on('click', function (e) {
	            navButtons.filter('.active').removeClass('active');
	            let paneSelector = jquery(this).addClass('active').attr('data-pane-id');
	            jquery('#active-panes .active').removeClass('active');
	            jquery('#' + paneSelector).addClass('active');
	        });

	        jquery('.delete').on('click', function (e) {
	            let $this = jquery(this);
	            let route = $this.attr('data-type') === 'bookmark' ? '/save-bookmark' : '/like';

	            jquery.post(route, { action: 'destroy', objectID: $this.attr('data-object-id'), objectType: $this.attr('data-object-type') }).done(function (data) {
	               if (data.status === 'destroyed' || data.status === 'unliked')
	                    $this.closest('[class*="-sheet"]').remove();
	               else if (data.status === 'error')
	                    console.log(data.message);
	            });
	        });

	        jquery('button.edit').on('click', function (e) {
	            let $this = jquery(this);
	            $this.parent().hide();
	            $this.parent().siblings('[id*="edit"]').show();
	        });

	        jquery('button.save').on('click', function (e) {
	            let $this = jquery(this);
	            let attributes = {};

	            $this.siblings('input').each(function () {
	                attributes[$(this).attr('id')] = $(this).val().trim();
	            });

	            jquery.post('/profile', attributes).done(function (data) {
	                if (data.status === 'saved') {
	                    $this.parent().hide();
	                    let newValue = '';

	                    $.each(attributes, function (key, value) {
	                        newValue += value + ' ';
	                    });

	                    $this.parent().siblings('[id*="display-"]').show().children('h1, span').text(newValue.trim());

	                    if (attributes.firstname)
	                        jquery('#account-toggle').text(attributes.firstname);
	                }
	                else if (data.status === 'error')
	                    console.log(data.message);
	            });
	        });

	        jquery('button.cancel').on('click', function (e) {
	            let $this = jquery(this);
	            $this.parent().hide();
	            $this.parent().siblings('[id*="display-"]').show();
	        });
	    });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }
]);
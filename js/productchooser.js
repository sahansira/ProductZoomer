/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @sahanhaz
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "productchooser",
        defaults = {

        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init(element);
    }

    Plugin.prototype = {

        init: function(element) {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            var _block = $(element);
            var mainImage = _block.find('.main-image'),
                zoomerSize = {width:120, height:150},
                offset	= { left: mainImage.offset().left, top: mainImage.offset().top },
                mouseX,
                mouseY;
            _block.find(".sub-image-wrapper .sub-image").click( function(e) {
                var subImgWrapper = $(this).parent().parent();
                subImgWrapper.find(".sub-image").removeClass('active');
                $(this).addClass('active');
                mainImage.find('img').fadeOut().hide();
                var subImage = $(this).find('img').attr('src');
                mainImage.find('img').attr('src',subImage);
                mainImage.find('img').fadeIn();
            });
            mainImage.mousemove( function(e) {
                mouseX = e.pageX;
                mouseY = e.pageY;
                var left = mouseX-offset.left,
                    top = mouseY-offset.top;
                Plugin.prototype.appendZoomer(_block);
                Plugin.prototype.showZoomer(_block , zoomerSize , left , top);
            }).mouseleave( function() {
                _block.find('.zoom-block').remove();
                _block.find('.zoomer').hide();
            });
            mainImage.find('.zoomer').click( function() {
                $('body').toggleClass('active-popup');
                setTimeout(function(){
                  Plugin.prototype.scrollZoome(_block);
                }, 500);
                var popupSilder = $('.zoom-popup').find('.popupSilder');
                console.log(popupSilder.find('.active').offset().top);
                popupSilder.css('top',-Math.abs(popupSilder.find('.active').offset().top)+44);
            });

            // var lastScrollTop =0;
            // $(window).scroll(function (event) {
            //     var st = $(this).scrollTop() * 0.001;
     	// 	    if(st >= lastScrollTop) {
            //
      // 		    }
     	// 	    else {
            //
     	// 	    }
      // 		    lastScrollTop = st;
    	    // });
        },
        appendZoomer: function(_block) {
            _block.find('.zoom-block').remove();
            $('body').find('.zoom-popup').remove();
            var mainImage = _block.find('.main-image img').attr('src');
            _block.append('<div class="zoom-block"></div>');
            _block.find('.zoom-block').css('background-image','url('+mainImage+')');
            Plugin.prototype.appendImageSlider(_block);
        },
        appendImageSlider: function(_block) {
            console.log('appendImageSlider');
            var imageArray = Plugin.prototype.imageArray(_block);
            $('body').append('<div class="zoom-popup"><div class="popup-image-wrapper"><div class="popupSilder">'+imageArray+'</div><div class="close-button"><a><span></span></a></div></div></div>');
        },
        appendImagecontSlider: function(_block) {
            console.log('appendImageSlider');
            var imageArray = Plugin.prototype.imageArray(_block);
            $('.zoom-popup .popupSilder').append(imageArray);
        },
        showZoomer: function(_block , zoomerSize , left , top) {
            _block.find('.zoom-block').css({
                backgroundPosition	: '-'+(1.3*left)+'px -'+(1.3*top)+'px'
            }).fadeIn('slow');
            if(((left > 60) && (left < 373)) && (top > 75) && (top < 505)) {
                _block.find('.zoomer').css({
                    'top':top - zoomerSize.height/2,
                    'left':left - zoomerSize.width/2
                }).fadeIn('slow');
            }
        },
        scrollZoome: function(_block) {
            $('.zoom-popup .close-button').click( function() {
                $('body').toggleClass('active-popup');
            });
            var lastScrollTop =0;
            var popupSilderTop = 10;
            var currentSilderTop = 0;
            var photoMoveCount = 0;
            var imageCount = 0;
            $(window).scroll(function (event) {
                var st = $(this).scrollTop();
                var modSt = st / 100;
                console.log('sr '+st);
                console.log('mod '+modSt % 1);
     		    if((st >= lastScrollTop) && (modSt % 1 == 0)) {
                    $('.zoom-popup .popupSilder img').each (function (){
                        imageCount++;
                    });
                    $( ".popupSilder" ).animate({
                        top: popupSilderTop - 927 - 10
                      }, 500 );
                    currentSilderTop = popupSilderTop - 927 - 10;
                    popupSilderTop = currentSilderTop;
                    photoMoveCount++;
                    //$(window).off('scroll');

                    if(imageCount - 2 <= photoMoveCount - 2) {
                        console.log('triggerd !');
                        Plugin.prototype.appendImagecontSlider(_block);
                    }
      		    }
     		    else if((st <= lastScrollTop) && (modSt % 1 == -0)) {
                    $('.zoom-popup .popupSilder img').each (function (){
                        imageCount++;
                    });
                    $( ".popupSilder" ).animate({
                        top: popupSilderTop + 927 + 10
                    }, 500 );
                    currentSilderTop = popupSilderTop + 927 + 10;
                    popupSilderTop = currentSilderTop;
                    photoMoveCount--;
     		    }
      		    lastScrollTop = st;
    	    });
        },
        imageArray: function(_block) {
            var subImageBlock = _block.find('.sub-image-wrapper ul');
            var imageArray = '';
            subImageBlock.find('.sub-image').each(function(){
                if($(this).hasClass('active')){
                    imageArray += '<img class = "active" src="'+$(this).find('img').attr('src')+'" />';
                }
                else {
                    imageArray += '<img src="'+$(this).find('img').attr('src')+'" />';
                }
            });
            return imageArray;
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );

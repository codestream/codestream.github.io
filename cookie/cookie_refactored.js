'use strict';

var cookie = (function($){
    var DAYS = 0.05;
    var HOURS = 24;
    var SECONDS = 60;
    var MILLIS = 1000;
    var MINUTES = 60;
    var today = new Date();
    var expiry = new Date(today.getTime() + DAYS * HOURS * MINUTES * SECONDS * MILLIS);
    var MAX_COOKIE_LENGTH = 100;
    var COOKIE_NAME = "links";

    return {
        getCookieName: function(name){
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },

        setCookieValue: function(){
            var self = this;
            if(typeof window.jQuery === 'function'){
                var visitedLinks = [];
                $('a').one('mouseenter', function(){
                    if($(this).data('clicked', false)){
                        visitedLinks.push({
                            url: $(this).attr('href')
                        });
                    }
                    document.cookie = COOKIE_NAME + "=" + JSON.stringify(visitedLinks) + "; expires=" + expiry.toGMTString();
                    if(self.getCookieName(COOKIE_NAME).length > MAX_COOKIE_LENGTH){
                        var newLinks = [];
                        $.each(visitedLinks, function(i, elem){
                            if($.inArray(elem, newLinks) === -1){
                                newLinks.push(elem);
                            }
                        });
                        document.cookie = "links"+Math.random() + "=" + JSON.stringify(newLinks) + "; expires=" + expiry.toGMTString();
                    }
                });
            }
        }
    };
}(jQuery));

cookie.setCookieValue();
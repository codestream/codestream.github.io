'use strict';

(function(){
    var queue = [];

    var bind = function(obj, event_name, handler) {
        var handler_wrapper = function(event) {
            event = event || window.event;
            if (!event.target && event.srcElement) {
                event.target = event.srcElement;
            }
            return handler.call(obj, event);
        };

        if (obj.addEventListener) {
            obj.addEventListener(event_name, handler_wrapper, false);
        } else if (obj.attachEvent) {
            obj.attachEvent('on' + event_name, handler_wrapper);
        }
        return handler_wrapper;
    };

    var unbind = function(obj, event_name, handler_wrapper) {
        if (obj.removeEventListener) {
            obj.removeEventListener(event_name, handler_wrapper, false);
        } else if (obj.detachEvent) {
            obj.detachEvent('on' + event_name, handler_wrapper);
        }
    };

    var getElementCoordinates = function(elem) {
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docElem = document.documentElement;

        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return {
            top: Math.round(top),
            left: Math.round(left)
        };
    };

    var getAjaxRequest = function(){
        var request;
        if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        return request;
    };

    var currentUrl = document.querySelector('[rel="prev"]').href;

    var ajaxRequest = getAjaxRequest();
    ajaxRequest.open('GET', currentUrl, true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState === 4){
            if(ajaxRequest.status === 200){
                var element = document.createElement("body");
                element.innerHTML = ajaxRequest.responseText.match(/<body>[\s\S]*<\/body>/gim)[0];
            }
        }
    };

    ajaxRequest.send(null);
}());

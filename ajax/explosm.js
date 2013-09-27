'use strict';

var queue = (function(){

    var imageNode;
    var imageQueue = [];
    return {
        addImage: function(obj){
            return imageQueue.push(obj);
        },

        poll: function(){
            return imageQueue.shift();
        },

        queueCapacity: function(){
            return imageQueue.length;
        }
    }
}());


(function(){
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

    var getElementCoordinates = function(elem){
        var clientRectangle = elem.getBoundingClientRect();

        var body = document.body;
        var docElem = document.documentElement;

        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        var top = clientRectangle.top + scrollTop - clientTop;
        var left = clientRectangle.left + scrollLeft - clientLeft;

        return {
            top: Math.round(top),
            left: Math.round(left)
        };
    };

    var closest = (function() {
        return function(node, callback) {
            var nextParent = node;

            while (nextParent && (!callback(nextParent))) {
                nextParent = nextParent.parentNode;
            }
            return nextParent;
        }
    })();


    var getAjaxRequest = function(){
        var request;

        if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        return request;
    };

    console.log(queue.queueCapacity().length);
    var ajaxRequest = getAjaxRequest();
    var url = document.querySelector('[rel="prev"]').href;
    ajaxRequest.open('get', url, true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest === 4){
            if(ajaxRequest === 200){
                var body = document.createElement('body');
                body.innerHTML = ajaxRequest.responseText.match(/<body>[\s\S]*<\/body>/gim)[0];
                var images = body.getElementsByTagName("img");
                for(var image in images){
                    if(images.hasOwnProperty(image)){
                        var comicsUrl = images[image].src;
                        var imageSrc = comicsUrl.match(/\bComics\b/);
                        for(var input in imageSrc){
                            if(imageSrc.hasOwnProperty(input)){
                                var source = imageSrc.input;
                            }
                        }
                    }
                }

                queue.addImage(source);
            }
        }
    };

    ajaxRequest.send(null);
})();

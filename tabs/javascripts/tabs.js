'use strict';

window.onload = function(){

    function bind(obj, event_name, handler) {
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
    }

    function hasClass(node, className) {
        return node.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)', "g"));
    }

    function addClass(node, className) {
        if (hasClass(node, className) == null) {
            var classNode = node.className;
            className = ' ' + className;
            node.className = classNode + className;
        }
    }

    function getEventTarget(event) {
        event = event || window.event;
        return event.target || event.srcElement;
    }

    function removeClass(node, className) {
        if (node !== undefined && className !== undefined) {
            var cn = node.className;
            var rxp = new RegExp('(\\s|^)' + className + '(\\s|$)', "g");
            cn = cn.replace(rxp, " ");
            node.className = cn;
        }
    }

    var tabBuilder = (function () {
        var tabs = document.querySelectorAll(".tabs > li");
        var tabContent = document.querySelectorAll(".content > div");

        return {
            init: function (pos) {
                addClass(tabs[pos], "enabled");
                for (var i = 0; i < tabs.length; i++) {
                    if (i !== pos) {
                        addClass(tabContent[i], "disabled");
                    }
                }
            },

            onTabClick: function () {
                bind(document, 'mouseover', function(event){
                    for (var i = 0; i < tabs.length; i++) {
                        var target = getEventTarget(event);
                        if (target.nodeName === "LI") {
                            if (hasClass(tabs[i], "enabled") && tabs[i] !== target) {
                                removeClass(tabs[i], "enabled");
                                addClass(tabContent[i], "disabled");
                            }

                            if (tabs[i] === target) {
                                addClass(tabs[i], "enabled");
                                removeClass(tabContent[i], "disabled");
                                addClass(tabContent[i], "text");
                            }
                        }
                    }
                });
            }
        }
    }());

    tabBuilder.init(0);
    tabBuilder.onTabClick();
};
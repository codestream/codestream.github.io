window.onload = function(){
    'use strict';

    /**
     * Returns an array with full image source
     */
    var bigImages = [
        "images/full/img/303.png",
        "images/full/307.png",
        "images/full/313.png",
        "images/full/300.png",
        "images/full/301.png"
    ];

    /**
     * Compatible with ie, because of some versions of ie haven't got event.target
     * @param event click or mouseover event or something else event
     */
    var getEventTarget = function(event){
        event = event || window.event;
        return event.target || event.srcElement;
    };

    /**
     * Check if node has class name
     * @param node DOM node
     * @param className node class name
     */
    var hasClass = function(node, className){
        return node.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)', "g"));
    };

    /**
     * Add class to node if class doesn't exist
     * @param node DOM node
     * @param className node class name
     */
    var addClass = function(node, className){
        if (hasClass(node, className) == null) {
            var classNode = node.className;
            className = ' ' + className;
            node.className = classNode + className;
        }
    };

    /**
     * Remove class or all classes from node
     * @param node DOM node
     * @param className node class name
     */
    var removeClass = function(node, className){
        if (node !== undefined && className !== undefined) {
            var cn = node.className;
            var rxp = new RegExp('(\\s|^)' + className + '(\\s|$)', "g");
            cn = cn.replace(rxp, " ");
            node.className = cn;
        }
    };

    function Gallery(domNode){
        if(domNode === undefined){
            throw new Error("DOM node undefined");
        }
    }

    Gallery.prototype = {


    };
};

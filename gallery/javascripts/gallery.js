window.onload = function(){
    'use strict';

    /**
     * Returns an array with full image source
     */
    var bigImages = [
        "images/full/303.png",
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

    function Gallery(){
        this.currentPreview = "current";
        this.selectedElement = document.querySelectorAll("li > .preview");
        this.fullImage = document.getElementById("fullImage");
        this.slideBack = {};
    }

    Gallery.prototype = {

        slideGallery : function(){
            for (var i = 0; i < this.selectedElement.length; i += 1) {
                if (hasClass(this.selectedElement[i], this.currentPreview)) {
                    removeClass(this.selectedElement[i], this.currentPreview);
                    addClass(this.selectedElement[i += 1], this.currentPreview);
                    this.fullImage.src = bigImages[i];
                    if (i == this.selectedElement.length - 1) {
                        clearInterval(interval);
                        interval = setInterval(function(){
                            g.slideBackward();
                        },5000);
                    }
                }
            }
        },

        slideBackward : function(){
            for(var i = 0; i < this.selectedElement.length; i++){
                if(hasClass(this.selectedElement[i], this.currentPreview)){
                    removeClass(this.selectedElement[i], this.currentPreview);
                    addClass(this.selectedElement[i -= 1], this.currentPreview);
                    this.fullImage.src = bigImages[i];
                    if(i == 0){
                        clearInterval(/*this.slideBack*/interval);
                        interval = setInterval(function(){
                            g.slideGallery()
                        },5000);
                    }
                }
            }
        },

        galleryItemClick : function(){
            var gallery = new Gallery();
            var listener = function(event){
                for(var i = 0; i < gallery.selectedElement.length; i++){
                    var target = getEventTarget(event);
                    if(target === gallery.selectedElement[i]){
                        clearInterval(interval/* | this.slideBack*/);
                    }
                }
            };

            document.addEventListener("click", listener, false);
        },

        scrollFromKeyboard : function(){
            var gallery = new Gallery();
            var count = 0;
            var keyDownListener = function(event){
                count++;
                if(event.keyCode == 39){
                    clearInterval(interval);
                    gallery.slideGallery();
                    //todo fix typeerror
                }

                if(event.keyCode == 37){
                    clearInterval(interval);
                    gallery.slideBackward();
                    //todo fix typerrror
                }
            };

            document.addEventListener('keydown', keyDownListener, false);
        }
    };

    var g = new Gallery();

    var interval = window.setInterval(function () {
        g.slideGallery();
    }, 5000);

    g.galleryItemClick();

    g.scrollFromKeyboard();
};

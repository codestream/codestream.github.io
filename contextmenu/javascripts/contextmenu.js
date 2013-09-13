window.onload = function(){
    'use strict';

    var preventDefault = function(event){
        if(event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };

    var removeClass = function(node, className) {
        if (node !== undefined && className !== undefined) {
            var cn = node.className;
            var rxp = new RegExp('(\\s|^)' + className + '(\\s|$)', "g");
            cn = cn.replace(rxp, " ");
            node.className = cn;
        }
    };

    var hasClass = function(node, className) {
        return node.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)', "g"));
    };

    var addClass = function(node, className) {
        if(hasClass(node,className) == null){
            var classNode = node.className;
            className = ' ' + className;
            node.className = classNode + className;
        }
    };

    var getEventTarget = function(event){
        event = event || window.event;
        return event.target || event.srcElement;
    };

    function ContextMenu(){
    }

    ContextMenu.prototype = {
        buildMenu : function(elementsCount){
            var root = document.createElement("ul");
            root.setAttribute("id", "menu");
            root.setAttribute("class", "menu-context");
            for(var i = 0; i < elementsCount; i++){
                var listElement = document.createElement("li");
                listElement.innerHTML = "Item " + i;
                root.appendChild(listElement);
            }

            var fragment = document.createDocumentFragment();
            fragment.appendChild(root);
            document.body.appendChild(fragment);
        },

        addPointer : function(){
            var listElements = document.getElementsByTagName("li");
            for(var i = 0; i < listElements.length; i++){
                if(listElements[i] === listElements[listElements.length-1]){
                    addClass(listElements[i], "pointer")
                }
            }
        },

        addSubMenu: function(){
            var listElements = document.getElementsByTagName("li");
            var ulElement = document.createElement("ul");
            ulElement.setAttribute("class", "menu-context shift");
            ulElement.setAttribute("id", "child-menu");
            ulElement.style.display = "block";
            var fragment = document.createDocumentFragment();
            for(var i = 0; i < listElements.length; i++){
                var liElement = document.createElement("li");
                liElement.innerHTML = "Sub item " + i;
                fragment.appendChild(liElement);
                if(hasClass(listElements[i], "pointer")){
                    ulElement.appendChild(fragment);
                    listElements[i].appendChild(ulElement);
                }
            }

            var list = document.getElementsByTagName("li");
            for(var j = 0; j < list.length; j++){
                if(listElements[j] === listElements[listElements.length-1]){
                    addClass(listElements[j], "pointer")
                }
            }
        },

        handleRightClick : function(){
            var menu = document.getElementById("menu");
            menu.style.display = "none";
            var listener = function(event){
                preventDefault(event);
                menu.style.display = (menu.style.display === "none") ? "block" : "none";
                menu.style.top = event.clientY + "px";
                menu.style.left = event.clientX + "px";
            };

            if(document.addEventListener){
                document.addEventListener('contextmenu', listener, false);
            } else if(document.attachEvent){
                document.attachEvent('oncontextmenu', listener);
            }
        },

        onPointerHover : function(){
            var contextMenu = new ContextMenu();
            var listener = function(event){
                var target = getEventTarget(event);
                var elements = document.getElementsByClassName("pointer");
                for(var i = 0; i < elements.length; i++){
                    if(elements[i] === target && elements[i].childNodes.length === 1){
                       contextMenu.addSubMenu();
                    }
                }
            };

            if(document.addEventListener){
                //mouseenter есть в jquery, в plain js из коробки нету
                //срабатывает только если у element[i] длина childNodes равна 1
               document.addEventListener('mouseover', listener, false);
            } else if(document.attachEvent){
                document.attachEvent('onmouseover', listener);
            }
        }
    };

    var ctx = new ContextMenu();
    ctx.buildMenu(6);
    ctx.addPointer();
    ctx.handleRightClick();
    ctx.onPointerHover();
};

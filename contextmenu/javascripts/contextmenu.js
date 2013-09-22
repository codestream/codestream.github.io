window.onload = function () {
    'use strict';

    var menuData = [
        {
            name: "Open file"
        },
        {
            name: "Set encoding",
            submenu: [
                {
                    name: "UTF-8"
                },
                {
                    name: "CP-1251"
                }
            ]
        },
        {
            name: "Set file type",
            submenu: [
                {
                    name: "Programming languages",
                    submenu: [
                        {
                            name: "C"
                        },
                        {
                            name: "C++"
                        },
                        {
                            name: "C#"
                        },
                        {
                            name: "Java"
                        },
                        {
                            name: "Haskell"
                        },
                        {
                            name: "Objective-C"
                        },
                        {
                            name: "Scala"
                        }
                    ]
                },
                {
                    name: "Scripting languages",
                    submenu:[
                        {
                            name: "JavaScript"
                        },
                        {
                            name: "Lua"
                        },
                        {
                            name: "Ruby"
                        },
                        {
                            name: "Perl"
                        },
                        {
                            name: "Python"
                        },
                        {
                            name: "PHP"
                        }
                    ]
                },
                {
                    name: "Markup languages",
                    submenu:[
                        {
                            name: "CSS"
                        },
                        {
                            name: "XML"
                        },
                        {
                            name: "Markdown"
                        },
                        {
                            name: "HTML"
                        }
                    ]
                }
            ]
        }
    ];

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, scope) {
            for (var i = 0, len = this.length; i < len; ++i) {
                fn.call(scope, this[i], i, this);
            }
        }
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

    function removeClass(node, className) {
        if (node !== undefined && className !== undefined) {
            var cn = node.className;
            var rxp = new RegExp('(\\s|^)' + className + '(\\s|$)', "g");
            cn = cn.replace(rxp, " ");
            node.className = cn;
        }
    }


    function ContextMenu() {
    }

    ContextMenu.prototype = {

        buildContextMenu: function (data) {
            if (isArray(data)) {
                var listElement, childRootElement, childListElement;
                var fragment = document.createDocumentFragment();
                var rootElement = document.createElement("ul");
                var subItems = document.createElement("ul");
                rootElement.setAttribute("class", "menu-context");
                fragment.appendChild(rootElement);
                (function () {
                    data.forEach(function (element) {
                        childRootElement = document.createElement("ul");
                        if (element.name) {
                            listElement = document.createElement("li");
                            listElement.innerHTML = element.name;
                            rootElement.appendChild(listElement);
                        }

                        if(element.submenu){
                            element.submenu.forEach(function(el){
                                listElement.className = "pointer";
                                childListElement = document.createElement("li");
                                if(hasClass(listElement, "pointer")){
                                    childListElement.innerHTML = el.name;
                                }

                                childRootElement.appendChild(childListElement);
                                listElement.appendChild(childRootElement);

                                if(el.submenu){
                                    el.submenu.forEach(function(elem){
                                        childListElement.className = "pointer";
                                        if(hasClass(childListElement, "pointer")){

                                        }
                                    });
                                }
                            });
                        }
                    });
                }());
                document.body.appendChild(fragment);
            } else {
                throw Error("Data must be an array");
            }
        }
    };

    var contextMenu = new ContextMenu();
    contextMenu.buildContextMenu(menuData);
};
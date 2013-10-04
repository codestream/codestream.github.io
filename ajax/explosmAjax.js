/**
 * Минусы реализации
 *
 * Если медленный инет, то при достижении конца очереди, видим блок рекламы и примерно через секунд
 * 5-6 подружаются комиксы. Выход из данной проблемы на мой взгляд это убирать блок с рекламой
 * сразу при запуске скрипта
 *
 */
'use strict';

window.onerror = function(error){
    console.log(error);
};

/**
 * Базовая реализации очереди на js
 * Методы очереди:
 * 1)add - добавляем в очередь элемент
 * 2)element - берем элемент с головы очереди
 * 3)queueSize - возвращает размер очереди
 */
var imageQueue = (function () {
    var queue = [];
    return {
        //добавляем элемент в очередь
        // элемент это полученная при помощи
        // AJAX картинка комикс
        add: function (element) {
            return queue.push(element);
        },

        //берем элемент с головы очереди
        element: function () {
            return queue.shift();
        },

        //длина очереди
        queueSize: function () {
            return queue.length;
        }
    }
}());

(function(){
    var closest = (function() {
        return function(node, callback) {
            var nextParent = node;

            while (nextParent && (!callback(nextParent))) {
                nextParent = nextParent.parentNode;
            }
            return nextParent;
        }
    })();

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

    function unbind(obj, event_name, handler_wrapper) {
        if (obj.removeEventListener) {
            obj.removeEventListener(event_name, handler_wrapper, false);
        } else if (obj.detachEvent) {
            obj.detachEvent('on' + event_name, handler_wrapper);
        }
    }

    function getElementCoordinates(elem) {
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
    }

    function getAjaxRequest(){
        var request;
        if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        return request;
    }

    var url = document.querySelector('[rel="prev"]').href;

    function sendAjaxRequest(){
        var ajaxRequest = getAjaxRequest();
        ajaxRequest.open('GET', url, true);
        //если размер очереди с картинками меньше пяти отправляем
        // аякс запрос. При 200 ОК проверяю наличие комикса в ответе,
        // если комикс есть, то ложу его в очередь, получаю урл
        // предыдущего комикса и рекурсивно вызываю функцию отправки ajax запроса
        if(imageQueue.queueSize() < 5){
            ajaxRequest.onreadystatechange = function(){
                if(ajaxRequest.readyState === 4){
                    if(ajaxRequest.status === 200){
                        var element = document.createElement("body");
                        element.innerHTML = ajaxRequest.responseText.match(/<body>[\s\S]*<\/body>/gim)[0];
                        //если комикс на странице есть
                        if(element.querySelector('[alt="Cyanide and Happiness, a daily webcomic"]')){
                            //так как у комиксов нету id, я решил выбирать по alt
                            var img = element.querySelector('[alt="Cyanide and Happiness, a daily webcomic"]');
                            //добавляю картинку в очередь
                            imageQueue.add(img);
                            //урл для загрузки следующей картинки
                            url = element.querySelector('[rel="prev"]').href;
                            sendAjaxRequest();
                        } else {
                            throw new Error("Comics not found");
                        }
                    }
                }
            };

            ajaxRequest.send(null);
        } else {
            //если в очереди больше пяти картинок вызываю функцию загрузки изображений
            loadImages();
        }
    }

    sendAjaxRequest();

    function loadImages(){
        //хендлер скроллинга страницы
        var scrollHandler;
        //высота окна браузера
        var windowHeight;
        //контейнер для подгружаемых комиксов
        var comicsContainer;
        //булевая переменная которая проверяет достигли ли
        // низа или верха окна
        var isScrolledToTop;
        var documentElement = document.documentElement;

        var scrollListener = function() {
            isScrolledToTop = window.pageYOffset || documentElement.scrollTop;
            var images = document.querySelectorAll('[alt="Cyanide and Happiness, a daily webcomic"]');
            var lastImage = images[images.length - 1];
            var topImage = getElementCoordinates(lastImage).top;
            windowHeight = documentElement.clientHeight;

            if ((isScrolledToTop + windowHeight) > topImage) {
                appendImage(addImage());
            }
        };

        scrollHandler = bind(window, 'scroll', scrollListener);

        var appendImage = function(img){
            var firstImage = document.querySelector('[alt="Cyanide and Happiness, a daily webcomic"]');
            //нужна картинка которая имеет атрибут align=center
            comicsContainer = closest(firstImage, function(node) {
                return node.hasAttribute('align','center');
            });

            comicsContainer.appendChild(img);
        };

        var addImage = function(){
            comicsContainer = imageQueue.element();
            unbind(window, 'scroll', scrollHandler);
            sendAjaxRequest();
            return comicsContainer;
        }
    }
}());


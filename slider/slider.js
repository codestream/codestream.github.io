/**
 * Crossbrowser prevent default
 * @param event
 */
var preventDefault = function (event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        //for ie
        event.returnValue = false;
    }
};

//TODO: Создать полноценный Observer
function Observer() {
    this.listeners = [];
}

Observer.prototype = {
    addListener: function (object) {
        this.listeners.push(object);
    },

    trigger: function (event) {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](event);
        }
    }
};

function unbind(obj, eventName, handlerWrapper) {
    if (obj.removeEventListener) {
        obj.removeEventListener(eventName, handlerWrapper, false);
    } else if (obj.detachEvent) {
        obj.detachEvent('on' + eventName, handlerWrapper);
    }
}

function bind(obj, eventName, handler) {
    var handlerWrapper = function (event) {
        event = event || window.event;
        if (!event.target && event.srcElement) {
            event.target = event.srcElement;
        }
        return handler.call(obj, event);
    };

    if (obj.addEventListener) {
        obj.addEventListener(eventName, handlerWrapper, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + eventName, handlerWrapper);
    }
    return handlerWrapper;
}

function Slider(domNode) {
    this.slider = domNode;
    this.draggableElement = domNode.querySelector('.draggable-element');
    this.onSlide = new Observer();
    this.onChangeValue = new Observer();
    this.onMouseDown();
}

//получаю координаты слайдера
Slider.prototype.getSliderCoordinates = function (elem) {
    var clientRect = elem.getBoundingClientRect();

    var body = document.body;
    var element = document.documentElement;

    var scrollTop = window.pageYOffset || element.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || element.scrollLeft || body.scrollLeft;

    var clientTop = element.clientTop || body.clientTop || 0;
    var clientLeft = element.clientLeft || body.clientLeft || 0;

    var top = clientRect.top + scrollTop - clientTop;
    var left = clientRect.left + scrollLeft - clientLeft;

    return {
        top: Math.round(top),
        left: Math.round(left)
    };
};

//возможно стоило не использовать this.mouseMoveListener, а cделать var mouseMoveListener
//но так как mouseMoveListener в дальшейшем будет использоваться readonly, я принял решение
// использовать this.mouseMoveListener вместо var mouseMoveListener
//т.е он будет "protected" доступен только наследникам объекта Slider
Slider.prototype.onMouseMove = function (shiftX, sliderCoordinates, context) {
    this.mouseMoveListener = bind(document, 'mousemove', function (event) {
        var left = event.pageX - shiftX - sliderCoordinates.left;

        if (left < 0) {
            left = 0;
        }

        var right = context.slider.offsetWidth - context.draggableElement.offsetWidth;
        if (left > right) {
            left = right;
        }
        context.draggableElement.style.left = left + 'px';

        context.slideValue = Math.round(left / right * 100);
        context.onSlide.trigger(context.slideValue);
    });
};

//то же что и в случае c onMouseMove
Slider.prototype.onMouseUp = function(context) {
    this.mouseUpListener = bind(document, 'mouseup', function () {
        //по изменению value дергаю метод trigger из наблюдателя
        context.onChangeValue.trigger(context.slideValue);
        unbind(document, 'mousemove', context.mouseMoveListener);
        unbind(document, 'mouseup', context.mouseUpListener);
    });
};

Slider.prototype.onMouseDown = function () {
    var context = this;
    //слушатель событий мыши
    var mouseEventListener = function (event) {
        preventDefault(event);
        var draggableElemCoordinates = context.getSliderCoordinates(context.draggableElement);
        var sliderCoordinates = context.getSliderCoordinates(context.slider);
        var shiftX = event.pageX - draggableElemCoordinates.left;

        //вызовы функций onMouseMove и onMouseDown
        context.onMouseMove(shiftX, sliderCoordinates, context);

        context.onMouseUp(context);
    };

    bind(document, 'mousedown', mouseEventListener);
};

Slider.prototype.on = function (object) {
    this.onSlide.addListener(object.slide);
    this.onChangeValue.addListener(object.change);
};

var slider = new Slider(document.querySelector('.slider'));
slider.on({
    slide: function (value) {
        document.getElementById("value").innerHTML = "Current value :" + value;
    },

    change: function (value) {
        document.getElementById("change").innerHTML = "Change :" + value;
    }
});
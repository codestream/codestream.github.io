'use strict';

var mediator = (function () {
    var subscriptions = [];
    var index;

    return {
        trigger: function (eventName, data) {
            if (subscriptions.hasOwnProperty(eventName)) {
                for (var i = 0; i < subscriptions[eventName].length; i += 1) {
                    subscriptions[eventName][i].call(window, data);
                }
            }
        },

        subscribe: function (eventName, handler) {
            if (subscriptions.hasOwnProperty(eventName)) {
                subscriptions[eventName].push(handler);
            } else {
                subscriptions[eventName] = [handler];
            }
        },


        unsubscribe: function (eventName, handler) {
            //если хендлер неопределен то удаляем все подписки
            if (handler === undefined) {
                //удаляем все хендлеры
                delete subscriptions[eventName];
                console.log("All event handlers are unsubscribed");
            } else {
                //если хендлер таки есть
                if (subscriptions.hasOwnProperty(eventName)) {
                    index = subscriptions[eventName].indexOf(handler);
                    //если индекс первого вхождения значения в массиве -1
                    if (index === -1) {
                        return;
                    } else {
                        for(var i = subscriptions[eventName].length - 1; i >= 0; i--){
                            if(subscriptions[eventName][i] === handler){
                                subscriptions[eventName].splice(i, 1);
                            }
                        }
                    }
                }
            }
        }
    };
}());

function first() {
    console.log('I am first')
}
function second() {
    console.log('I am second')
}
function third() {
    console.log('I am third')
}

mediator.trigger('complete');
mediator.subscribe('complete', first);
mediator.subscribe('complete', third);
mediator.subscribe('complete', first);
mediator.subscribe('complete', first);
mediator.subscribe('complete', second);
mediator.subscribe('complete', first);
mediator.subscribe('complete', first);
mediator.subscribe('complete', second);
mediator.subscribe('complete', third);
mediator.subscribe('complete', second);
mediator.subscribe('complete', second);
mediator.subscribe('complete', second);
mediator.subscribe('complete', third);
mediator.subscribe('complete', third);
mediator.subscribe('complete', third);


mediator.trigger('complete');
console.log("========================");
mediator.unsubscribe('complete', first);
mediator.trigger('complete');

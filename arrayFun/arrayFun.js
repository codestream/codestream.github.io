'use strict';

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function buildQueryString(object) {

    var queryString = "";

    for (var key in object) {
        var value = object[key];
        queryString += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
    }

    if (queryString.length > 0) {
        queryString = queryString.substring(0, queryString.length - 1);
    } else if (queryString.length === 0) {
        queryString = "''";
    }

    return queryString;
}

console.log(buildQueryString({num: 10, test: true, user: 'admin'}));

function flatten(object) {
    if (isArray(object)) {
        var element = 0;
        var elements = [];
        for (var i = 0; i < object.length; i++) {
            if (isArray(object[i])) {
                var data = object[i];
                for (var j = 0; j < data.length; j++) {
                    element = data[j];
                    elements.push(element);
                }
            }
        }
    }

    for (var k = 0; k < object.length; k++) {
        if (!isArray(object[k])) {
            elements.push(object[k]);
        }
    }

    return elements;
}

console.log(flatten([[1],1,1]));

function toMatrix(array, elements) {
    if (isArray(array)) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < array.length; i++) {
            if (i % elements === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(array[i]);
        }

        return matrix;
    }
}

console.log(toMatrix([1,2,3,4,5,6,7,8,9], 3));

function createObject(keys, values) {
    if (isArray(keys) && isArray(values)) {
        var jsonArray = [];
        if (keys.length > values.length) {
            var valueForSplice = keys[keys.length - 1];
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] === valueForSplice) {
                    keys.splice(i, 1);
                }
            }

            var value = values[0];
            jsonArray.push({name: value});
            var jsonString = JSON.stringify(jsonArray);
            return jsonString;

        } else if (keys.length < values.length) {
            var _value = values[keys.length - 1];
            jsonArray.push({name: _value});
            var jsonObject = JSON.stringify(jsonArray);
            return jsonObject;

        } else {
            var jsonVariable = {};
            for (var key = 0; key < keys.length; key++) {
                jsonVariable[keys[key]] = values[key];
            }

            var json = JSON.stringify(jsonVariable);

            return json;
        }
    }
}

console.log(createObject(['name', 'age'], ['Vasiliy', 45]));
console.log(createObject(['name', 'age'], ['Vasiliy']));
console.log(createObject(['name'], ['Vasiliy', 45]));
console.log(createObject([], []));

function contains(arrToCompare, arr) {
    if (isArray(arrToCompare) && isArray(arr)) {
        //проходим циклом по массиву элементы которого должны быть элементами первого массива
        for (var i = 0; i < arr.length; ++i) {
            //если элемент в первом массиве не найден возвращаем false
            if (arrToCompare.indexOf(arr[i]) === -1) {
                return false;
            }
        }
        return true;
    }
}

var closest = (function() {
    return function(node, callback) {
        var nextParent = node;

        while (nextParent && (!callback(nextParent))) {
            nextParent = nextParent.parentNode;
        }
        return nextParent;
    }
})();

console.log(contains([1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2]));
console.log(contains([1, 2, 3, 4, 5, 6, 7, 8, 9], []));
console.log(contains([1, 2, 3, 4, 5, 6, 7, 8, 9], [0]));
console.log(contains([], [0]));
console.log(contains([], []));
console.log(contains([1], [1]));
'use strict';

(function(callback){
    var currentPage = 1;
    var totalPages;
    var url = 'http://rozetka.com.ua/usb-flash-memory/c80045/';
    var products = [];

    var getAjaxRequest = function () {
        var request;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        return request;
    };

    /**
     * Функция для парсинга данных с страниц http://rozetka.com.ua/usb-flash-memory/c80045/
     * @param domNode откуда брать данные
     */
    var parseData = function(domNode){
        //берем селектор контейнера
        var containers = domNode.querySelectorAll('.gtile-i-wrap');
        //если длина контейнера не 0
        if(containers.length !== 0){
            //анонимная функция для парсинга данных и создания объекта с ними
            //для выдачи в консоль
            var parseContainerData = function(container){
                var uaPriceNode = container.querySelector('.g-price-uah');
                var usdPriceNode = container.querySelector('.g-price-usd');
                var productNameNode = container.querySelector('.gtile-i-title');
                var urlNode = container.querySelector('.gtile-i-title a');
                return {
                    parseUAPrices: function(){
                        return parseFloat(uaPriceNode.textContent.match(/\d+(.\d+)?/g)[0]).toFixed(2);
                    },

                    parseUSDPrices: function(){
                        return parseFloat(usdPriceNode.textContent.match(/\d+(.\d+)?/g)[0]).toFixed(2);
                    },

                    parseProductNames: function(){
                        return productNameNode.textContent.match(/\S+/g).join(' ');
                    },

                    parseProductURLS: function(){
                        return urlNode.href;
                    },

                    parseMemoryVolume: function(){
                        return productNameNode.textContent.match(/(?:\s)\d+(\s+)?GB(?:\s)/g)[0].replace(/\s/g, '');
                    },

                    buildProductData: function(){
                        var productObject = {};
                        productObject.ua_price = this.parseUAPrices();
                        productObject.usd_price = this.parseUSDPrices();
                        productObject.name = this.parseProductNames();
                        productObject.url = this.parseProductURLS();
                        productObject.memory = this.parseMemoryVolume();

                        return productObject;
                    }
                }
            };

            for(var i = 0; i < containers.length; i++){
                products.push(parseContainerData(containers[i]).buildProductData());
            }
        }

        return products;
    };

    var request = getAjaxRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var body = document.createElement('body');
                body.innerHTML = request.responseText.match(/<body>[\s\S]*<\/body>/gim)[0];
                parseData(body);
                var pager = body.querySelectorAll('.goods-pages-list li');
                totalPages = parseInt(pager[pager.length - 1].getAttribute('id').match(/\d+/g)[0]);
                loadAllGoods();
            }
        }
    };

    request.send(null);

    var loadAllGoods = function () {
        //если текущая страница меньше общего числа страниц
        if(currentPage < totalPages){
            currentPage += 1;
        } else {
            return;
        }

        var currentPageURL = url + 'page=' + currentPage + '/';
        request.open('GET', currentPageURL, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var body = document.createElement('body');
                    body.innerHTML = request.responseText.match(/<body>[\s\S]*<\/body>/g)[0];
                    parseData(body);
                    if(currentPage === totalPages){
                        callback(parseData(body));
                    }
                    /*parseData(body);*/
                    //если наша страница последняя страница
                    /*if (currentPage === totalPages) {
                        callback(products);
                    }*/
                    loadAllGoods();
                }
            }
        };

        request.send();
    };
})(showData);

function showData(data){
   console.log(data);
    console.log(data.length);
}
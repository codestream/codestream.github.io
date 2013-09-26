/***************************************************************************************************
 * Парсинг розетки версия 2.0
 * Пофикшено:
 * 1) Дубликаты товаров(проверял JSON.stringify(data) и поиском дубликатов в
 * JSON объекте)
 * 2) Парсинг теперь идет адекватно, т.е парсятся все страницы каталога товаров
 * с флешками
 * 3)Поправил регулярки, так как не на всех страницах розетки регулярки отрабатывают как и на первой
 * 4)Вместо JSON объекта использую массив
 * 5)Добавлены проверки:
 * - длина контейнера
 * - наличие нод
 * 6)Вместо document решил в body записывать респонс и парсить body, так как в случае с document
 * возможны дубликаты товаров
 *
 ****************************************************************************************************/

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
            var parseContainerData = function(container){
                var uaPriceNode = container.querySelector('.g-price-uah');
                var usdPriceNode = container.querySelector('.g-price-usd');
                var productNameNode = container.querySelector('.gtile-i-title');
                var urlNode = container.querySelector('.gtile-i-title a');
                var memoryNode = container.querySelectorAll('.gtile-short-detail li')[0];
                return {
                    parseUAPrices: function(){
                        if(uaPriceNode){
                            var uaPrice = parseFloat(uaPriceNode.innerHTML.match(/(\d+(.\d+)?)/g)[0]).toFixed(2);
                        } else {
                            uaPrice = 0;
                        }

                        return uaPrice;
                    },

                    parseUSDPrices: function(){
                        if(usdPriceNode){
                            var usdPrice = parseFloat(usdPriceNode.innerHTML.match(/(\d+(.\d+)?)/g)[0]).toFixed(2);
                        } else {
                            usdPrice = 0;
                        }

                        return usdPrice;
                    },

                    parseProductNames: function(){
                        if(productNameNode){
                            var productName = productNameNode.textContent.match(/\S+/g).join(' ');
                        }

                        return productName;
                    },

                    parseProductURLS: function(){
                        return urlNode.href;
                    },

                    parseMemoryVolume: function(){
                        if(memoryNode){
                            var memory = memoryNode.innerHTML.match(/\d+/g);
                            var convertToInt = parseInt(memory);
                        }

                        return convertToInt;
                    },

                    buildProductData: function(){
                        var productObject = {};
                        productObject.ua_price = parseFloat(this.parseUAPrices());
                        productObject.usd_price = parseFloat(this.parseUSDPrices());
                        productObject.name = this.parseProductNames();
                        productObject.url = this.parseProductURLS();
                        productObject.memory = this.parseMemoryVolume();

                        return productObject;
                    }
                }
            };
        }

        for(var i = 0; i < containers.length; i++){
            products.push(parseContainerData(containers[i]).buildProductData());
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
                loadAllProducts();
            }
        }
    };

    request.send(null);

    function loadAllProducts(){
        if(currentPage < totalPages){
            currentPage++;
        } else {
            return;
        }

        var currentUrl = url + 'page=' + currentPage + '/';
        request.open('get', currentUrl, true);
        request.onreadystatechange = function(){
            if(request.readyState === 4){
                if(request.status === 200){
                    var body = document.createElement('body');
                    body.innerHTML = request.responseText.match(/<body>[\s\S]*<\/body>/gim)[0];
                    parseData(body);
                    if(currentPage == totalPages){
                        callback(products);
                    }
                }
                loadAllProducts();
            }
        };
        request.send(null);
    }
})(showData);

function showData(data){
   console.log(data);
   console.log(data.length);
}
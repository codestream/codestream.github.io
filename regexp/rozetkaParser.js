'use strict';

var parser = (function(){
    var uaPrice = document.querySelectorAll('.g-price-uah');
    var usdPrice = document.querySelectorAll('.g-price-usd');
    var productName = document.querySelectorAll('.gtile-i-title');
    var url = document.querySelectorAll('.gtile-i-title > a');

    return {
        parseUAPrices: function(){
            var prices = [];
            for(var i = 0; i < uaPrice.length; i++){
                var price = parseFloat(uaPrice[i].textContent.match(/\d+(.\d+)?/g)[0]).toFixed(2);
                prices.push(price);
            }

            return prices;
        },

        parseUSDPrices: function(){
            var usdPrices = [];
            for(var i = 0; i < usdPrice.length; i++){
                var usd = parseFloat(usdPrice[i].textContent.match(/\d+(.\d+)?/g)[0]).toFixed(2);
                usdPrices.push(usd);
            }

            return usdPrices;
        },

        parseProductNames: function(){
            var names = [];
            for(var i = 0; i < productName.length; i++){
                var name = productName[i].textContent.match(/\S+/g).join(' ');
                names.push(name);
            }

            return names;
        },

        parseProductURL: function(){
            var urls = [];
            for(var i = 0; i < url.length; i++){
                var matchedURL = url[i].href;
                urls.push(matchedURL);
            }

            return urls;
        },

        parseProductMemory: function(){
            var memoryDetails = [];
            for(var i = 0; i < productName.length; i++){
                var findMemoryDetails = productName[i].textContent.match(/(?:\s)\d+(\s+)?GB(?:\s)/g)[0].replace(/\s/g,'');
                memoryDetails.push(findMemoryDetails);
            }

            return memoryDetails;
        },

        buildJSON: function(){
            var jsonArray = [];
            for(var i = 0; i < this.parseUAPrices().length; i++){
                var price = this.parseUAPrices()[i];
                var usdPrice = this.parseUSDPrices()[i];
                var productName = this.parseProductNames()[i];
                var url = this.parseProductURL()[i];
                var memory = this.parseProductMemory()[i];
                jsonArray.push({
                    products: {
                        product: {
                            uaPrice: parseFloat(price),
                            usdPrice: parseFloat(usdPrice),
                            productName: productName,
                            productURL: url,
                            memory: memory
                        }
                    }
                });
            }

            return jsonArray;
        }
    }
}());

parser.buildJSON();
'use strict';

$(document).ready(function(){
    var removeAd = function(){
        $("div[class^='banner']").each(function(){
            if(this.className.match(/[0-9]/)){
                $(this).remove();
            }
        })
    };

    removeAd();

    var removeHabraNavigator = function(){
        if($(".fast_navigator")){
            $(".fast_navigator").remove();
        }
    };

    removeHabraNavigator();

    var makeBlocks = function(){
        //находим элемент по классу live_broadcast
        var broadCast = $('.live_broadcast');
        //находим текст у детей селектора title
        var title = broadCast.find('.title').children().text();

        //создаем div и добавляем классы block и live_broadcast
        var qa = $("<div></div>").addClass('block').addClass('live_broadcast');
        //добавляем объект клонированого селектора title
        qa.append(broadCast.find('.title').clone(true));
        qa.find('.title').text(qa.find('.dotted.tab').eq(1).text());
        broadCast.find('.title').text(broadCast.find('.dotted.tab').eq(0).text());

        qa.append(broadCast.find('.qa_activity').show());

        broadCast.after(qa);
    };

    makeBlocks();

    var makeCollapsible = function(){
        $('.sidebar_right div .title').each(function() {
            //скрываем элементы указанные в селекторе
            $(this).next().hide();
        });


        $('#htmlblock_placeholder').hide();

        $('.sidebar_right div .title').click(function(event){
            $(this).next().slideToggle(1500,"swing");
            if($(this).has($('a'))){
                event.preventDefault();
            }
        });
    };

    makeCollapsible();

    var hideMiscellaneous = function(){
        $('.infopanel_wrapper').hide();
        $('.flag').hide();
        $('.content.html_format').hide();
        $('.published').hide();
    };

    hideMiscellaneous();
});
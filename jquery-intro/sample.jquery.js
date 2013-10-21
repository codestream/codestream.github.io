'use strict';

//Убрать блок рекламы, если есть (в правой колонке)
var removeAd = function () {
    $("div[class^='banner']").each(function () {
        if (this.className.match(/[0-9]/)) {
            $(this).remove();
        }
    })
};

removeAd();

//Убрать хабранавигатор (если есть)
var removeHabraNavigator = function () {
    if ($(".fast_navigator")) {
        $(".fast_navigator").remove();
    }
};

removeHabraNavigator();

//Разделить прямой эфир на 2 отдельных блока (посты, qa) (внутри есть переключалка).
// Блоки должны сохранить оригинальную стилистику
var makeBlocks = function () {
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

//Все блоки сделать collapsible
var makeCollapsible = function () {
    $('.sidebar_right div .title').each(function () {
        //скрываем элементы указанные в селекторе
        $(this).next().hide();
    });


    $('#htmlblock_placeholder').hide();

    $('.sidebar_right div .title').click(function (event) {
        $(this).next().slideToggle(1500, "swing");
        if ($(this).has($('a'))) {
            event.preventDefault();
        }
    });
};

makeCollapsible();

//Убрать рейтинги, описание, флаги. Должны остаться только ссылки на пост и теги
var hideMiscellaneous = function () {
    $('.infopanel_wrapper').hide();
    $('.flag').hide();
    $('.content.html_format').hide();
    $('.published').hide();
};

hideMiscellaneous();

//Справа от каждой ссылки поста показать количество комментариев к посту
var showCommentsCount = function () {
    var shortcuts =  $('.posts.shortcuts_items > div');
    if(shortcuts){
        shortcuts.each(function(){
            var comments = $(this).find('.comments .all');
            $(this).find('.title').append(comments);
        })
    } else {
        return;
    }
};

showCommentsCount();

//Подтянуть на страницу все посты в том-же формате с последующих страниц
var loadData = (function () {
    var pages = parseInt($('#nav-pages > li').children().last().text());
    var lastUrl = $('#nav-pages > li').children('li:last-child a').get(0).href;
    var currentPage = 2;

    return {
        handleResponse: function () {
            var currentUrl = lastUrl.replace(/\d+/g, currentPage);
            currentPage++;
            $.get(currentUrl, function (response) {
                var element = document.createElement('div');
                element.innerHTML = response.match(/<body>[\s\S]*<\/body>/gim)[0];
                $(element).find('.infopanel_wrapper').hide();
                $(element).find('.flag').hide();
                $(element).find('.content.html_format').hide();
                $(element).find('.published').hide();

                $(element).find('.posts.shortcuts_items > div').appendTo($('.posts.shortcuts_items'));

                showCommentsCount();

                if (currentPage <= pages) {
                    loadData.handleResponse();
                } else {
                    $('.page-nav').remove();
                }
            });
        }
    }
}());

loadData.handleResponse();
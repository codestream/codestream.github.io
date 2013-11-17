'use strict';

var habraFrames = (function($){
    $('<style type=\'text/css\'> ' + '.frame { overflow: hidden;}'
        + 'iframe::-webkit-scrollbar { display: none; }'
        + '</style>').appendTo("head");

    var COOKIE_NAME = "tab";
    var MINUTES = 1;
    var today = new Date();
    var expiry = new Date(today.getTime() + MINUTES * 60000);
    var iframe;
    var tabContent = $('.content_left');
    var tabLinks = $('.main_menu a');

    function createFrames(links, content){
        //прохожу по всем ссылкам в табе
        links.each(function(){
            //создаю ифрейм
            iframe = $(document.createElement("iframe"));
            iframe.attr('src', this.href);
            if(!iframe.hasClass("frame")){
                iframe.addClass('frame');
            }
            iframe.attr('scrolling', 'no');
            //добавляю ифрейм к контенту
            content.append(iframe);
        });
    }

    function getCookie(tabLink){
        var hrefRegex = new RegExp("(?:" + COOKIE_NAME + ")(.+?)(?=;|$)/g");
        var regexForReplace = new RegExp("" + COOKIE_NAME + "=/g");
        var link = document.cookie.match(hrefRegex);
        if (link) {
            link = link[0].replace(regexForReplace, '');
        } else {
            tabLink.each(function () {
                if ($(this).hasClass('active')) {
                    link = this.href;
                }
            });
        }
        return link;
    }

    //навешиваю кликлистенер на табы
    function addClickListener(tabs, frames){
        tabs.on('click', function(event){
            event.preventDefault();
            document.cookie = COOKIE_NAME + "=" + this.href + "; expires=" + expiry.toGMTString();
            var self = $(this);
            if($(this).hasClass("active")){
                //скрываю фреймы
                frames.hide();
                frames.each(function(){
                    //если соурс фрейма равен href таба, то записываю src фрейма
                    if ($(this).attr('src') === self.attr('href')) {
                        $(this).attr('src', self.attr('href'));
                    }
                })
            } else {
                //если таб не активен, то удаляю с табов класс active и устанавливаю класс active на кликнутом табе
                tabs.removeClass('active');
                $(this).addClass('active');
                frames.each(function(){
                    //если src айфрейма равен href таба, то показываю фрейм, иначе скрываю фрейм
                    if ($(this).attr('src') === self.attr('href')) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                })
            }
        })
    }

    function restyleFrames(frame, tabContent){
        var frameContent = frame.contents().find('.content_left');
        frameContent.width(tabContent.width() + 'px');
        frame.contents().scrollTop(frameContent.position().top);
        frame.contents().scrollLeft(frameContent.position().left);
        frame.css({
            'height': frameContent.height() + 'px',
            'width': tabContent.width() + 'px'
        });
    }

    return {
        showFrames: function(){
            tabContent.empty();
            createFrames(tabLinks, tabContent);
            var frames = $('.frame');
            //по дефолту если фрейм не загружен скрываю фрейм
            frames.hide();
            //позиционирование баннеров по правому краю
            $('.sidebar_right').css('float', 'right');

            frames.on('load', function () {
                //как фреймы загузились показываю фреймы
                frames.show();
                $('.sidebar_right').show();
                restyleFrames($(this), tabContent);
                var link = getCookie(tabLinks);
                if (this.src === link) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
                tabLinks.each(function () {
                    $(this).removeClass('active');
                    if (this.href === link) {
                        $(this).addClass('active');
                    }
                });
            });

            addClickListener(tabLinks, frames);
        }
    };
}(jQuery));

habraFrames.showFrames();

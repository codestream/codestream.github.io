'use strict';
//работает в chrome, firefox, opera, ie8-9
$(function(){
    $('<style type=\'text/css\'> ' + '.frame { overflow: hidden;}'
        + 'iframe::-webkit-scrollbar { display: none; }'
        + '</style>').appendTo("head");

    function HabraFrames(){
        this.tabLinks = $('.main_menu a');
        this.tabContent = $('.content_left');
        this.COOKIE_NAME = "tab";
        this.SECONDS = 60;
        this.MILLIS = 1000;
        this.MINUTES = 1;
        this.today = new Date();
        this.expiry = new Date(this.today.getTime() + this.MINUTES * this.SECONDS * this.MILLIS);
    }

    //создание ифреймов и размещение на страницу
    HabraFrames.prototype.createFrames = function(links, content){
        var iframe;
        links.each(function () {
            iframe = $(document.createElement("iframe"));
            iframe.attr('src', this.href);
            iframe.attr('scrolling', 'no');
            iframe.addClass('frame');
            iframe.appendTo(content);
        });
    };

    //навешивание обработчиков на табы
    HabraFrames.prototype.addClickListener = function(tabs, frames){
        var self = this;
        tabs.on('click', function (event) {
            event.preventDefault();
            //установка куки по клику на таб
            document.cookie = self.COOKIE_NAME + "=" + this.href + "; expires=" + self.expiry.toGMTString();
            var currentTab = $(this);

            //если таб активен прячу фреймы и устанавливаю src фрейма равному урлу таба
            if (currentTab.hasClass('active')) {
                frames.hide();
                frames.each(function () {
                    if ($(this).attr('src') === currentTab.attr('href')) {
                        $(this).attr('src', currentTab.attr('href'));
                    }
                })
            } else {
                tabs.removeClass('active');
                $(this).addClass('active');
                frames.each(function () {
                    if ($(this).attr('src') === currentTab.attr('href')) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                })
            }
        });
    };

    //изменение стилей фрейма
    HabraFrames.prototype.restyleFrames = function(frame, tabContent){
        var frameContent = frame.contents().find('.content_left');
        frameContent.width(tabContent.width() + 'px');
        frame.contents().scrollTop(frameContent.position().top);
        frame.contents().scrollLeft(frameContent.position().left);
        frame.css({
            'height': frameContent.height() + 'px',
            'width': tabContent.width() + 'px'
        });
    };

    //получаю регулярками урл который храниться в куки
    HabraFrames.prototype.getCookieValue = function(tabLink){
        var hrefRegex = /(?:tab)(.+?)(?=;|$)/g;
        var regexForReplace = /tab\=/g;
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
    };

    //загружаю фреймы
    HabraFrames.prototype.loadFrames = function(){
        this.tabContent.empty();
        this.createFrames(this.tabLinks, this.tabContent);
        var frames = $('.frame');
        //по дефолту если фрейм не загружен скрываю фрейм
        frames.hide();
        //позиционирование баннеров по правому краю
        $('.sidebar_right').css('float', 'right');
        this.addClickListener(this.tabLinks, frames);
        var self = this;


        frames.on('load', function () {
            //как фреймы загузились показываю фреймы
            frames.show();
            $('.sidebar_right').show();
            self.restyleFrames($(this), self.tabContent);
            var link = self.getCookieValue(self.tabLinks);
            if (this.src === link) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
            self.tabLinks.each(function () {
                $(this).removeClass('active');
                if (this.href === link) {
                    $(this).addClass('active');
                }
            });
        });
    };

    new HabraFrames().loadFrames();
});
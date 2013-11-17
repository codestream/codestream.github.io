/**
 * Рефакторинг прошлой версии. Особенности
 * 1)Вместо минутной куки решил использовать сессионную куку
 * 2)Весь код вынес в модуль, для того, чтобы инкапсулировать данные и
 * оставить публичной одну функцию showFrames, при вызове которой
 * загружаются фреймы и навешивается обработчик клика по табам
 * 3)Небольшой фикс под ie8: Убраны бордеры у фрейма установкой значения
 * аттрибута frameBorder в 0
 */
'use strict';

$(document).ready(function(){
    var habraFrames = (function(){
        $('<style type=\'text/css\'> .frame { overflow: hidden;} </style>').appendTo("head");

        var COOKIE_NAME = "tab";
        var iframe;
        var tabContent = $('.content_left');
        var tabLinks = $('.main_menu > a');

        function createFrames(links, content){
            //прохожу по всем ссылкам в табе
            links.each(function(){
                //создаю ифрейм
                iframe = $(document.createElement("iframe"));
                iframe.attr('src', this.href);
                iframe.attr('frameBorder', 0);
                if(!iframe.hasClass("frame")){
                    iframe.addClass('frame');
                }
                iframe.attr('scrolling', 'no');
                //добавляю ифрейм к контенту
                content.append(iframe);
            });
        }

        function getCookie(tabLink){
            var hrefRegex = new RegExp("(?:" + COOKIE_NAME + ")/g");
            var regexForReplace = new RegExp("" + COOKIE_NAME + "=/g");
            var link = document.cookie.match(hrefRegex);
            if(!link){
                tabLink.each(function () {
                    if ($(this).hasClass('active')) {
                        link = this.href;
                    }
                });
            } else {
                link = link[0].replace(regexForReplace, '');
            }

            return link;
        }

        function changeFrameStyle(frame, tabContent){
            var frameContent = frame.contents().find('.content_left');
            frameContent.width(tabContent.width() + 'px');
            frame.contents().scrollTop(frameContent.position().top);
            frame.contents().scrollLeft(frameContent.position().left);
            frame.css({
                'height': frameContent.height() + 'px',
                'width': tabContent.width() + 'px'
            });
        }

        //навешиваю кликлистенер на табы
        function addClickListener(tabs, frames){
            tabs.on('click', function(event){
                if($(this).has('a')){
                    event.preventDefault();
                }
                document.cookie = COOKIE_NAME + "=" + this.href;
                var self = $(this);
                if($(this).hasClass("active")){
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

        return {
            showFrames: function(){
                tabContent.empty();
                createFrames(tabLinks, tabContent);
                var frames = $('.frame');
                //по дефолту если фрейм не загружен скрываю фрейм
                frames.hide();
                //позиционирование баннеров по правому краю
                $('.sidebar_right').css('float', 'right');

                function onLoadFrames() {
                    frames.on('load', function () {
                        //как фреймы загузились показываю фреймы
                        frames.show();
                        $('.sidebar_right').show();
                        changeFrameStyle($(this), tabContent);
                        var link = getCookie(tabLinks);
                        tabLinks.each(function () {
                            if (this.href === link) {
                                if(!$(this).hasClass('active')){
                                    $(this).addClass('active');
                                }
                            }
                        });
                        if (this.src === link) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });
                }

                onLoadFrames();

                addClickListener(tabLinks, frames);
            }
        };
    }());

    habraFrames.showFrames();
});
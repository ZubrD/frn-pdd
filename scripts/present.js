
//РЕГИСТРАЦИЯ
/*$("body").on("mouseenter", "#button-registr", function(){
    $("<div class='present-tip'>Для создания Личного Кабинета необходимо <span>зарегистрироваться</span></div>").appendTo("body");
    $("body").off("mouseenter", "#button-registr");
    opa();
    desappearance();
})

$("body").on("mouseenter", "#registr-login", function(){
    $("<div class='present-tip'>Для логина и пароля можно использовать <span>только латинские буквы или цифры</span></div>").appendTo("body");
    $("body").off("mouseenter", "#registr-login");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#verify-login", function(){
    //$(".present-tip").remove();
    $("<div class='present-tip'>Такой логин уже существует, выберите другой</div>").appendTo("body");
    $("body").off("mouseenter", "#verify-login");
    opa();
    desappearance();
})

$("body").on("mouseenter", "#verify-reparol", function(){
    $("<div class='present-tip'>Если вы ошиблись при заполнении какого-либо поля регистрационной формы, рядом появится надпись <span>'Ошибка'</span></div>").appendTo("body");
    $("body").off("mouseenter", "#verify-reparol");
    opa();
    desappearance();
})

$("body").on("mouseenter", "#button-send-registr", function(){
    $("<div class='present-tip'>После того, как Вы нажмёте кнопку 'Зарегистрироваться', Вам на электронную почту придёт сообщение со ссылкой, по которой нужено пройти, чтобы завершить регистрацию</div>").appendTo("body");
    $("body").off("mouseenter", "#button-send-registr");
    opa();
    desappearance();
})*/

//ЗАГРУЗКА ВИДЕО ПО ПРЯМОЙ ССЫЛКЕ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*$("body").on("mouseenter", "#new-button-login", function(){
    $("<div class='present-tip'>Входите на сайт...</span></div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-login");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#new-button-cabinet", function(){
    $("<div class='present-tip'>Открываете свой кабинет...</span></div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-cabinet");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#input-carnumer-top-search", function(){
    $("<div class='present-tip'>Если Вы не знаете, как загружать видео на сайт, то, скорее всего, это Ваше первое видео )))</span></div>").appendTo("body");
    $("body").off("mouseenter", "#input-carnumer-top-search");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#link-upload", function(){
    $("<div class='present-tip'>Нажимаете <span>'Загрузка прямой ссылки'</span></div>").appendTo("body");
    $("body").off("mouseenter", "#link-upload");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#directlink", function(){
    $("<div class='present-tip'>В этом поле следует указать 11-значный идентификатор видео Youtube, который можно взять в адресной строке на странице просмотра видео</div>").appendTo("body");
    $("body").off("mouseenter", "#directlink");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#select-regions", function(){
    $("<div class='present-tip'>Укажите регион и город, в котором произошло нарушение ПДД</div>").appendTo("body");
    $("body").off("mouseenter", "#select-regions");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#lat", function(){
    $("<div class='present-tip'>Поля 'Широта' и 'Долгота' можно заполнить вручную, если видеорегистратор позволяет зафиксировать эти данные</div>").appendTo("body");
    $("body").off("mouseenter", "#lat");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#select-times", function(){
    $("<div class='present-tip'>Или координаты можно указать щелчком мыши на карте</div>").appendTo("body");
    $("body").off("mouseenter", "#select-times");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#datepicker", function(){
    $("<div class='present-tip'>Укажите дату и время <span>нарушения</span></div>").appendTo("body");
    $("body").off("mouseenter", "#datepicker");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#select-violation1", function(){
    $("<div class='present-tip'>Выберите подходящую категорию для нарушения</div>").appendTo("body");
    $("body").off("mouseenter", "#select-violation1");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#car_numer1", function(){
    $("<div class='present-tip'>Укажите номер машины. Обратите внимание, что буквы в номере должны быть строчными (т.е. маленькими)</div>").appendTo("body");
    $("body").off("mouseenter", "#car_numer1");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#send-data", function(){
    $("<div class='present-tip'>Всё, данные можно отправлять</div>").appendTo("body");
    $("body").off("mouseenter", "#send-data");
    opa();
    desappearance();
});*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////ГЛАВНАЯ СТРАНИЦА/////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*$("body").on("mouseenter", "#new-button-login", function(){
    $("<div class='present-tip'>Вход на сайт для зарегистрированных пользователей</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-login");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#button-registr", function(){
    $("<div class='present-tip'>Регистрация пользователя. Даёт возможность загружать на сайт информацию о нарушениях</div>").appendTo("body");
    $("body").off("mouseenter", "#button-registr");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#button-registr", function(){
    $("<div class='present-tip'>Регистрация пользователя. Даёт возможность загружать на сайт информацию о нарушениях</div>").appendTo("body");
    $("body").off("mouseenter", "#button-registr");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#link-change-town", function(){
    $("<div class='present-tip'>Выбор другого города для отображения на главной странице</div>").appendTo("body");
    $("body").off("mouseenter", "#link-change-town");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#input-carnumer-top-search", function(){
    $("<div class='present-tip'>Поле для ввода номера машины для проверки на наличие нарушений</div>").appendTo("body");
    $("body").off("mouseenter", "#input-carnumer-top-search");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#link-carnumer-top-search", function(){
    $("<div class='present-tip'>Запуск процедуры проверки на наличие нарушений</div>").appendTo("body");
    $("body").off("mouseenter", "#link-carnumer-top-search");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#new-button-search", function(){
    $("<div class='present-tip'>Поиск в базе данных нарушений по нескольким критериям (время, место, номер, тип нарушения)</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-search");
    opa();
    desappearance();
});

$("body").on("mouseenter", ".button-my-town-filter", function(){
    $("<div class='present-tip'>Включение (или отключение) показа на карте выбранного типа нарушения ПДД</div>").appendTo("body");
    $("body").off("mouseenter", ".button-my-town-filter");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#map-town", function(){
    $("<div class='present-tip'>Наведя курсор мыши на значок нарушения на карте, Вы увидите тип нарушения и номер машины-нарушителя, а кликнув по значку, откроете окно для просмотра видео</div>").appendTo("body");
    $("body").off("mouseenter", "#map-town");
    opa();
    desappearance();
});

$("body").on("mouseenter", "#clear-choice", function(){
    $("<div class='present-tip'>Подробнее о данной опции показано в видео по расширенному поиску</div>").appendTo("body");
    $("body").off("mouseenter", "#clear-choice");
    opa();
    desappearance();
});*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////КАК ЗАГРУЗИТЬ ИНФОРМАЦИЮ СРАЗУ ПО НЕСКОЛЬКИМ НАРУШЕНИЯМ///////////////////////////////////////////////////////////////////

/*$("body").on("mouseenter", "#new-button-login", function(){
 $("<div class='present-tip'>Входите на сайт...</div>").appendTo("body");
 $("body").off("mouseenter", "#new-button-login");
 opa();
 desappearance(3000);
 });

 $("body").on("mouseenter", "#new-button-cabinet", function(){
 $("<div class='present-tip'>Открываете свой кабинет...</div>").appendTo("body");
 $("body").off("mouseenter", "#new-button-cabinet");
 opa();
 desappearance(3000);
 });

$("body").on("mouseenter", "#new-button-insert", function(){
    $("<div class='present-tip'>Нажимаете 'Вставить'...</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-insert");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", "#link-upload", function(){
    $("<div class='present-tip'>В данном случае будем использовать видео из Youtube, поэтому выбираем <span>'Загрузка прямой ссылки'</span></div>").appendTo("body");
    $("body").off("mouseenter", "#link-upload");
    opa();
    desappearance(7000);
});

$("body").on("mouseenter", "#directlink", function(){
    $("<div class='present-tip'>Если на видео зафиксированы несколько нарушений, совершённых в одном месте и в одно время, то информацию по всем нарушениям можно загрузить за один раз <span>(но не более 10 нарушений)</span></div>").appendTo("body");
    $("body").off("mouseenter", "#directlink");
    opa();
    desappearance(9000);
});

$("body").on("mouseenter", "#select-regions", function(){
    $("<div class='present-tip'>Заполнение формы подробно показано в разделе 'Загрузка по прямой ссылке'</div>").appendTo("body");
    $("body").off("mouseenter", "#select-regions");
    opa();
    desappearance(5000);
});

$("body").on("mouseenter", "#add-add-case", function(){
    $("<div class='present-tip'>Добавить поля для следующего нарушения можно только после заполнения имеющихся</div>").appendTo("body");
    $("body").off("mouseenter", "#add-add-case");
    opa();
    desappearance(5000);
});

$("body").on("mouseenter", "#send-data", function(){
    $("<div class='present-tip'>Всё, данные можно отправлять</div>").appendTo("body");
    $("body").off("mouseenter", "#send-data");
    opa();
    desappearance(3000);
});*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///КАБИНЕТ/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*$("body").on("mouseenter", "#new-button-login", function(){
 $("<div class='present-tip'>Входите на сайт...</div>").appendTo("body");
 $("body").off("mouseenter", "#new-button-login");
 opa();
 desappearance(3000);
 });

 $("body").on("mouseenter", "#new-button-cabinet", function(){
 $("<div class='present-tip'>Открываете свой кабинет...</div>").appendTo("body");
 $("body").off("mouseenter", "#new-button-cabinet");
 opa();
 desappearance(3000);
 });

$("body").on("mouseenter", "#input-carnumer-top-search", function(){
    $("<div class='present-tip'>В кабинете можно загрузить и посмотреть загруженные Вами видео, их статус модерации, комментарии</div>").appendTo("body");
    $("body").off("mouseenter", "#input-carnumer-top-search");
    opa();
    desappearance(5000);
});

$("body").on("mouseenter", "#new-button-insert", function(){
    $("<div class='present-tip'>Переход на страницу загрузки информации по зафиксированному нарушению (или нарушениям)</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-insert");
    opa();
    desappearance(5000);
});

$("body").on("mouseenter", "#new-button-insert", function(){
    $("<div class='present-tip'>Переход на страницу загрузки информации по зафиксированному нарушению (или нарушениям)</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-insert");
    opa();
    desappearance(5000);
});

$("body").on("mouseenter", ".proved-class-yes", function(){
    $("<div class='present-tip'>Информация о нарушении которая <span>прошла</span> модерацию</div>").appendTo("body");
    $("body").off("mouseenter", ".proved-class-yes");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", ".proved-class-no", function(){
    $("<div class='present-tip'>Информация о нарушении которая <span>ещё не проверялась</span></div>").appendTo("body");
    $("body").off("mouseenter", ".proved-class-no");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", ".proved-class-bad", function(){
    $("<div class='present-tip'>После проверки видео было <span>отклонено</span></div>").appendTo("body");
    $("body").off("mouseenter", ".proved-class-bad");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", ".show-comments", function(){
    $("<div class='present-tip'>Комментарии зарегистрированных пользователей к конкретному видео</div>").appendTo("body");
    $("body").off("mouseenter", ".show-comments");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", "#button-proved-yes", function(){
    $("<div class='present-tip'>Переключатели, показывают или скрывают на карте и в таблице информацию по видео, которые были проверены, ещё не проверены или отклонены</div>").appendTo("body");
    $("body").off("mouseenter", "#button-proved-yes");
    opa();
    desappearance(6000);
});*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////ЗАГРУЗКА ВИДЕО С КОМПЬЮТЕРА/////////////////////////////////////////////////////////////////////////////////////////////////

/*$("body").on("mouseenter", "#new-button-cabinet", function(){
    $("<div class='present-tip'>Открываете свой кабинет...</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-cabinet");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", "#new-button-insert", function(){
    $("<div class='present-tip'>Открываете страницу загрузки видео...</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-insert");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", "#file-upload", function(){
    $("<div class='present-tip'>Этот вариант загрузки следует выбрать, если у Вас есть записанное видео с фиксацией нарушения ПДД, но нет своего канала на Youtube. В этом случае загрузка видео осуществляется с помощью данного сайта</div>").appendTo("body");
    $("body").off("mouseenter", "#file-upload");
    opa();
    desappearance(11000);
});

$("body").on("mouseenter", "#prepare-toyoutube", function(){
    $("<div class='present-tip'>Подготовка к загрузке видео на Youtube...</div>").appendTo("body");
    $("body").off("mouseenter", "#prepare-toyoutube");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", "#progress", function(){
    $("<div class='present-tip'>Осуществляется загрузка видео на Youtube...</div>").appendTo("body");
    $("body").off("mouseenter", "#progress");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", "#select-regions", function(){
    $("<div class='present-tip'>Подробно о заполнении формы показано в ролике 'Загрузка видео с существующего канала Youtube'</div>").appendTo("body");
    $("body").off("mouseenter", "#select-regions");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", "#button-proved-yes", function(){
    $("<div class='present-tip'>Скрываем подтверждённые и отклоненные видео ...</div>").appendTo("body");
    $("body").off("mouseenter", "#button-proved-yes");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", ".proved-class-no", function(){
    $("<div class='present-tip'>Это видео мы только что загрузили</div>").appendTo("body");
    $("body").off("mouseenter", ".proved-class-no");
    opa();
    desappearance(3000);
});*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////РАСШИРЕННЫЙ ПОИСК/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*$("body").on("mouseenter", "#new-button-search", function(){
    $("<div class='present-tip'>Переходим по ссылке 'Расширенный поиск'</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-search");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", "#select-regions-search", function(){
    $("<div class='present-tip'>Для поиска можно использовать произвольное количество критериев</div>").appendTo("body");
    $("body").off("mouseenter", "#select-regions-search");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", "#select-towns-search", function(){
    $("<div class='present-tip'>Единственное ограничение - количество результатов не должно превышать 200</div>").appendTo("body");
    $("body").off("mouseenter", "#select-towns-search");
    opa();
    desappearance(5000);
});

$("body").on("mouseenter", ".search-headline", function(){
    $("<div class='present-tip'>Выбранные Вами критерии поиска</div>").appendTo("body");
    $("body").off("mouseenter", ".search-headline");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", ".selected-search-coords", function(){
    $("<div class='present-tip'>Нажав на ссылку, перемещаете нарушение в центр карты</div>").appendTo("body");
    $("body").off("mouseenter", ".selected-search-coords");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", ".button-search-filter", function(){
    $("<div class='present-tip'>Скрывает или показывает нарушение на карте. Может пригодиться, если в одной точке было совершено несколько нарушений и на карте они накладываются одно на другое</div>").appendTo("body");
    $("body").off("mouseenter", ".button-search-filter");
    opa();
    desappearance(8000);
});

$("body").on("mouseenter", ".img-comment", function(){
    $("<div class='present-tip'>Можете оставить свой комментарий ...</div>").appendTo("body");
    $("body").off("mouseenter", ".img-comment");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", ".popup-send-comment", function(){
    $("<div class='present-tip'>Каждый пользователь может оставить к конкретному видео только <span>один</span> комментарий, после чего для данного пользователя возможность комментирования этого видео <span>отключается</span></div>").appendTo("body");
    $("body").off("mouseenter", ".popup-send-comment");
    opa();
    desappearance(10000);
});

$("body").on("mouseenter", ".finger-up", function(){
    $("<div class='present-tip'>...или проголосовать</div>").appendTo("body");
    $("body").off("mouseenter", ".finger-up");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", "#finger-up-yes", function(){
    $("<div class='present-tip'>Проголосовать можно только <span>один</span> раз</div>").appendTo("body");
    $("body").off("mouseenter", "#finger-up-yes");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", ".grades-yes", function(){
    $("<div class='present-tip'>По этому видео пользователь уже проголосовал</div>").appendTo("body");
    $("body").off("mouseenter", ".grades-yes");
    opa();
    desappearance(3000);
});

$("body").on("mouseenter", "#clear-choice", function(){
    $("<div class='present-tip'>Чтобы начать новый поиск, следует сбросить результаты прежнего</div>").appendTo("body");
    $("body").off("mouseenter", "#clear-choice");
    opa();
    desappearance(3000);
});*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////ПОСМОТРЕТЬ ИНФОРМАЦИЮ ПО ОТВЕТАМ ИЗ ГИБДД///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$("body").on("mouseenter", "#new-button-search", function(){
    $("<div class='present-tip'>Переходим по ссылке 'Расширенный поиск'</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-search");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", "#declaration-status", function(){
    $("<div class='present-tip'>В разделе 'Заявления в ГИБДД' выберите 'Виновен'</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-search");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", ".img-finger-down", function(){
    $("<div class='present-tip'>Щёлкните мышью на символ 'Большой палец вниз'</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-search");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", ".text-sended", function(){
    $("<div class='present-tip'>Нажмите ссылку, чтобы увидеть ответ из ГИБДД</div>").appendTo("body");
    $("body").off("mouseenter", "#new-button-search");
    opa();
    desappearance(4000);
});

$("body").on("mouseenter", "#clear-choice", function(){
    $("<div class='present-tip'>Чтобы начать новый поиск, следует сбросить результаты прежнего</div>").appendTo("body");
    $("body").off("mouseenter", "#clear-choice");
    opa();
    desappearance(3000);
});

function opa (){
    $(".present-tip").animate({
        opacity: 1
    }, 1000);
}

function desappearance (long){
    setTimeout(function(){
        $(".present-tip").animate({
            opacity: 0,
            height: "0px"
        }, 1000);
    }, long);
}

$(document).on("click", "body", function(){
    $(".present-tip").remove();
})
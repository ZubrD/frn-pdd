$("body").on("click", "#help-link", function(){
    $("<div id='container-help'></div>").appendTo("#main-container");
    var left = $(window).width()/2 - 300 + "px";            //Выравниваю по центру блок со вспомогательной информацией
    $("#container-help").css({width: "600", left: left});   //---
    containerHelp();
    disableMineLinksButtons();//Дезактивирую ссылки и кнопы в файле my-scrip.js
});

function containerHelp (){      // Блок с вопросами и ответами
    $("<div id='main-level'>Вопросы и ответы</div>").appendTo("#container-help");
    $("<div class='level-1'><img src='images/close.png' class='close-help helps'></img></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-main' class='helps' href='#'>Что на главной странице?</a></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-registr' class='helps' href='#'>Зачем регистрироваться на сайте?</a></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-how-registr' class='helps' href='#'>Как зарегистрироваться?</a></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-cabinet' class='helps' href='#'>Про личный кабинет</a></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-upload' class='helps' href='#'>Как загрузить видео на сайт с моего канала Youtube?</a></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-upload-from-site' class='helps' href='#'>Как загрузить видео прямо на сайте?</a></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-upload-multy' class='helps' href='#'>Что делать, если на одном видео зафиксировано несколько нарушений?</a></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-advanced-search' class='helps' href='#'>Что такое расширенный поиск?</a></div>").appendTo("#container-help");
    $("<div class='level-1'><a id='help-comment' class='helps' href='#'>Как оставить комментарий?</a></div>").appendTo("#container-help");
    //$("<div class='level-1'><a id='help-vote' href='#'>Как проголосовать?</a></div>").appendTo("#container-help");
    $("<div class='level-2' id='456'>Чтобы можно было загрузить видео, оставить комментарии, проголосовать</div>").insertAfter("#help-registr").hide();     //По умолчанию текст скрыт
    $("<div class='level-2' id='457'>Для этого нужно быть зарегистрированным пользователем, а как оставить комментарий показано в видео по расширенному поиску</div>").insertAfter("#help-comment").hide();     //По умолчанию текст скрыт
}

function containerHelpClear (){ //Очистка места в контейнере для информации по выбранному вопросу
    $("#container-help").children().remove();
    $("<div><img src='images/close.png' class='close-help helps'></img></div>").appendTo("#container-help");
    $("<div><img src='images/back.png' class='back-help helps'></img></div>").appendTo("#container-help");
}
$("body").on("click", "#help-registr", function(){
    $("#456").toggle(); //Щелчком по кнопу показываю и скрываю ответ
});

$("body").on("click", "#help-comment", function(){
    $("#457").toggle(); //Щелчком по кнопу показываю и скрываю ответ
});

$("body").on("click", ".close-help", function(){    //Закрываю блок с вопросами и ответами
    $("#container-help").remove();
    enableMineLinksButtons();   //Восстанавливаю ссылки и кнопы
})

$("body").on("click", ".back-help", function(){     //Возврат к перечню вопросов
    $("#container-help").children().remove();
    containerHelp();
})

$("body").on("click", "#help-main, #help-how-registr, #help-cabinet, #help-upload, #help-upload-from-site, #help-upload-multy, " +
    "#help-advanced-search, #help-vote", function(){
    containerHelpClear();   //Удаляю вопросы, чтобы освободить место для ответов
    $("<div class='level-3'>"+ $(this).text() +"</div>").appendTo("#container-help");   //Заголовок ответа на вопрос
});

$("body").on("click", "#help-main", function(){
    $("<iframe class='help-video' src='https://www.youtube.com/embed/qG2M2BCItdw' frameborder='0' allowfullscreen></iframe>").appendTo("#container-help");
});

$("body").on("click", "#help-how-registr", function(){
    $("<iframe class='help-video' src='https://www.youtube.com/embed/0k_69Mx0vQs' frameborder='0' allowfullscreen></iframe>").appendTo("#container-help");
});

$("body").on("click", "#help-cabinet", function(){
    $("<iframe class='help-video' src='https://www.youtube.com/embed/arWGkomj2rQ' frameborder='0' allowfullscreen></iframe>").appendTo("#container-help");
});

$("body").on("click", "#help-upload", function(){
    $("<iframe class='help-video' src='https://www.youtube.com/embed/UuZ3gw4dgfQ' frameborder='0' allowfullscreen></iframe>").appendTo("#container-help");
});

$("body").on("click", "#help-upload-from-site", function(){
    $("<iframe class='help-video' src='https://www.youtube.com/embed/4biYpympQwk' frameborder='0' allowfullscreen></iframe>").appendTo("#container-help");
});

$("body").on("click", "#help-upload-multy", function(){
    $("<iframe class='help-video' src='https://www.youtube.com/embed/h6-q1C_ECHg' frameborder='0' allowfullscreen></iframe>").appendTo("#container-help");
});

$("body").on("click", "#help-advanced-search", function(){
    $("<iframe class='help-video' src='https://www.youtube.com/embed/rsOstZ9bAlU' frameborder='0' allowfullscreen></iframe>").appendTo("#container-help");
});

$("body").on("mouseenter", "#new-button-login, #button-registr, .button-my-town-filter, #link-change-town, " +
    "#input-carnumer-top-search, #link-carnumer-top-search, #new-button-search, #select-regions-search, #select-towns-search, " +
    ".sended, #select-violation-search", function(event){
    addTips();
    $(this).addClass("tipped");
    var top = event.pageY + 15;
    $("<div class='tip'></div>").appendTo("#top-info");
    $(".tip").css({left: event.pageX, top: top}).html($(this).attr("tip") + "<br/><a class='delete-tip' href='#'>Скрыть все подсказки</a>");
})

$(document).on("click", "body", function(){
    $(".tip").remove();
})

$("body").on("click", ".delete-tip", function(){
    $("body").off("mouseenter", "#new-button-login, #button-registr, .button-my-town-filter, #link-change-town, " + // Удаляю событие "наведение мыши"
        "#input-carnumer-top-search, #link-carnumer-top-search, #new-button-search, #select-regions-search, #select-towns-search, .sended, #select-violation-search");
})

function addTips (){    //Все подсказки
    $(".button-my-town-filter").attr({tip: "Скрыть/Показать на карте данное нарушение (убрать из поля зрения одни нарушения, чтобы были видны остальные)"});
    $("#new-button-login").attr({tip: "Вход в личный кабинет"});
    $("#button-registr").attr({tip: "Регистрация личного кабинета"});
    $("#link-change-town").attr({tip: "Выбрать другой город для отображения на главной странице"});
    $("#input-carnumer-top-search").attr({tip: "Поле для ввода номера машины на проверку"});
    $("#link-carnumer-top-search").attr({tip: "Запуск проверки номера машины на наличие зафиксированных нарушений"});
    $("#new-button-search").attr({tip: "Поиск машин-нарушителей по месту, времени и типу нарушений"});
    $("#select-regions-search").attr({tip: "Выберите регион"});
    $("#select-towns-search").attr({tip: "Выберите город"});
    $("#select-violation-search").attr({tip: "Выберите нарушение"});
    $(".sended").attr({tip: "Заявление направлено в ГИБДД"});
}

/*$("body").on("click", ".img-comment", function () {
    var case_id = $(this).attr("case_id");
    var car_numer = $(this).attr("car_numer");
    var town_name = $(this).attr("town_name");
    //$(".white-sq").css("display", "inline-block");   //Заслоняю картинку полупрозрачным белым квадратом, чтобы заблокировать событие клика
    //$("body").off("click", ".img-comment");   //Нет необходимости - можно просто заслонить полупрозрачным экраном

    $("button, select, input").not(".comments").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме тех, что с классом registrs
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки и все картинки

    $("<div class='popup-container'></div>").appendTo("#main-container");
    $("<div class='popup-comment-title'>Комментарий к инциденту с машиной " + car_numer + " в городе " + town_name + "</div>").appendTo(".popup-container");
    $("<form id='form-comment' name='form-comment'></form>").insertAfter(".popup-comment-title");
    $("<textarea class='text-comment comments' name='text-comment'></textarea>").appendTo("#form-comment");
    $("<input type='hidden' name='comment-case-id' class='comments' id='comment-case-id' />").appendTo("#form-comment");
    $("<button case_id='" + case_id + "' class='popup-send-comment comments'>Отправить</button>").insertAfter("#form-comment");
    $("<button class='remove-popup comments'>Закрыть</button>").insertAfter(".popup-send-comment");
});*/

$("body").on("click", ".popup-send-comment", function () {
    var case_id = $(this).attr("case_id");
    $("#comment-case-id").val(case_id);
    var data = $("#form-comment").serializeArray();
    $.post("server/comment.php", data);
    $(".img-comment").each(function () { //Проверяю атрибут case_id каждого элемента класса .img-comment
        if (case_id == $(this).attr('case_id')) {   //Если case_id из БД совпадает со значением атрибута case_id элемента класса img-comment,
            $(this).css({display: 'none'});   //то этот элемент делаю невидимым
        }
    })
    closePopup();
    //allowComments();  //Убрал, потому что нет необходимости каждый раз делать запрос к серверу о наличии от пользователя комментариев
    //ownComments()     //Убрал, потому что нет необходимости каждый раз делать запрос к серверу о том, является ли эта запись самого пользователя
});

$("body").on("click", ".remove-popup", function () {
    closePopup();
    //allowComments();  //Убрал, потому что нет необходимости каждый раз делать запрос к серверу о наличии от пользователя комментариев
    //ownComments()     //Убрал, потому что нет необходимости каждый раз делать запрос к серверу о том, является ли эта запись самого пользователя
});

function closePopup() {
    $("button, select, input").removeAttr("disabled");  //Восстанавливаю кнопы, элементы выбора, поля ввода
    $("a, img").removeClass("disabled"); //Восстанавливаю ссылки
    $(".popup-container").remove();
    //$(".white-sq").css("display", "none");
/*    $("body").on("click", ".img-comment", function () {
        var case_id = $(this).attr("case_id");
        var car_numer = $(this).attr("car_numer");
        var town_name = $(this).attr("town_name");
        $(".white-sq").css("left", "-193px");
        $("body").off("click", ".img-comment");
        $("#new-button-cabinet, #new-button-logout, #send-data-search, #clear-choice, #return-to-choice, #select-regions-search, " +
            "#select-towns-search, #select-violation-search, .button-search-filter").attr({disabled: 'disabled'});// Блокирую нажатие остальных элементов
        $("#help-link, .selected-search-coords, #link-carnumer-top-search, .link-paging").addClass("disabled");     //Блокирую ссылки
        $("<div class='popup-container'></div>").appendTo("body");
        $("<div class='popup-comment-title'>Комментарий к инциденту с машиной " + car_numer + " в городе " + town_name + "</div>").appendTo(".popup-container");
        $("<form id='form-comment' name='form-comment'></form>").insertAfter(".popup-comment-title");
        $("<textarea class='text-comment' name='text-comment'></textarea>").appendTo("#form-comment");
        $("<input type='hidden' name='comment-case-id' id='comment-case-id' />").appendTo("#form-comment");
        $("<button case_id='" + case_id + "' class='popup-send-comment'>Отправить</button>").insertAfter("#form-comment");
        $("<button class='remove-popup'>Закрыть</button>").insertAfter(".popup-send-comment");
    });*/
}

function allowComments() {  //Проверяю наличие комментариев к данному событию данного пользователя (на конкретное событие пользователь может оставить только ОДИН комментарий)
    $.getJSON("server/select_comments.php", "0", function (data) {  //Получаю список комментированных событий
        $.each(data.otvet, function () {
            var case_id = this['case_id'];
            $(".img-comment").each(function () { //Проверяю атрибут case_id каждого элемента класса .img-comment
                if (case_id == $(this).attr('case_id')) {   //Если case_id из БД совпадает со значением атрибута case_id элемента класса img-comment,
                    $(this).css({display: 'none'});   //то этот элемент делаю невидимым
                }
            })
        })
    });
}

function ownComments() {    //Делаю неактивнми кнопки в по тем событиям, которые загрузил сам пользователь
    $.post("server/get_name.php", "0", function (data) {
        var author = data;
        $(".img-comment, .finger-up, .finger-down").each(function () { //Проверяю атрибут case_id каждого элемента классов .img-comment, .finger-up, .finger-down
            if (author == $(this).attr('author')) {   //Если case_id из БД совпадает со значением атрибута case_id элемента класса img-comment,
                $(this).css({display: 'none'});   //то этот элемент делаю невидимым
            }
        })
    })
}
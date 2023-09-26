$(document).ready(function () {
    $.post("server/verify_moderin.php", "0", function (data) {    //Проверка наличия переменной сессии
        if(data == 111){                            // если переменная есть, то скрываю кнопку "Войти"
            showUnproved();
        } else if(data == 000){
            $("<form name='dostup' id='dostup'><input type='text' name='dostup_login' id='dostup_login' />" +
                "<input name='dostup_pass' id='dostup_pass' /></form><button id='send_dostup'>Отправить</button>").appendTo("body");
        }
    });
});

$("body").on("click", "#send_dostup", function () {
    var dostup_data = $("#dostup").serializeArray();
    $.post("server/moderin.php", dostup_data, function (data) {
        if (data == 111){
            alert ("Правильный ответ!!!");
            location.reload();
        } else if(data == 000) {
            alert ("Ответ неправильный!!!")
        } else if (data == 222) {
            alert("нет такого пользователя!!!")
        }
    });
});

function showUnproved() {
    $("<div id='container-moder'></div>").appendTo("body");
    $("<table id='table-moder'></table>").appendTo("#container-moder");
    $("<div id='div-vsego'></div>").appendTo("#container-moder");
    $.getJSON("server/search_unproved_case.php", "000", function (json) {
        if(json.otvet.length > 0){
            //alert(json.otvet.length);
            $.each(json.otvet, function () {
                var videos = this['videos'];
                var newid = this['newid'];
                var car_numer = this['car_numer'];
                var author = this['author'];
                var  violation = this['violation'];
                $("<tr><td><iframe class='" + videos + "' width='300' height='200' src='https://www.youtube.com/embed/" + videos +
                    "' frameborder='0' allowfullscreen></iframe></td>" +
                    "<td><span class='span-author'>" + author + "</span></td>" +
                    "<td><span class='span-car_numer'>" + car_numer + "</span></td>" +
                    "<td><div class='div-violation'>" + violation + "</div></td>" +
                    "<td><button class='yes' newid = '" + newid + "' car_numer = '" + car_numer + "' author = '" + author + "'>Подтвердить</button></td>" +
                    "<td><button class='bad' newid = '" + newid + "' car_numer = '" + car_numer + "' author = '" + author + "'>Отклонить</button></td>" +
                    "<td></td>" +
                    "<td></td></tr>").appendTo("#table-moder");
            })
        }
        $("#div-vsego").attr({vsego: json.vsego});
        var vsego = $("#div-vsego").attr("vsego");
        $("<button id='end-moder'>Завершить</button>").appendTo("#container-moder");
        $("<button id='continue-moder' vsego = '" + vsego + "'>Ещё? (" + vsego + ")</button>").appendTo("#container-moder");
    });
}

$("body").on("click", ".yes", function () {
    var newid = $(this).attr("newid");
    var proved_data = {kandidat: $(this).attr("newid"), author: $(this).attr("author")};
    $.post("server/prove_case_yes.php", proved_data);
    $(this).removeClass("yes").addClass("return_yes").attr({disabled: "disabled"});
    //$(this).text("Вернуть");
    $(".bad").each(function () {    //Проверяю все кнопки с Отклонить
        if ($(this).attr("newid") == newid){    // и если они относятся к тому же событию, что и кнопки Подтвердить, то
            $(this).attr({disabled: "disabled"});   // делаю их неактивными, чтобы исключить двойной выбор
        }
    });
});
$("body").on("click", ".bad", function () {
    var newid = $(this).attr("newid");
    var proved_data = {kandidat: $(this).attr("newid"), author: $(this).attr("author")};
    $.post("server/prove_case_bad.php", proved_data);
    $(this).removeClass("bad").addClass("return_bad").attr({disabled: "disabled"});
    //$(this).text("Вернуть");
    $(".yes").each(function () {    //Проверяю все кнопки с Отклонить
        if ($(this).attr("newid") == newid){    // и если они относятся к тому же событию, что и кнопки Подтвердить, то
            $(this).attr({disabled: "disabled"});   // делаю их неактивными, чтобы исключить двойной выбор
        }
    });
});


$("body").on("click", "#continue-moder", function () {
    $("#container-moder").remove();
    showUnproved();
})

$("body").on("click", "#end-moder", function () {
    $.post("server/moderout.php", "0", function (data) {
        if(data == 777){
            location.reload();
        }
    });
});

// Эти обработчики нужны, если оставить возможность возврата к решению по принятию или отклонению видео
/*$("body").on("click", ".return_yes", function () {
 var newid = $(this).attr("newid");
 var proved_data = {kandidat: $(this).attr("newid")};
 $.post("server/prove_case_return.php", proved_data);
 $(this).removeClass("return_yes").addClass("yes");
 $(this).text("Подтвердить");
 $(".bad").each(function () {    //Проверяю все кнопки с Отклонить
 if ($(this).attr("newid") == newid){    // и если они относятся к тому же событию, что и кнопки Подтвердить, то
 $(this).removeAttr("disabled");   // делаю их неактивными, чтобы исключить двойной выбор
 }
 });
 });*/
/*$("body").on("click", ".return_bad", function () {
 var newid = $(this).attr("newid");
 var proved_data = {kandidat: $(this).attr("newid")};
 $.post("server/prove_case_return.php", proved_data);
 $(this).removeClass("return_bad").addClass("bad");
 $(this).text("Отклонить");
 $(".yes").each(function () {    //Проверяю все кнопки с Отклонить
 if ($(this).attr("newid") == newid){    // и если они относятся к тому же событию, что и кнопки Подтвердить, то
 $(this).removeAttr("disabled");   // делаю их неактивными, чтобы исключить двойной выбор
 }
 });
 });*/
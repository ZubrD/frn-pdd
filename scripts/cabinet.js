$("body").on("click", "#new-button-cabinet", function () {
    $("#container-map-town, #container-carnumer-search, #page-searchh, #page-insertt, #cabinett").remove();  //Удаляю блок карты города по умолчанию или карты поиска по номеру машины
    $("<div id='cabinett'></div>").appendTo("body");
    $.post("server/get_name.php", "0", function (data) {
        var datalogin = {datalogin: data};
        var cabinet_start = $.post("server/cabinet_numrows.php", datalogin, function (otvet){   //Проверяю, есть ли записи в кабинете
           if(otvet > 0){       //Если есть, то загружаю форму для отображения данных...
               $("<form name='case-search' id='case-search' method='post'></form>").appendTo("#cabinett");
               $("<input type='hidden' name='dbcar-author-search' id='dbcar-author-search' />").appendTo("#case-search");
               $("<input type='hidden' name='proved-yes-search' id='proved-yes-search' />").appendTo("#case-search");
               $("<input type='hidden' name='proved-no-search' id='proved-no-search' />").appendTo("#case-search");
               $("<input type='hidden' name='proved-bad-search' id='proved-bad-search' />").appendTo("#case-search");
               $("<div id='map-search'></div>").appendTo("#cabinett");
               $("#return-to-choice").show();
               $("#new-button-search").removeClass("disabled");    //Снова делаю активной ссылку расширенного поиска
               $("<button id='new-button-insert'>Вставить</button>").appendTo("#cabinett");
               if(data == "david"){
                   $("<span><a href='#' id='admin-registr'>Учёт</a></span>").insertAfter("#new-button-insert");
               }
               $("<table id='table-result-search'></table>").appendTo("#cabinett");
               $("#dbcar-author-search").val(data);

               var proving = "yes";
               var cabinet_data = $("#case-search").serializeArray();
               //cabinet_start.complete(searchMap(cabinet_data, proving));   //Функцию searchMap вызываю только после выполнения запроса cabinet_start
               searchMap(cabinet_data, proving);

           } else {             //Если нет - то вывожу в центре экрана кноп перехода на форму вставки данных
               $("#return-to-choice").show();
               $("<button id='new-button-insert' class='cabinet-first-record'>Ваша первая запись!</button>").appendTo("#cabinett");
           }
        });

        $.getJSON("server/author_limit.php", "0", function (from_volontiers) {
            if (from_volontiers.ban == "yes") {
                $("#new-button-insert").attr({disabled: 'disabled'});// Если лимит загрузок на сегодня закончился, кнопка становится неактивна
                banInsert();
            }
            if (from_volontiers.inslimit == "111"){
                $("#new-button-insert").attr({disabled: 'disabled'});// Если лимит загрузок на сегодня закончился, кнопка становится неактивна
                forbiddenTodayInsert();
            }
        })
    });
    //alert("Загрузка данных личного кабинета...");
});

$("body").on ("click", "#button-proved-yes", function () {  //Личный кабинет, нажатие кнопки Подтверждённые
    if($("#button-proved-yes").data("test").flag == "unpushed"){
        $("#button-proved-yes").data("test", {flag: "pushed"}); //Переводим флаг в позицию нажато
        $(this).text("Показать");
        $(".number-yes").filter(":first-child").addClass("proved_unvisible");
        $("#proved-yes-search").val("yes");
    } else if($("#button-proved-yes").data("test").flag == "pushed"){
        $("#button-proved-yes").data("test", {flag: "unpushed"}); //Переводим флаг в позицию нажато
        $(this).text("Скрыть");
        $(".number-yes").filter(":first-child").removeClass("proved_unvisible");
        $("#proved-yes-search").val("");
    }
    //query_empty(); // Специально не обнуляю поля формы
    var proved_yes_data = $("#case-search").serializeArray();
    var proving = "no";
    $("#map-search").empty();//Очищаю место для новой карты
    $("#table-result-search").empty();//Очищаю место для вывода данных по результатам поиска (сбоку от карты)
    searchMap(proved_yes_data, proving);
});

$("body").on ("click", "#button-proved-no", function () {  //Личный кабинет, нажатие кнопки Неподтверждённые
    if($("#button-proved-no").data("test").flag == "unpushed"){
        $("#button-proved-no").data("test", {flag: "pushed"}); //Переводим флаг в позицию нажато
        $(this).text("Показать");
        $("#proved_sum tr td.number-no").addClass("proved_unvisible");
        $("#proved-no-search").val("no");
    } else if($("#button-proved-no").data("test").flag == "pushed"){
        $("#button-proved-no").data("test", {flag: "unpushed"}); //Переводим флаг в позицию нажато
        $(this).text("Скрыть");
        $("#proved_sum tr td.number-no").removeClass("proved_unvisible");
        $("#proved-no-search").val("");
    }
    var proved_no_data = $("#case-search").serializeArray();
    var proving = "no";
    $("#map-search").empty();//Очищаю место для новой карты
    $("#table-result-search").empty();//Очищаю место для вывода данных по результатам поиска (сбоку от карты)
    searchMap(proved_no_data, proving);
});

$("body").on ("click", "#button-proved-bad", function () {  //Личный кабинет, нажатие кнопки Отклонённые
    if($("#button-proved-bad").data("test").flag == "unpushed"){
        $("#button-proved-bad").data("test", {flag: "pushed"}); //Переводим флаг в позицию нажато
        $(this).text("Показать");
        $("#proved_sum tr td.number-bad").addClass("proved_unvisible");
        $("#proved-bad-search").val("bad");
    } else if($("#button-proved-bad").data("test").flag == "pushed"){
        $("#button-proved-bad").data("test", {flag: "unpushed"}); //Переводим флаг в позицию нажато
        $(this).text("Скрыть");
        $("#proved_sum tr td.number-bad").removeClass("proved_unvisible");
        $("#proved-bad-search").val("");
    }
    var proved_bad_data = $("#case-search").serializeArray();
    var proving = "no";
    $("#map-search").empty();//Очищаю место для новой карты
    $("#table-result-search").empty();//Очищаю место для вывода данных по результатам поиска (сбоку от карты)
    searchMap(proved_bad_data, proving);
});

//Нажимаю ссылку класса selected-cabinet-coords для кабинета и вывожу сообщение с id этой ссылки
$("body").on("click", ".selected-cabinet-coords", function () {
    $("#map-search").remove();
    $("<div id='map-search'></div>").insertAfter("#proved_sum");
    var selected_case_id = $(this).attr("case_id");
    var array_selected_case = $("#cont-for-json-otvet").data("cabinet-data");
    searchMapSelected(array_selected_case, selected_case_id);
});

$("body").on("click", "#show-cabinet-data", function () {
    var array_selected_case = $("#cont-for-json-otvet").data("cabinet-data");

    alert(array_selected_case[1].latitude);
/*   /!* $("#map-search").remove();
    $("<div id='map-search'></div>").insertAfter("#cabinett");*!/*/
});

$("body").on("click", ".show-comments", function () {
    $("<div id='container-comment-in-cabinet'></div>").appendTo("body");    //Контейнер для вывода комментариев
    $("<div id='container-title-in-cabinet'></div>").appendTo("#container-comment-in-cabinet");  //Место для заголовка общего для всех комментариев по данному событию
    $("<div id='container-next-in-cabinet'></div>").appendTo("#container-comment-in-cabinet");  //Сюда буду вставлять комментарии по данному событию
    $("<button class='close-comments'>Закрыть</button>").appendTo("#container-comment-in-cabinet"); //Кнопка закрытия комментариев
    var data = {case_id: $(this).attr("case_id")};
    var case_id = $(this).attr("case_id");
    var array_selected_case = $("#cont-for-json-otvet").data("cabinet-data");
    $.each(array_selected_case, function () {
        var newid = this['newid'];
        var town_name = this['town_name'];
        var car_numer = this['car_numer'];
        if (case_id == newid){
            $("#container-title-in-cabinet").html("Комментарии к инциденту с машиной " + car_numer + " в городе " + town_name);
        }
    });
    $.getJSON("server/show_comments.php", data, function (json) {
        $.each(json.otvet, function () {
            var writer = this['writer'];
            var comment = this['comment'];
            $("<div class='next-title-in-cabinet'></div>").appendTo("#container-next-in-cabinet").html(writer);
            $("<div class='next-comment-in-cabinet'></div>").appendTo("#container-next-in-cabinet").html(comment);
            $("<hr>").appendTo("#container-next-in-cabinet");

        });
    })
});

$("body").on("click", ".close-comments", function () {  //Закрыть комментарий
    $("#container-comment-in-cabinet").remove();
});

function forbiddenTodayInsert() {                       //Уведомление об исчерпании лимита загрузок при наведении мыши на кноп "Вставить"
    $("body").on("mouseover", "#new-button-insert", function () {
        alert("На сегодня лимит загрузок исчерпан");
    })
}

function banInsert() {          //Уведомление о запрете вставки при наведении мыши на кноп "Вставить"
    $("body").on("mouseenter", "#new-button-insert", function () {
        $("#return-to-choice, #button-proved-yes, #button-proved-no, #button-proved-bad").attr({disabled: "disabled"});
        $("<div id='ban-insert'></div>").appendTo("body");
        $("<div id='text-ban-insert'>В соответствии с п... Правил Вам <br /><span>ЗАПРЕЩЕНО</span><br /> размещать видео на сайте</div>").appendTo("#ban-insert");
        $("<button id='button-ban-insert'>Закрыть</button>").appendTo("#ban-insert");
    })
}

function leaveBanInsert() {     //Отключение события 'наведение мыши' от кнопа "Вставить"
    $("body").off("mouseenter", "#new-button-insert");
}

$("body").on("click", "#button-ban-insert", function () {
    $("#ban-insert").remove();
    $("#return-to-choice, #button-proved-yes, #button-proved-no, #button-proved-bad").removeAttr("disabled");
});

$("body").on("click", ".next-title-in-cabinet", function () {
    $(this).css({visibility: 'hidden'});
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////ИЗМЕНЕНИЕ СТАТУСА ЗАЯВКИ///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$("body").on("click", "#admin-registr", function(){
    $("<div id='admin-container'></div>").appendTo("#cabinett");
    var left = $(window).width()/2 - 300 + "px";            //Выравниваю по центру блок со вспомогательной информацией
    $("#admin-container").css({width: "600", left: left});   //---
    $("button, select, input").not("input[type='hidden']").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме скрытого типа
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки
    startSearchReporter();
})

$("body").on("click", "#search-reporter", function(){       //Поиск репортёра для регистрации ответа из ГИБДД
    if($("#fio-reporter").val() != ""){
        $("#table-reporter, #videos-declaration-link").empty();
        //$("#table-reporter, #videos-declaration-link").remove();
        $("#name-reporter").val($("#fio-reporter").val());
        var reporter_data = $("#form-admin-send").serializeArray();
        searchReporter(reporter_data);
        $("#name-reporter").empty();
    } else {
        alert("Нужно указать ФИО заявителя");
    }
})

$("body").on("change", ".new-dec-status", function(event){
    if($("#google-disk").val() != ""){
        $('[value="00"]', event.target).remove();   // Убираю первую строку из списка
        var google_disk = $("#google-disk").val();
        var newid = $(this).attr("newid");
        var reason = $("#hidden-reason").val();
        var data = "reason=" + reason + "&" + "google=" + google_disk + "&" + "newid=" + newid + "&" + "status=" + $(event.target).val();
        $(".table-new-status").each(function(){
            if($(this).attr("newid") == newid){
                $(this).load("server/change_declare_status.php?" + data);
            }
        })
        //alert($("#name-reporter").val());
        $("#form-google-disk").val($("#google-disk").val())
        var reporter = $("#form-admin-send").serializeArray();
        $.post("server/google_disk.php", reporter);
        $("#name-reporter").empty();
    } else {
        alert ("Нужно указать ссылку на файл в Google Disk")
    }
})

$("body").on("change", "#innocent-reasons", function(event){
    $('[value="00"]', event.target).remove();   // Убираю первую строку из списка
    $("#hidden-reason").val($(event.target).val());
})

$("body").on("click", "#close-form-admin-container", function(){
    $("#admin-container").remove();
    enableMineLinksButtons()    //в файле help.js
})

$("body").on("change", "#answer-datepicker", function (event) {
    $("#date-answer").val($("#answer-datepicker").val());  //Передаю в скрытое поле дату
});

$("body").on("click", "#new-search-reporter", function(){
    $("#title-admin, #form-admin-send, #form-admin-search").remove();
    startSearchReporter();
})

$("body").on("click", ".fio-reporter-link", function(){     //Отправляю запрос, кликая по ссылке с фамилией репортёра
    $("#name-reporter").val($(this).attr("reporter"));      //Передаю в скрытое поле ФИО репортёра
    var reporter_data = $("#form-admin-send").serializeArray();
    $(".fio-reporter-link, #new-search-reporter").remove();
    searchReporter(reporter_data);                          //Вызываю функцию поиска репортёра
})

function startSearchReporter (){
    $("<form id='form-admin-send' name='form-admin'></form>").appendTo("#admin-container");              //Форма для передачи имени репортера
    $("<input type='hidden' name='name-reporter' id='name-reporter'/>").appendTo("#form-admin-send") //Скрытое поле для передачи имени репортера
    $("<input type='hidden' name='form-google-disk' id='form-google-disk'/>").appendTo("#form-admin-send")    //Скрытое поле для передачи ссылки на файл в облаке
    $("<input type='hidden' name='date-answer' id='date-answer'/>").appendTo("#form-admin-send")    //Скрытое поле для передачи даты ответа
    $("<input type='hidden' name='hidden-reason' id='hidden-reason'/>").appendTo("#form-admin-send")    //Скрытое поле для причины отказа
    $("<div id='title-admin'>Изменение статуса заявки</div>").appendTo("#admin-container");
    $("<div id='form-admin-search'></div>").appendTo("#admin-container");
    $("<div id='videos-declaration-link'></div>").appendTo("#form-admin-search");
    $("<input type='text' id='fio-reporter' name='fio-reporter' />").appendTo("#form-admin-search");
    $("<button id='search-reporter'>Найти заявку</button><br>").appendTo("#form-admin-search");
    $("<button id='close-form-admin-container'>Закрыть</button>").appendTo("#form-admin-search");
}

function searchReporter (reporter_data){        //Функция поиска репортёра
    $.post("server/search_reporter_declare.php", reporter_data, function(data1){
        if(data1.otvet.length > 0){     //Проверяю, есть ли такой репортёр в базе данных
            if(data1.otvet.length > 1) {    //Если репортёров по указанному запросу больше одного
                $("#fio-reporter, #search-reporter, #close-form-admin-container").remove();  //Удаляю поле поиска репортёра и кноп запуска поиска репортёра, вместо них выведу ФИО репортёра
                $("<div id='fio-reporter-searched'></div>").appendTo("#form-admin-search");
                $.each(data1.otvet, function(){ //Вывожу всех репортёров, соответствующих запросу
                    $("<div class='fio-reporters'><a href='#' class='fio-reporter-link' reporter='"+this['reporter']+"'>" + this['reporter'] + "</a></div>").appendTo("#fio-reporter-searched");
                })
                $("<button id='close-form-admin-container'>Закрыть</button>").appendTo("#form-admin-search");   //Снова добавляю кноп закрытия формы
                $("<button id='new-search-reporter'>Новый поиск</button>").appendTo("#form-admin-search");
            } else {    //Если по указанному запросу найден только один репортёр
                var reporter = data1.otvet[0]['reporter'];  //Фамилия репортёра из таблицы declaration
                $("<a href='https://www.youtube.com/watch?v=" + data1.otvet[0]['videos'] + "' target='_blank'>Открыть видео</a>").appendTo("#videos-declaration-link"); //Ссылка на видео
                $("#close-form-admin-container").remove();  //Удаляю кнопку закрытия, чтобы она не оказалась вверху, ниже создам заново
                $("#fio-reporter, #search-reporter").remove();  //Удаляю поле поиска репортёра и кноп запуска поиска репортёра, вместо них выведу ФИО репортёра
                $("<div id='fio-reporter-searched'>" + reporter + "</div>").appendTo("#form-admin-search");
                $("#name-reporter").val(reporter);
                $("<textarea id='reporter-declare'></textarea><br>").appendTo("#form-admin-search");
                $("<input type='text' id='google-disk' />").appendTo("#form-admin-search");
                $("<input type='text' id='answer-datepicker' /><br>").appendTo("#form-admin-search");
                $("<select type='text' id='innocent-reasons'></select>").appendTo("#form-admin-search");
                $("<table id='table-reporter'></table>").appendTo("#form-admin-search");
                $("<button id='close-form-admin-container'>Закрыть</button>").appendTo("#form-admin-search");   //Кноп закрытия формы
                $("<button id='new-search-reporter'>Новый поиск</button>").appendTo("#form-admin-search");      //Кноп нового поиска
                $("#answer-datepicker").datepicker($.datepicker.regional["ru"]={                                //Настройка календаря
                    closeText: 'Закрыть',
                    prevText: '&#x3c;Пред',
                    nextText: 'След&#x3e;',
                    currentText: 'Сегодня',
                    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
                        'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                    monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
                        'Июл','Авг','Сен','Окт','Ноя','Дек'],
                    dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
                    dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
                    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
                    //dateFormat: 'dd.mm.yy',
                    dateFormat: 'yy-mm-dd',
                    firstDay: 1,
                    isRTL: false
                });
            }
        } else {
            alert("Записей нет")
        }
        $("#reporter-declare").text(data1.otvet[0]['dec_text']);
        $("#google-disk").val(data1.otvet[0]['google_disk'])
        $("#innocent-reasons").load("server/innocent_reasons.php");
        $.post("server/search_reporter_roadcase.php", reporter_data, function(data2){
            $.each(data2.otvet, function(){
                var newid = this['newid'];
                var carnumer = this['car_numer'];
                var dec_status = this['dec_status'];
                $("#table-reporter").append("<tr>" +
                    "<td>Номер машины</td>" +
                    "<td>Текущий</td>" +
                    "<td>Новый</td>" +
                    "<td>Изменение статуса</td></tr>" +
                    "<tr>" +
                    "<td>" + carnumer + "</td>" +
                    "<td>" + dec_status + "</td>" +
                    "<td><div class='table-new-status' newid='" + newid + "'></div></td>" +
                    "<td><select class='new-dec-status' newid = " + newid + "></select></td></tr>");
                $(".new-dec-status").load("server/declare_statuses.php")
            })
        }, "json")
    }, "json")
}

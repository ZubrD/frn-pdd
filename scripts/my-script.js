$(document).ready(function () {
    constantBlocks();
    verifySession();
    myPlace();
});

    function changecolor() {
        $(".return-to-choice").toggleClass("classmouseover")
    }

function searchMap (data, proving) {     //Функция отображения на карте результатов поиска
    var allow_comment = $("#result-search").attr("allow");  // Передаю в переменную атрибут (если пользователь зарегистрирован, то атрибут есть, если нет - то атрибута нет
                                                            // Атрибут allow передан в div result-search в файле search.js
    $.getJSON("server/search_case.php", data, function (json) {
        $("#cont-for-search-json-otvet").data("search-data", json.otvet);     //Для страницы ПОИСКА Сохраняю в элементе div массив json с результатами поиска json.otvet
        if(json.otvet.length > 0){
            var latidudes = [];
            var longitudes = [];
            $.each(json.otvet, function () {    // Получаю из сводной таблицы значения широты и долготы
                var lat = this['latitude'];      //Широта
                var long = this['longitude'];    //Долгота
                latidudes.push(lat);            //Добавляю значения широты в массив
                longitudes.push(long);
            });

            var min_lat = latidudes[0]; // Определяю минимальное и максимально значения широты
            var max_lat = latidudes[0];
            for(var i = 0; i < latidudes.length; i ++){
                if(latidudes[i] < min_lat){
                    min_lat = latidudes[i];
                }
                if(latidudes[i] > max_lat){
                    max_lat = latidudes[i];
                }
            }
            min_lat = min_lat - 1;
            max_lat = max_lat + 1;

            var min_long = longitudes[0];//Определяю минимальное и максимальное значение долготы
            var max_long = longitudes[0];
            for(var i = 0; i < longitudes.length; i ++) {
                if (longitudes[i] < min_long) {
                    min_long = longitudes[i];
                }
                if (longitudes[i] > max_long) {
                    max_long = longitudes[i];
                }
            }
            min_long = min_long - 1;
            max_long = max_long + 1;


            var myMap = new ymaps.Map("map-search",
                    {
                        //center: [60.859, 98.266],
                        //zoom: 9,
                        bounds: [[min_lat, min_long],[max_lat, max_long]] // Определяю границы отображения карты
                    },
                    {
                        searchControlProvider: 'yandex#search'
                    }
                );

            var proved_yes = 0; // Здесь суммирую одобренные видео
            var proved_no = 0;
            var proved_bad = 0;

            $.each(json.otvet, function () {        //Добавляю метки на карту
                var newid = this['newid'];
                var lat = this['latitude'];      //Широта
                var long = this['longitude'];    //Долгота
                var reg_name = this['reg_name'];
                var town_name = this['town_name'];
                var violation_pic = this['violation_pic'];
                var violation_picsize1 = parseInt(this['violation_picsize1']);
                var violation_picsize2 = parseInt(this['violation_picsize2']);
                var violation = this['violation'];
                var car_numer = this['car_numer'];
                var images = this['images'];
                var videos = this['videos'];
                var dataa = this['dataa'];
                var times = this['times'];
                var proved = this['proved'];
                var author = this['author'];
                var new_comments = this['comments'];
                var grades_yes = this['grades_yes'];
                var grades_no = this['grades_no'];
                if (proved == "yes"){
                    proved_yes = proved_yes + 1;
                } else if(proved == "no"){
                    proved_no = proved_no + 1;
                } else if(proved == "bad"){
                    proved_bad = proved_bad + 1;
                }
                var myPlacemark = new ymaps.Placemark([lat, long],
                    {
                        hintContent: violation + ': ' + car_numer,
                        balloonContent: 'Номер машины: ' + '<strong>' + car_numer + '</strong></br>' + 'Нарушение: ' + violation +
                        '</br><iframe width="300" height="200" src="https://www.youtube.com/embed/' + videos + '" frameborder="0" allowfullscreen></iframe>'

                        //iconContent: '8'
                    },{
                        iconLayout: 'default#image',
                        iconImageHref: violation_pic,
                        iconImageSize: [violation_picsize1, violation_picsize2]
                        //iconImageSize: [30, 30]
                        //preset: violation_style,
                        //iconColor: violation_color

                    });
                myMap.geoObjects.add(myPlacemark);
                var button_comment;
                if (new_comments == "yes"){ // Проверка наличия к этому событию КОММЕНТАРИЕВ (если есть - добавляю кнопку с id события)
                    button_comment = "<button class='show-comments' case_id = '" + newid + "'>Комментарии</button>";
                } else {
                    button_comment = "";
                }
                if (proving == "yes" || proving == "no"){   //Ссылки для кабинета
                    $("#table-result-search").append("<tr><td>" + dataa + "</td><td>" + times + "</td><td>" + town_name + "</td><td><a class='selected-cabinet-coords' case_id='" + newid + "' href='#'>" + car_numer + "</a></td><td>" + violation + "</td><td><div class='proved-class-" + proved + "'>" + proved + "</div></td><td>" + button_comment + "</td></tr>");
                } else if (allow_comment == "allowed") {    // Если пользователь зарегистрирован, то он может отправить комментарий
                    $("#table-result-search").append("<tr><td>" + dataa + "</td><td>" + times + "</td><td>" + town_name + "</td><td><a class='selected-search-coords' case_id='" + newid + "' href='#'>" + car_numer + "</a></td><td>" + violation + "</td><td><img class='img-comment' case_id='" + newid + "' car_numer = '" + car_numer + "' town_name = '" + town_name + "' author = '" + author + "' src='images/comment.png'></td><td><div class='grades-yes' case_id = '" + newid + "'>+" + grades_yes + "</div><img case_id='" + newid + "' class='green-sq' src='images/green_squere.png'><img case_id='" + newid + "' class='finger-up' src='images/finger_up.png'></td><td><div class='grades-no' case_id = '" + newid + "'>-" + grades_no + "</div><img case_id='" + newid + "' class='red-sq' src='images/red_squere.png'><img case_id='" + newid + "' class='finger-down' src='images/finger_down.png'></td></tr>");
                } else {                                    //Ссылки для поиска незарегистрированного пользователя
                    $("#table-result-search").append("<tr><td>" + dataa + "</td><td>" + times + "</td><td>" + town_name + "</td><td><a class='selected-search-coords' case_id='" + newid + "' href='#'>" + car_numer + "</a></td><td>" + violation + "</td><td></td></tr>");
                }
            });
            //allowComments();    //Уже оставлял комментарии по этому событию?
            //ownComments();      //Это моё видео?
            //allowAssessment();  //Оценил видео?
        } else {

            alert("По этим условиям ничего не найдено, уточните параметры поиска!!!");
            clearSearchResult();    //Функция обнуления результатов поиска из search.js
        }

        //$("<div id='cont-for-search-json-otvet'></div>").appendTo("#page-searchh");   //Перенёс в файл search.js

        if(proving == "yes"){   //Если функция была вызвана для кабинета, то создаются эти элементы
            $("<table id='proved_sum'><tr><td><span>Подтверждённые</span></td><td><span>Неподтверждённые</span></td><td><span>Отклонённые</span></td></tr>" +
                "<tr><td><button id='button-proved-yes'>Скрыть</button></td><td><button id='button-proved-no'>Скрыть</button></td><td><button id='button-proved-bad'>Скрыть</button></td></tr>" +
                "<tr><td class='number-yes'>" + proved_yes + "</td><td class='number-no'>" + proved_no + "</td><td class='number-bad'>" + proved_bad + "</td></tr></table>").insertBefore("#map-search")/*.appendTo("#cabinett")*/;
            $("#button-proved-yes").data("test", {flag: "unpushed"});
            $("#button-proved-no").data("test", {flag: "unpushed"});
            $("#button-proved-bad").data("test", {flag: "unpushed"});
            $("<div id='cont-for-json-otvet'></div>").appendTo("#cabinett");
            $("#cont-for-json-otvet").data("cabinet-data", json.otvet);     //Для КАБИНЕТА Сохраняю в элементе div массив json с результатами поиска json.otvet
        }
    })
}

function verifySession() {                          //Проверка наличия переменной сессии
    $.post("server/verify_login.php", "0", function (data) {
        //$("<div id='page-start'></div>").appendTo("body");
        $("<div id='page-start'></div>").appendTo("#main-container");
        if(data == 111){                            // если переменная есть, то вместо "Вход" будет "Выход"
            $("<button id='new-button-cabinet'>Мой кабинет</button>").appendTo("#page-start");
            $("<button id='new-button-logout'>Выход</button>").appendTo("#page-start");
            startingPageLogined();
        } else if(data == 000){
            $("<button id='new-button-login'>Вход</button>").appendTo("#page-start");
            $("<button id='button-registr'>Регистрация</button>").appendTo("#page-start");
            startingPage();
        }
    });
}

function topInfo() {
    $.get("server/top_info.php", "000", function (data) {
        $("#span-to-cases").text(data);
    })
}

setInterval(function () {
    $.get("server/top_info.php", "000", function (data) {
        $("#span-top-cases").text(data);
    });
    $.get("server/penalty.php", "000", function(data_sum){
        $("#span-top-sum").text(data_sum);
        $("#span-currency").text(" рублей");
    });
    $.get("server/top_dec.php", "000", function (data) {
        $("#span-top-dec").text(data);
    });
    $.get("server/top_viol.php", "000", function (data) {
        $("#span-top-viol").text(data);
        $("#a-report-detailed").remove();    //Удаляю прошлую ссылку на подробную роспись
        $("<a href='#' id='a-report-detailed'>Подробнее</a>").appendTo("#report-detailed");   //Как только появятся данные с сервера, добавляю ссылку на подробную роспись
    });
    $.get("server/top_seven_dec.php", "000", function (data) {
        $("#span-seven-dec").text(data);
    });
    $.get("server/top_seven_viol.php", "000", function (data) {
        $("#span-seven-viol").text(data);
        $("#a-7-detailed").remove();    //Удаляю прошлую ссылку на подробную роспись
        $("<a href='#' id='a-7-detailed'>Подробнее</a>").appendTo("#div-7-detailed");   //Как только появятся данные с сервера, добавляю ссылку на подробную роспись
    });
}, 10000);

$("body").on("click", "#return-to-choice, #new-button-logout", function () {    //Возврат на Главную страницу либо после нажатия кнопа "На главную", либо на кноп "Выход" в кабинете
    returnToChoice();
});

function returnToChoice (){
    $("#return-to-choice").hide();
    $("#container-carnumer-search, #cabinett, #page-searchh, #page-insertt, #container-map-town").remove();
    $("<div id='container-map-town'></div>").appendTo("#main-container");
    $("<div id='map-town'></div>").appendTo("#container-map-town");
    $("#new-button-search, #link-carnumer-top-search").removeClass("disabled");    //Снова делаю активной ссылки расширенного поиска и поиска по номеру
    topInfo();
    getDataForMapMyTown (); //При возвращении на главную страницу загружаю карту с городом, выбранным пользователем
    leaveBanInsert();   //Удаляю событие запрета вставки при наведении мыши на кноп Вставить (cabinet.js)
}

/*function constantBlocks() {
    $("<div id='top-info'></div>").appendTo("body");
    $("<div id='site-title'>Федеральный регистратор нарушенией ПДД</div>").appendTo("#top-info");
    $("<div id='total-violation'>Выявлено нарушений <span id='span-top-cases'></span></div>").appendTo("#top-info");
    $("<div id='total-penalty'>на сумму <span id='span-top-sum'></span><span id='span-currency'></span></div>").appendTo("#top-info");
    $("<div id='top-search'></div>").appendTo("body");
    $("<table id='table-carnumer-top-search'></table>").appendTo("#top-search");
    $("<tr><td><span id='span-carnumer-top-search'><a id='link-carnumer-top-search' href='#' >Проверить машину</a></span><br /><span id='span-carnumer-top-search-2'><a id='new-button-search' href='#'>Расширенный поиск</a></span></td><td><input type='text' id='input-carnumer-top-search' name='input-carnumer-top-search' placeholder='x000xx000'/></td><td><span id='text-carnumer-top-search'></span></td></tr>").appendTo("#table-carnumer-top-search");
    $("<div id='container-return'></div>").appendTo("body");
    $("<div id='help'><a id='help-link' href='#'>Помощь</a></div>").appendTo("body");
    $("<button id='return-to-choice'>На главную</button>").appendTo("#container-return");
    $("<form id='form-top-search' name='form-top-searc'></form>").appendTo("#top-search");
    $("<input type='hidden' name='hidden-carnumer' id='hidden-carnumer' />").appendTo("#form-top-search");  // Скрытое поле для сериализации данных
    $("<div id='container-map-town'></div>").appendTo("body");      //Контейнер для карты
    $("<div id='map-town'></div>").appendTo("#container-map-town"); //Карта города по умолчанию
}*/

function constantBlocks() {
    $("<div id='main-container'></div>").appendTo("body");
    $("<div id='top-info'></div>").appendTo("#main-container");
    $("<div id='site-title'>Федеральный регистратор нарушенией ПДД</div>").appendTo("#top-info");
    $("<div id='total-violation'>Выявлено <span id='span-top-cases'></span> нарушений на сумму <span id='span-top-sum'></span><span id='span-currency'></span></div>").appendTo("#top-info");
    $("<div id='total-penalty'>В ГИБДД направлено <span id='span-top-dec'></span> заявлений по <span id='span-top-viol'></span> нарушениям<div id='report-detailed'></div></div>").appendTo("#top-info");
    $("<div id='last-seven'>из них за последние 7 дней <span id='span-seven-dec'></span> заявлений по <span id='span-seven-viol'></span> нарушениям<div id='div-7-detailed'></div></div>").appendTo("#top-info");
    $("<div id='top-search'></div>").appendTo("#main-container");
    $("<table id='table-carnumer-top-search'></table>").appendTo("#top-search");
    $("<tr><td><span id='span-carnumer-top-search'><a id='link-carnumer-top-search' href='#' >Проверить машину</a></span><br /><span id='span-carnumer-top-search-2'><a id='new-button-search' href='#'>Расширенный поиск</a></span></td><td><input type='text' id='input-carnumer-top-search' name='input-carnumer-top-search' placeholder='x000xx000'/></td><td><span id='text-carnumer-top-search'></span></td></tr>").appendTo("#table-carnumer-top-search");
    $("<div id='container-return'></div>").appendTo("#main-container");
    $("<div id='help'><a id='help-link' href='#'>Помощь</a></div>").appendTo("#main-container");
    $("<button id='return-to-choice'>На главную</button>").appendTo("#container-return");
    $("<form id='form-top-search' name='form-top-searc'></form>").appendTo("#top-search");
    $("<input type='hidden' name='hidden-carnumer' id='hidden-carnumer' />").appendTo("#form-top-search");  // Скрытое поле для сериализации данных
    $("<div id='container-map-town'></div>").appendTo("#main-container");      //Контейнер для карты
    $("<div id='map-town'></div>").appendTo("#container-map-town"); //Карта города по умолчанию
}

function disableMineLinksButtons (){
    $("button, select, input").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода
    $("a, img").not(".helps").addClass("disabled");  //Дезактивирую все ссылки кроме тех, что с классом helps
}

function enableMineLinksButtons (){
    $("button, select, input").removeAttr("disabled");  //Восстанавливаю кнопы, элементы выбора, поля ввода
    $("a, img").removeClass("disabled"); //Восстанавливаю ссылки
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////ПОДРОБНАЯ РОСПИСЬ ЗАЯВЛЕНИЙ ПО СЕМИ ДНЯМ//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$("body").on("click", "#a-7-detailed", function(){
    $("button, select, input").not("input[type='hidden']").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме скрытого типа
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки
    $("<div id='container-7-detailed'></div>").appendTo("#main-container");
    $("<img id='close-7-detailed' src='images/close.png' />").appendTo("#container-7-detailed");
    $("<h3>Заявления за последние семь дней</h3>").appendTo("#container-7-detailed");
    $("<table id='table-7-detailed'></table>").appendTo("#container-7-detailed");
    $("<tr id='table-7-detailed-head'><td>Оформлено</td><td>Город</td><td>Номер машины</td><td>Нарушение</td></tr>").appendTo("#table-7-detailed");
    var left = $(window).width()/2 - 350 + "px";            //Выравниваю по центру блок со вспомогательной информацией
    $("#container-7-detailed").css({width: "700", left: left});   //
    $.get("server/seven_detailed.php", "000", function (data) {
        var head_dataa = data.details[0]['dataa']
        $("<tr><td>"+head_dataa+"</td><td></td><td></td><td></td></tr>").appendTo("#table-7-detailed");
        for(var i = 0; i  < data.details.length; i ++){
            var dataa = data.details[i]['dataa'];
            var town = data.details[i]['town'];
            var car_numer = data.details[i]['car_numer'];
            var violation = data.details[i]['violation'];
            if (head_dataa == dataa){
                $("<tr>" +
                    "<td></td><td>"+town+"</td><td>"+car_numer+"</td><td>"+violation+"</td>" +
                    "</tr>").appendTo("#table-7-detailed");
            } else  {
                head_dataa = dataa;     //Если дата изменилась, начинается новый день
                $("<tr><td>"+head_dataa+"</td><td></td><td></td><td></td></tr>").appendTo("#table-7-detailed");
                $("<tr>" +
                    "<td></td><td>"+town+"</td><td>"+car_numer+"</td><td>"+violation+"</td>" +
                    "</tr>").appendTo("#table-7-detailed");
            }
        }
    }, "json");

})

$("body").on("click", "#close-7-detailed", function(){    //Закрываю блок с вопросами и ответами
    $("#container-7-detailed").remove();
    enableMineLinksButtons();   //Восстанавливаю ссылки и кнопы
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////ПОДРОБНАЯ РОСПИСЬ ЗАЯВЛЕНИЙ ПО ГОРОДАМ/////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$("body").on("click", "#a-report-detailed", function(){
    $("button, select, input").not("input[type='hidden']").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме скрытого типа
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки
    $("<div id='container-report-detailed'></div>").appendTo("#main-container");
    var left = $(window).width()/2 - 400 + "px";            //Выравниваю по центру блок со вспомогательной информацией
    $("#container-report-detailed").css({width: "800", left: left});   //
    $("<img id='close-report-detailed' src='images/close.png' />").appendTo("#container-report-detailed");
    $("<img id='loadImg' src='images/ajax_loader.gif' />").appendTo("#container-report-detailed");
    $("<h3>Распределение заявлений по городам</h3>").appendTo("#container-report-detailed");
    $("<table id='table-report-detailed'></table>").appendTo("#container-report-detailed");
    $("<tr id='table-report-detailed-head'>" +
        "<td>Город</td><td>Всего</td><td>Направлено</td><td>Возбуждено дело</td><td>Виновен</td><td>Оправдан</td><td>Без внимания</td><td>Отписка</td></tr>" +
        "<tr>" +
        "<td></td>" +
        "<td><img class='img-sorting' sort_factor='cases' sort_order='desc' src='images/sort.png'></td>" +
        "<td><img class='img-sorting' sort_factor='cases_sended' sort_order='desc' src='images/sort.png'></td>" +
        "<td><img class='img-sorting' sort_factor='cases' sort_order='desc' src='images/sort.png'></td>" +
        "<td><img class='img-sorting' sort_factor='cases' sort_order='desc' src='images/sort.png'></td>" +
        "<td><img class='img-sorting' sort_factor='cases' sort_order='desc' src='images/sort.png'></td>" +
        "<td><img class='img-sorting' sort_factor='cases' sort_order='desc' src='images/sort.png'></td>" +
        "<td><img class='img-sorting' sort_factor='cases' sort_order='desc' src='images/sort.png'></td>" +
        "</tr>").appendTo("#table-report-detailed");
    startLoadingAnimation();
    var data_sort = "sort_factor=000"
    reportDetailedSort(data_sort);  // Вызываю функцию сортировки по аргументу, указанному в переменной data_sort
})

$("body").on("click", ".img-sorting", function(){
    $(".report-detailed-rows").remove();
    var sort_factor = $(this).attr("sort_factor");
    var sort_order = $(this).attr("sort_order");
    var data= "sort_factor="+sort_factor+"&sort_order="+sort_order;
    reportDetailedSort(data);
    if ($(this).attr("sort_order") == "desc"){
        $(this).attr({sort_order: "asc"});
    } else {
        $(this).attr({sort_order: "desc"});
    }
    // Здесь будет проверка атрибута sort_factor у тега img, и если он будет desc, поменяю его на asc и наоборот
    // Придумать способ удаления
})

$("body").on("click", "#close-report-detailed", function(){    //Закрываю блок с вопросами и ответами
    $("#container-report-detailed").remove();
    enableMineLinksButtons();   //Восстанавливаю ссылки и кнопы
})

function reportDetailedSort (data_sort){
    $.get("server/report_detailed.php", data_sort, function(data){
        stopLoadingAnimation();
        for(var i = 0; i < data.otvet.length; i ++){
            var town = data.otvet[i]['town'];
            var total_case = data.otvet[i]['cases'];
            var sended = data.otvet[i]['cases_sended'];
            var yes = data.otvet[i]['cases_yes'];
            var no = data.otvet[i]['cases_no'];
            var ignor = data.otvet[i]['cases_ignor'];
            var joke = data.otvet[i]['cases_joke'];
            var excited = data.otvet[i]['cases_excited'];
            $("<tr class='report-detailed-rows'><td>"+town+"</td><td>"+total_case+"</td><td>"+sended+"</td><td>"+excited+"</td><td>"+yes+"</td><td>"+no+"</td><td>"+ignor+"</td><td>"+joke+"</td></tr>").appendTo("#table-report-detailed");
        }
    }, "json")
}

function startLoadingAnimation() {  // - функция запуска анимации

    // найдем элемент с изображением загрузки и уберем невидимость:
    var imgObj = $("#loadImg");
    imgObj.show();

    // вычислим в какие координаты нужно поместить изображение загрузки,
    // чтобы оно оказалось в серидине страницы:
    var centerY = $(window).scrollTop() + ($(window).height() + imgObj.height())/2;
    var centerX = $(window).scrollLeft() + ($(window).width() + imgObj.width())/2;

    // поменяем координаты изображения на нужные:
    imgObj.offset({top:centerY, left:centerX});
}

function stopLoadingAnimation() // - функция останавливающая анимацию
{
    $("#loadImg").hide();
}

$("body").on("click", "#new-button-search", function () {
    $("#container-map-town, #cabinett, #container-carnumer-search, #page-insertt").remove();
    $("#return-to-choice").show();
    $("#new-button-search").addClass("disabled");   //Делаю неактивной ссылку расширенного поиска
    $("<div id='page-searchh'></div>").appendTo("#main-container");
        $("<div id='selections-search'></div>").appendTo("#page-searchh");
            $("<table id='table-selections-search'>" +
                "<tr><td>" +
                    "<select id='select-regions-search'></select><select id='select-towns-search'></select>" +
                    "<select id='select-violation-search'></select>" +
                    "<label for='car-numer-search' id='label-carnumer-search' >Номер машины: </label>" +
                    "<input type='text' name='car-numer-search' id='car-numer-search' placeholder='х000хх000'/><br></td></tr>" +
                "<tr><td>" +
                    "<label for='search-from' id='label-date-search'>Дата: с </label>" +
                    "<input type='text' class='datepicker-search' name='search-date-from' id='search-date-from' />" +
                    "<label for='search-to'>по </label>" +
                    "<input type='text' class='datepicker-search' name='search-date-to' id='search-date-to' />" +
                    "<label for='time-from' id='label-time-search'>Время: с </label>" +
                    "<input type='text' class='timepicker-search' name='search-time-from' id='search-time-from' />" +
                    "<label for='time-to'>по: </label>" +
                    "<input type='text' class='timepicker-search' name='search-time-to' id='search-time-to' /></td></tr>" +
                "<tr><td>" +
                    "<label for='declaration-status'>Заявления в ГИБДД: </label>" +
                    "<select id='declaration-status'></select><br /></td></tr>" +
                "<tr><td>" +
                    "<button id='send-data-search'>Запрос</button>" +
                    "<button id='clear-choice'>Сброс</button></td></tr></table>").appendTo("#selections-search");

        $("<form name='case-search' id='case-search' method='post'></form>").appendTo("#page-searchh");
            $("<input type='hidden' name='region-search' id='region-search' />").appendTo("#case-search");
            $("<input type='hidden' name='town-search' id='town-search' />").appendTo("#case-search");
            $("<input type='hidden' name='violation-search' id='violation-search' />").appendTo("#case-search");
            $("<input type='hidden' name='dbcar-numer-search' id='dbcar-numer-search' />").appendTo("#case-search");
            $("<input type='hidden' name='date-from' id='date-from' />").appendTo("#case-search");
            $("<input type='hidden' name='date-to' id='date-to' />").appendTo("#case-search");
            $("<input type='hidden' name='time-from' id='time-from' />").appendTo("#case-search");
            $("<input type='hidden' name='time-to' id='time-to' />").appendTo("#case-search");
            $("<input type='hidden' name='dbcar-author-search' id='dbcar-author-search' />").appendTo("#case-search");
            $("<input type='hidden' name='proved-yes-search' id='proved-yes-search' />").appendTo("#case-search");
            $("<input type='hidden' name='proved-no-search' id='proved-no-search' />").appendTo("#case-search");
            $("<input type='hidden' name='proved-bad-search' id='proved-bad-search' />").appendTo("#case-search");
            $("<input type='hidden' name='dec-status' id='dec-status' />").appendTo("#case-search");

        $("<div id='map-search'></div>").appendTo("#page-searchh");
        $("<div id='cont-for-search-json-otvet'></div>").appendTo("#page-searchh"); //Контейнер для сохранения результатов поиска
        $("<div id='result-search' region_name='' town_name='' violation_name='' carnumer='' date_from='' date_to='' time_from='' time_to='' dec_status=''></div>").appendTo("#page-searchh");
        $("<table id='table-result-search'></table>").appendTo("#page-searchh");
        $("<table><tr><td id='search-paging'></td></tr></table>").appendTo("#page-searchh");    //Таблица для номеров страниц, на которые разбит результат поиска

    $("#search-date-from, #search-date-to").datepicker($.datepicker.regional["ru"]={      //Настройка календаря
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
    $("#search-time-from, #search-time-to").timepicker({     //Настройка формы ввода времени
        hourText: 'Часы',
        minuteText: 'Минуты',
        amPmText: ['', ''],
        minutes: {
            interval: 1
        }
    });
    $("#select-regions-search").load("server/regions.php");
    $("#select-violation-search").load("server/violations.php");
    $("#declaration-status").load("server/declare_statuses.php");
    verifySessionForComment();  // Если пользователь зарегистрирован, то добавляю атрибут в контейнер result-search
});

$("body").on("change", "#select-regions-search", function (event) {
    //$("#select-violation-search").load("server/violations.php"); // Загружаю список нарушений для нового запроса
    $("#region-search").val($(event.target).val()); // Передаю в скрытое поле input id региона
    $("#town-search").val("");                      //На всякий случай обнуляю скрытое поле id города
    $("#result-search").attr({region_name: $("#select-regions-search :selected").prop("text")}); //Название выбранного региона (для заголовка таблицы результатов)
    $("#result-search").attr({town_name: ""}); //Обнуляю название выбранного города (для заголовка таблицы результатов)
    $('[value="00"]', event.target).remove();   // Убираю строчку Select region из списка
    var data = "data=" + $(event.target).val();     //Данные для отправки запроса GET на сервер; val - это значение value выбранного тега option
    $("#select-towns-search").load("server/towns.php?" + data); // Загружаю города этого региона
});

$("body").on("change", "#select-towns-search", function (event) {
    $("#town-search").val($(event.target).val()); // Передаю в скрытое поле input id города
    $("#result-search").attr({town_name: $("#select-towns-search :selected").prop("text")}); //Название выбранного города (для заголовка таблицы результатов)
    $('[value="00"]', event.target).remove();   // Убираю строку Select town из списка
});

$("body").on("change", "#select-violation-search", function (event) {
    $("#violation-search").val($(event.target).val());//Передаю в скрытое поле id нарушения
    $("#result-search").attr({violation_name: $("#select-violation-search :selected").prop("text")}); //Название выбранного нарушения (для заголовка таблицы результатов)
    $('[value="00"]', event.target).remove();   // Убираю строчку Select region из списка
});

$("body").on("change", "#declaration-status", function(event){
    $('[value="00"]', event.target).remove();   // Убираю строчку Select region из списка
    $("#dec-status").val($(event.target).val())//Передаю в скрытое поле статус заявления
    $("#result-search").attr({dec_status: $("#declaration-status :selected").prop("text")}); //Статус заявления в ГИБДД (для заголовка таблицы результатов)
})

// Проверка номера госрегистрации автомобиля при поиске в базе данных
$("body").on("blur", "#car-numer-search", function () {
    var shablon = /^[авекмнорстух]\d{3}[авекмнорстух]{2}\d{2}(\d)?$/;
    if(!shablon.test($("#car-numer-search").val())){
        alert("Номер не соответствует шаблону!!!");
        $("#car-numer-search").val("");
        $("#result-search").attr({carnumer: ""}); //Обнуляю номер машины (для заголовка таблицы результатов)
    } else {
        $("#result-search").attr({carnumer: $("#car-numer-search").val()}); //Номер машины (для заголовка таблицы результатов)
    }
});

$("body").on("change", "#search-date-from", function (event) {
    $("#search-date-from").removeClass("picker-notformat"); //Удаляю класс, в которм цвет текста - красный
    var shablon = /^\d{4}-\d{2}-\d{2}$/;
    if(!shablon.test($("#search-date-from").val())){
        $("#date-from").val("");    //Обнуляю скрытое поле передачи значения начала интервала дат
        $("#search-date-from").addClass("picker-notformat"); //Добавляю класс, в которм цвет текста - красный
        $("#search-date-from").val("Неформат");                  //В поле ввода даты отображаю слово "Неформат"
        $("#result-search").attr({date_from: ""}); //Обнуляю начальную дату (для заголовка таблицы результатов)
    } else {
        $("#date-from").val($(event.target).val());  //Передаю в скрытое поле дату
        $("#result-search").attr({date_from: $("#search-date-from").val()}); //Исходная дата (для заголовка таблицы результатов)
    }
});

$("body").on("change", "#search-date-to", function (event) {
    $("#search-date-to").removeClass("picker-notformat"); //Удаляю класс, в которм цвет текста - красный
    var shablon = /^\d{4}-\d{2}-\d{2}$/;
    if(!shablon.test($("#search-date-to").val())){
        $("#date-to").val("");    //Обнуляю скрытое поле передачи значения начала интервала дат
        $("#search-date-to").addClass("picker-notformat"); //Добавляю класс, в которм цвет текста - красный
        $("#search-date-to").val("Неформат");                  //В поле ввода даты отображаю слово "Неформат"
        $("#result-search").attr({date_to: ""}); //Обнуляю конечную дату (для заголовка таблицы результатов)
    } else {
        $("#date-to").val($(event.target).val());  //Передаю в скрытое поле дату
        $("#result-search").attr({date_to: $("#search-date-to").val()}); //Конечная дата (для заголовка таблицы результатов)
    }
});

$("body").on("change", "#search-time-from", function(){
    $("#search-time-from").removeClass("picker-notformat"); //Удаляю класс, в которм цвет текста - красный
    var shablon = /^(([0,1][0-9])|(2[0-3])):[0-5][0-9]$/;
    if(!shablon.test($("#search-time-from").val())){
        $("#time-from").val("");//Очищаю скрытое поле
        $("#search-time-from").addClass("picker-notformat"); //Добавляю класс, в которм цвет текста - красный
        $("#search-time-from").val("Не то");
        $("#result-search").attr({time_from: ""}); //Обнуляю время начала (для заголовка таблицы результатов)
    } else {
        $("#time-from").val($("#search-time-from").val());  //Передаю в скрытое поле время
        $("#result-search").attr({time_from: $("#search-time-from").val()}); //Начало временного интервала (для заголовка таблицы результатов)
    }
});

$("body").on("change", "#search-time-to", function(){
    $("#search-time-to").removeClass("picker-notformat"); //Удаляю класс, в которм цвет текста - красный
    var shablon = /^(([0,1][0-9])|(2[0-3])):[0-5][0-9]$/;
    if(!shablon.test($("#search-time-to").val())){
        $("#time-to").val("");//Очищаю скрытое поле
        $("#search-time-to").addClass("picker-notformat"); //Добавляю класс, в которм цвет текста - красный
        $("#search-time-to").val("Не то");
        $("#result-search").attr({time_to: ""}); //Обнуляю время конца (для заголовка таблицы результатов)
    } else {
        $("#time-to").val($("#search-time-to").val());  //Передаю в скрытое поле время
        $("#result-search").attr({time_to: $("#search-time-to").val()}); //Конец временного интервала (для заголовка таблицы результатов)
    }
});

$("body").on("click", "#send-data-search", function () {
    $("#map-search").empty();//Очищаю место для новой карты
    $("#table-result-search").empty();//Очищаю место для вывода данных по результатам поиска (сбоку от карты)
    $("#search-paging").empty();                   //Удаляю таблицу разбиения на страницы
    $("#dbcar-numer-search").val($("#car-numer-search").val());//Предаю в скрытое поле значение номера машины
    //$("#dec-status").val($("#declaration-status").val());//Предаю в скрытое поле статус заявления в ГИБДД
    var data = $("#case-search").serializeArray();
    var proving = "000";
    searchMapPaging(data, 1);    //Третий аргумент функции - это номер выводимой страницы (по умолчанию - первый)
    resultSearchHeadline();
});


$("body").on("click", ".selected-search-coords", function () { // Вывожу нарушение в центре карты. ЭТО ДЛЯ СТРАНИЦЫ ПОИСКА!!!
    $("#map-search").empty();
    $(this).closest("tr").siblings().removeClass("selected-row");   //Удаляю класс selected-row у всех строк таблицы
    $(this).closest("tr").addClass("selected-row"); //Присваиваю класс selected-row ближайшему к нажатой ссылке тегу tr
    var selected_case_id = $(this).attr("case_id");
    var data = "000";
    var page = $(this).attr("page");
    var lat = $(this).attr("lat");
    var long = $(this).attr("long");
    searchMapPaging(data, page, lat, long);
    //var array_selected_case = $("#cont-for-search-json-otvet").data("search-data");
    //searchMapSelected(array_selected_case, selected_case_id);
});

function searchMapSelected (data, selected) {     //Отображение на карте результатов поиска и в центре карты выбранного (клик по ссылке) места события
    var center_lat;
    var center_long;
    $.each(data, function () {
        var newid = this['newid'];
        if (newid == selected){                 //Если id события из БД совпадает с id ссылки, то это событие указывается в центре карты
            center_lat = this['latitude'];      //Широта центральной точки
            center_long = this['longitude'];    //Долгота
        }
    });
    var myMap = new ymaps.Map("map-search",

        {
            center: [center_lat, center_long],
            zoom: 19,
        },
        {
            searchControlProvider: 'yandex#search'
        }
    );

    $.each(data, function () {        //Добавляю метки на карту
        var newid = this['newid'];
        var lat = this['latitude'];      //Широта
        var long = this['longitude'];    //Долгота
        var violation = this['violation'];
        var violation_pic = this['violation_pic'];
        var violation_picsize1 = parseInt(this['violation_picsize1']);
        var violation_picsize2 = parseInt(this['violation_picsize2']);
        var car_numer = this['car_numer'];
        var videos = this['videos'];

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
    });
}

$("body").on("click", "#clear-choice", function () {    //Сброс параметров запроса и очистка полей списков параметров
    clearSearchResult();
});

function clearSearchResult (){                          //Функция обнуления результатов запроса
    $("#select-regions-search").load("server/regions.php");
    $("#select-towns-search").load("server/towns.php");
    $("#select-violation-search").load("server/violations.php");
    $("#declaration-status").load("server/declare_statuses.php");
    //$("#region-search, #town-search, #violation-search, #dbcar-numer-search, #dbcar-author-search, #car-numer-search").val("");
    $("#region-search, #town-search, #violation-search, #dbcar-numer-search, #car-numer-search, #dec-status").val("");       //Когда добавил в обнуление dbcar-author-search, у меня нарушилась работа кабинета из-за обнуления поля владельца кабинета
    $("#search-date-from, #date-from, #search-date-to, #date-to, #search-time-from, #time-from, #search-time-to, #time-to, #declaration-status").val("");
    $("#result-search").attr({region_name: ""});    //Обнуляю атрибуты контейнера, где сохраняю результаты выбора
    $("#result-search").attr({town_name: ""});      //------------
    $("#result-search").attr({violation_name: ""}); //------------
    $("#result-search").attr({carnumer: ""}); //------------
    $("#result-search").attr({date_from: ""}); //------------
    $("#result-search").attr({date_to: ""}); //------------
    $("#result-search").attr({time_from: ""}); //------------
    $("#result-search").attr({time_to: ""}); //------------
    $("#result-search").attr({dec_status: ""}); //------------
    $("#table-headline-search").empty();           //Удаляю таблицу с заголовками выбора
    $("#table-result-search").empty();             //Удаляю таблицу с результатами поиска
    $("#search-paging").empty();                   //Удаляю таблицу разбиения на страницы
    $("#map-search").empty();                       //Очищаю место для новой карты
}

function verifySessionForComment() {    //Функция проверки входа зарегистрированного пользователя
    $.post("server/verify_login.php", "0", function (data) {
        if (data == "111"){
            $("#result-search").attr({allow: "allowed"}); // Если пользователь зарегистрирован, то добавляю в div result-search атрибут allow
        }
    });
}

function resultSearchHeadline (){       //Заголовки таблицы с результатами выбора, по которым производится фильтрация данных
    $("#table-headline-search").remove();
    var region_hedl;
    var town_hedl;
    var violation_hedl;
    var carnumer_hedl;
    var date_hedl;
    var time_hedl;
    if($("#result-search").attr("region_name")){   //Если не выбирали или обнуляли
        region_hedl = $("#result-search").attr("region_name");
    } else {
        region_hedl = "Все регионы";
    }
    if($("#result-search").attr("town_name")){   //Если не выбирали или обнуляли
        town_hedl = $("#result-search").attr("town_name");
    } else {
        town_hedl = "Все города";
    }
    if($("#result-search").attr("violation_name")){   //Если не выбирали или обнуляли
        violation_hedl = $("#result-search").attr("violation_name");
    } else {
        violation_hedl = "Все нарушения";
    }
    if($("#result-search").attr("carnumer")){   //Если не выбирали или обнуляли
        carnumer_hedl = $("#result-search").attr("carnumer");
    } else {
        carnumer_hedl = "Все номера";
    }
    if($("#result-search").attr("date_from") && $("#result-search").attr("date_to") == ""){
        date_hedl = "с " + $("#result-search").attr("date_from");
    } else if ($("#result-search").attr("date_from") == "" && $("#result-search").attr("date_to")) {
        date_hedl = "по " + $("#result-search").attr("date_to");
    } else if ($("#result-search").attr("date_from") && $("#result-search").attr("date_to")){
        date_hedl = "с " + $("#result-search").attr("date_from") + " по " + $("#result-search").attr("date_to");
    } else {
        date_hedl = "Любая дата";
    }
    if($("#result-search").attr("time_from") && $("#result-search").attr("time_to") == ""){
        time_hedl = "с " + $("#result-search").attr("time_from");
    } else if ($("#result-search").attr("time_from") == "" && $("#result-search").attr("time_to")) {
        time_hedl = "по " + $("#result-search").attr("time_to");
    } else if ($("#result-search").attr("time_from") && $("#result-search").attr("time_to")){
        time_hedl = "с " + $("#result-search").attr("time_from") + " по " + $("#result-search").attr("time_to");
    } else {
        time_hedl = "Любое время";
    }
    if($("#result-search").attr("dec_status")){   //Если не выбирали или обнуляли
        dec_hedl = $("#result-search").attr("dec_status");
    } else {
        dec_hedl = "Все статусы";
    }

    $("<table id='table-headline-search'></table>").insertAfter("#map-search");
    $("<tr><td>Регион: </td><td class='search-headline'>" + region_hedl + "</td></tr>").appendTo("#table-headline-search");
    $("<tr><td>Город: </td><td class='search-headline'>" + town_hedl + "</td></tr>").appendTo("#table-headline-search");
    $("<tr><td>Нарушение: </td><td class='search-headline'>" + violation_hedl + "</td></tr>").appendTo("#table-headline-search");
    $("<tr><td>Номер машины: </td><td class='search-headline'>" + carnumer_hedl + "</td></tr>").appendTo("#table-headline-search");
    $("<tr><td>Дата: </td><td class='search-headline'>" + date_hedl + "</td></tr>").appendTo("#table-headline-search");
    $("<tr><td>Время: </td><td class='search-headline'>" + time_hedl + "</td></tr>").appendTo("#table-headline-search");
    $("<tr><td>Заявление в ГИБДД: </td><td class='search-headline'>" + dec_hedl + "</td></tr>").appendTo("#table-headline-search");
}

function searchMapPaging (data, page, center_lat, center_long) {     //Функция отображения на карте результатов поиска
    var allow_comment = $("#result-search").attr("allow");  // Передаю в переменную атрибут (если пользователь зарегистрирован, то атрибут есть, если нет - то атрибута нет// Атрибут allow передан в div result-search в файле search.js
    var jsonotvet;
    if (data == "000"){
        jsonotvet = $("#cont-for-search-json-otvet").data("search-data");
        if(jsonotvet.length > 0 && jsonotvet.length <= 200){
/////////////////////////////////////////////////////////////////////////////////////

            var pages = page;
            var rows_per_page = 10; //Количество строк на странице
            var num_pages;          //количество страниц (вычисляется ниже)
            var start_point = rows_per_page * (pages - 1);  //Первая запись на странице
            var end_point;                                  //Последняя запись на странице
            var total_rows = jsonotvet.length;             //Общее количенство записей
            if (Math.floor(total_rows/rows_per_page) < (total_rows/rows_per_page)){
                num_pages = Math.floor(total_rows/rows_per_page) + 1
            } else {
                num_pages = Math.floor(total_rows/rows_per_page);
            }
            if (page == num_pages){
                end_point = jsonotvet.length;  //Если количество страниц равно номеру страницы, переданному как аргумент функции,
                //то конечной точкой является общее количество элементов массива
            } else {
                end_point = rows_per_page * pages;
            }

//////////////////////////////////////////////////////////////////////////////////////////////////
            var latidudes = [];
            var longitudes = [];

            for (var i = start_point; i < end_point; i ++){
                var lat = jsonotvet[i].latitude;      //Широта
                var long = jsonotvet[i].longitude;    //Долгота
                latidudes.push(lat);            //Добавляю значения широты в массив
                longitudes.push(long);
            }

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
            if(typeof center_lat == "undefined"){
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
            } else {
                var myMap = new ymaps.Map("map-search",

                    {
                        center: [center_lat, center_long],
                        zoom: 19,
                    },
                    {
                        searchControlProvider: 'yandex#search'
                    }
                );
            }

            for(var i = start_point; i < end_point; i ++) {        //Добавляю метки на карту
                var newid = jsonotvet[i].newid;
                var lat = jsonotvet[i].latitude;      //Широта
                var long = jsonotvet[i].longitude;    //Долгота
                var reg_name = jsonotvet[i].reg_name;
                var town_name = jsonotvet[i].town_name;
                var violation_pic = jsonotvet[i].violation_pic;
                var violation_picsize1 = parseInt(jsonotvet[i].violation_picsize1);
                var violation_picsize2 = parseInt(jsonotvet[i].violation_picsize2);
                var violation = jsonotvet[i].violation;
                var car_numer = jsonotvet[i].car_numer;
                var images = jsonotvet[i].images;
                var videos = jsonotvet[i].videos;
                var denj = jsonotvet[i].denj;         //День инцидента
                var dataa = jsonotvet[i].dataa;         //День заявления
                var dif_date = jsonotvet[i].dif_date;   //Прошло дней от подачи заявления
                var limit_of_action = jsonotvet[i].limit_of_action;   //Осталось дней до истечения срока исковой давности
                var times = jsonotvet[i].times;
                var proved = jsonotvet[i].proved;
                var author = jsonotvet[i].author;
                var new_comments = jsonotvet[i].comments;
                var grades_yes = jsonotvet[i].grades_yes;
                var grades_no = jsonotvet[i].grades_no;
                var id_gibdd = jsonotvet[i].id_gibdd;
                var dec_status = jsonotvet[i].dec_status;

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
                //myMap.geoObjects.add(myPlacemark);    //В этом месте сначала была команда выведения на карту знаков нарушений
                var button_comment;
                if (new_comments == "yes"){ // Проверка наличия к этому событию КОММЕНТАРИЕВ (если есть - добавляю кнопку с id события)
                    button_comment = "<button class='show-comments' case_id = '" + newid + "'>Комментарии</button>";
                } else {
                    button_comment = "";
                }
                var dec_src;
                var dec_class;
                switch (dec_status){
                    case 'wait': dec_src = 'images/comment.png'; dec_class = 'img-dec'; break;
                    case 'yes': dec_src = 'images/finger_down.png'; dec_class = 'img-finger-down'; break;
                    case 'no': dec_src = 'images/finger_up.png'; dec_class = 'img-finger-up'; break;
                    case 'joke': dec_src = 'images/joke.png'; dec_class = 'img-finger_up'; break;
                    case 'sended': dec_src = 'images/question.png'; dec_class = 'sended'; break;
                    case 'ignor': dec_src = 'images/ignor.png'; dec_class = 'img-finger_up'; break;
                    default: dec_src = 'images/white_sq.png'; dec_class = 'white_sq'; break;
                }
                if(typeof center_lat == "undefined"){   // Если в функцию передаются широта и долгота, значит выводить строки с нарушениями не следует
                    $("#table-result-search").append("<tr><td>" + denj + "</td>" +
                        "<td>" + times + "</td>" +
                        "<td>" + town_name + "</td>" +
                        "<td><a class='selected-search-coords' case_id='" + newid + "' page='"+ page +"' lat='"+ lat +"' long='"+ long +"' push='no' href='#'>" + car_numer + "</a></td>" +
                        "<td>" + violation + "</td>" +
                        "<td><img class='img-comment "+dec_class+"' case_id='"+newid+"' violation='"+violation+"' car_numer ='"+car_numer+"' town_name='"+town_name+"' author = '" + author + "' dec_status='" + dec_status + "' videos='" + videos + "' denj='"+denj+"' dataa='"+dataa+"' dif_date='"+dif_date+"' limit_of_action='"+limit_of_action+"' id_gibdd='"+id_gibdd+"' src=" + dec_src + "></td>" +
                        "<td><button class='button-search-filter' case_id='" + newid + "' pushed='no' min_lat='"+ min_lat +"' min_long='"+ min_long +"' max_lat='"+ max_lat +"' max_long='"+ max_long +"' violation='"+ violation +"' lat='"+ lat +"' long='"+ long +"' car_numer='"+ car_numer +"' videos='"+ videos +"' violation_pic='"+ violation_pic +"' violation_picsize1='"+ violation_picsize1 +"' violation_picsize2='"+ violation_picsize2 +"'>Скрыть</button><img class='white-sq' src='images/white_sq.png'></td></tr>");

                }
                if($(".button-search-filter[case_id='"+ newid +"']").attr("pushed") == "no"){ //Если нарушение скрыто кнопом фильтрации. знак на карту выводиться не будет, в том числе после нажатия ссылки отображения знака в центре карты
                    myMap.geoObjects.add(myPlacemark);
                }
            };
/*            if (num_pages > 1){
                for (var i = 0; i < num_pages; i ++){
                    var real_page = i + 1;
                    $("<span class='span-link-pages'><a href='#' class='link-paging' my_num_page = '" + real_page + "'>" + real_page + "</a></span>").appendTo("#search-paging");
                }
            }*/

            //allowComments();    //Уже оставлял комментарии по этому событию?
            //ownComments();      //Это моё видео?
            //allowAssessment();  //Оценил видео? Процедура оценки находится в файл assessment.js
        } else if(jsonotvet.length == 0) {
            alert("По этим условиям ничего не найдено, уточните параметры поиска!!!");
            clearSearchResult();    //Функция обнуления результатов поиска из search.js
        } else if(jsonotvet.length > 200){
            alert("Запросу соответствует " + jsonotvet.length + " результатов, уточните критерии поиска!!!");
            clearSearchResult();    //Функция обнуления результатов поиска из search.js
        }

    } else {
        $.getJSON("server/search_case.php", data, function (json){
            $("#cont-for-search-json-otvet").data("search-data", json.otvet);     //Для страницы ПОИСКА Сохраняю в элементе div массив json с результатами поиска json.otvet
            jsonotvet = $("#cont-for-search-json-otvet").data("search-data");

            if(jsonotvet.length > 0 && jsonotvet.length <= 200){
/////////////////////////////////////////////////////////////////////////////////////

                var pages = page;
                var rows_per_page = 10; //Количеество строк на странице
                var num_pages;          //количество страниц (вычисляется ниже)
                var start_point = rows_per_page * (pages - 1);  //Первая запись на странице
                var end_point;                                  //Последняя запись на странице
                var total_rows = jsonotvet.length;             //Общее количенство записей
                if (Math.floor(total_rows/rows_per_page) < (total_rows/rows_per_page)){
                    num_pages = Math.floor(total_rows/rows_per_page) + 1
                } else {
                    num_pages = Math.floor(total_rows/rows_per_page);
                }
                if (page == num_pages){
                    end_point = jsonotvet.length;  //Если количество страниц равно номеру страницы, переданному как аргумент функции,
                    //то конечной точкой является общее количество элементов массива
                } else {
                    end_point = rows_per_page * pages;
                }

//////////////////////////////////////////////////////////////////////////////////////////////////
                var latidudes = [];
                var longitudes = [];

                for (var i = start_point; i < end_point; i ++){
                    var lat = jsonotvet[i].latitude;      //Широта
                    var long = jsonotvet[i].longitude;    //Долгота
                    latidudes.push(lat);            //Добавляю значения широты в массив
                    longitudes.push(long);
                }

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

                for(var i = start_point; i < end_point; i ++) {        //Добавляю метки на карту
                    var newid = jsonotvet[i].newid;
                    var lat = jsonotvet[i].latitude;      //Широта
                    var long = jsonotvet[i].longitude;    //Долгота
                    var reg_name = jsonotvet[i].reg_name;
                    var town_name = jsonotvet[i].town_name;
                    var violation_pic = jsonotvet[i].violation_pic;
                    var violation_picsize1 = parseInt(jsonotvet[i].violation_picsize1);
                    var violation_picsize2 = parseInt(jsonotvet[i].violation_picsize2);
                    var violation = jsonotvet[i].violation;
                    var car_numer = jsonotvet[i].car_numer;
                    var images = jsonotvet[i].images;
                    var videos = jsonotvet[i].videos;
                    var denj = jsonotvet[i].denj;         //День инцидента
                    var dataa = jsonotvet[i].dataa;         //День заявления
                    var dif_date = jsonotvet[i].dif_date;   //Прошло дней от подачи заявления
                    var limit_of_action = jsonotvet[i].limit_of_action;   //Осталось дней до истечения срока исковой давности
                    var times = jsonotvet[i].times;
                    var proved = jsonotvet[i].proved;
                    var author = jsonotvet[i].author;
                    var new_comments = jsonotvet[i].comments;
                    var grades_yes = jsonotvet[i].grades_yes;
                    var grades_no = jsonotvet[i].grades_no;
                    var id_gibdd = jsonotvet[i].id_gibdd;
                    var dec_status = jsonotvet[i].dec_status;

                    var myPlacemark = new ymaps.Placemark([lat, long],
                        {
                            hintContent: violation + ': ' + car_numer,
                            balloonContent: 'Номер машины: ' + '<strong>' + car_numer + '</strong></br>' + 'Нарушение: ' + violation +
                            '</br><iframe width="300" height="200" src="https://www.youtube.com/embed/' + videos + '" frameborder="0" allowfullscreen></iframe>',
                            //iconContent: '8'
                        },{
                            iconLayout: 'default#image',
                            iconImageHref: violation_pic,
                            iconImageSize: [violation_picsize1, violation_picsize2]
                            //iconImageSize: [30, 30]
                            //preset: violation_style,
                            //iconColor: violation_color
                        });
                    //myMap.geoObjects.add(myPlacemark);    //В этом месте сначала была команда выведения на карту знаков нарушений
                    var button_comment;
                    if (new_comments == "yes"){ // Проверка наличия к этому событию КОММЕНТАРИЕВ (если есть - добавляю кнопку с id события)
                        button_comment = "<button class='show-comments' case_id = '" + newid + "'>Комментарии</button>";
                    } else {
                        button_comment = "";
                    }
                    var dec_src;
                    var dec_class;
                    switch (dec_status){
                        case 'wait': dec_src = 'images/comment.png'; dec_class = 'img-dec'; break;
                        case 'yes': dec_src = 'images/finger_down.png'; dec_class = 'img-finger-down'; break;
                        case 'no': dec_src = 'images/finger_up.png'; dec_class = 'img-finger-up'; break;
                        case 'joke': dec_src = 'images/joke.png'; dec_class = 'img-finger_up'; break;
                        case 'sended': dec_src = 'images/question.png'; dec_class = 'sended'; break;
                        case 'ignor': dec_src = 'images/ignor.png'; dec_class = 'img-finger_up'; break;
                        default: dec_src = 'images/white_sq.png'; dec_class = 'white_sq'; break;
                    }
                    $("#table-result-search").append("<tr><td>" + denj + "</td>" +
                        "<td>" + times + "</td>" +
                        "<td>" + town_name + "</td>" +
                        "<td><a class='selected-search-coords' case_id='"+newid+"' page='"+page+"' lat='"+lat+"' long='"+long+"' push='no' href='#'>" + car_numer + "</a></td>" +
                        "<td>" + violation + "</td>" +
                        "<td><img class='img-comment "+dec_class+"' case_id='"+newid+"' violation='"+violation+"' car_numer='"+car_numer+"' town_name='"+town_name+"' author='"+author+"' dec_status='"+dec_status+"' videos='"+videos+"' denj='"+denj+"' dataa='"+dataa+"' dif_date='"+dif_date+"' limit_of_action='"+limit_of_action+"' id_gibdd='"+id_gibdd+"' src="+dec_src+"></td>" +
                        "<td><button class='button-search-filter' case_id='" + newid + "' pushed='no' min_lat='"+ min_lat +"' min_long='"+ min_long +"' max_lat='"+ max_lat +"' max_long='"+ max_long +"' violation='"+ violation +"' lat='"+ lat +"' long='"+ long +"' car_numer='"+ car_numer +"' videos='"+ videos +"' violation_pic='"+ violation_pic +"' violation_picsize1='"+ violation_picsize1 +"' violation_picsize2='"+ violation_picsize2 +"'>Скрыть</button><img case_id='" + newid + "' class='white-sq' src='images/white_sq.png'></td></tr>");

                    if($(".button-search-filter[case_id='"+ newid +"']").attr("pushed") == "no"){ //Если нарушение скрыток кнопом фильтрации. знак на карту выводиться не будет, в том числе после нажатия ссылки отображения знака в центре карты
                        myMap.geoObjects.add(myPlacemark);
                    }
                };
                if (num_pages > 1){
                    for (var i = 0; i < num_pages; i ++){
                        var real_page = i + 1;
                        $("<span class='span-link-pages'><a href='#' class='link-paging' my_num_page = '" + real_page + "'>" + real_page + "</a></span>").appendTo("#search-paging");
                    }
                }

                //allowComments();    //Уже оставлял комментарии по этому событию?
                //ownComments();      //Это моё видео?
                //allowAssessment();  //Оценил видео? Процедура оценки находится в файл assessment.js
            } else if(jsonotvet.length == 0) {
                alert("По этим условиям ничего не найдено, уточните параметры поиска!!!");
                clearSearchResult();    //Функция обнуления результатов поиска из search.js
            } else if (jsonotvet.length > 200){
                alert("Запросу соответствует " + jsonotvet.length + " результатов, уточните критерии поиска!!!");
                clearSearchResult();    //Функция обнуления результатов поиска из search.js
            }
        })
    }
}

$("body").on("click", ".link-paging", function(){
    $("#map-search").empty();//Очищаю место для новой карты
    $("#table-result-search").empty();//Очищаю место для вывода данных по результатам поиска (сбоку от карты)
    var page = $(this).attr("my_num_page");
    searchMapPaging("000", page);   //Вызов функции для страницы
    $(".link-paging").removeClass("span-link-pages-pushed");
    $(this).addClass("span-link-pages-pushed");
});

$("body").on("click", ".button-search-filter", function(){
    $("#map-search").empty();
    var min_lat = $(this).attr("min_lat");
    var min_long = $(this).attr("min_long");
    var max_lat = $(this).attr("max_lat");
    var max_long = $(this).attr("max_long");
    if ($(this).attr("pushed") == "no"){
        $(this).text("Показать");
        $(this).attr({pushed: "yes"});
        $(this).css("background-color", "red");
        $(this).closest("tr").children().children("a").addClass("disabled").attr({push: "yes"});    //Ссылке присаиваю атрибут "нажато"
    } else if ($(this).attr("pushed") == "yes"){
        $(this).text("Скрыть");
        $(this).attr({pushed: "no"});
        $(this).css("background-color", "")
        $(this).closest("tr").children().children("a").removeClass("disabled").attr({push: "no"});
    }
    var myMap = new ymaps.Map("map-search",
        {
            //center: [50, 60],
            zoom: 9,
            bounds: [[min_lat, min_long],[max_lat, max_long]] // Определяю границы отображения карты
        },
        {
            searchControlProvider: 'yandex#search'
        }
    );
    $(".button-search-filter[pushed='no']").each(function(){
        var violation = $(this).attr("violation");
        var lat = $(this).attr("lat");
        var long = $(this).attr("long");
        var car_numer = $(this).attr("car_numer");
        var videos = $(this).attr("videos");
        var violation_pic = $(this).attr("violation_pic");
        var violation_picsize1 = parseInt($(this).attr("violation_picsize1"));  //ОБЯЗАТЕЛЬНО!!!!! нужно преобразовать в целое, иначе будет отображаться на карте с ошибками!!!
        var violation_picsize2 = parseInt($(this).attr("violation_picsize2"));
        var myPlacemark = new ymaps.Placemark([lat, long],
            {
                hintContent: violation + ': ' + car_numer,
                balloonContent: 'Номер машины: ' + '<strong>' + car_numer + '</strong></br>' + 'Нарушение: ' + violation +
                '</br><iframe width="300" height="200" src="https://www.youtube.com/embed/' + videos + '" frameborder="0" allowfullscreen></iframe>',
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
    })
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////КОММЕНТАРИИ К СТАТУСАМ ОТНОСИТЕЛЬНО РЕШЕНИЯ ГИБДД///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$("body").on("click", ".img-dec", function(){   //Нажимаю на символ комментария, чтобы открыть форму заявления и дополнить его фамилией
    var case_id = $(this).attr("case_id");
    var videos = $(this).attr("videos");
    $("<div id='container-message'></div>").appendTo("#page-searchh");
    var left = $(window).width()/2 - 300 + "px";            //Выравниваю по центру блок со вспомогательной информацией
    $("#container-message").css({width: "600", left: left});   //---
    $("button, select, input").not("input[type='hidden']").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме скрытого типа
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки

    $("<form name='declaration' id='declaration' method='post'></form>").appendTo("#container-message"); //Форма для вывода текста заявления, составленного при вводе данных по нарушению
    $("<input type='hidden' name='dec-videos' id='dec-videos' />").appendTo("#declaration");
    $("#dec-videos").val($(this).attr("videos"));                   //Идентификатор видео (для поиска)

    $("<div id='title-message'>Письмо в ГИБДД</div>").appendTo("#container-message");
    $("<div id='form-complex-message'></div>").appendTo("#container-message");
    $("<div id='videos-link'><a href='https://www.youtube.com/watch?v=" + videos + "' target='_blank'>Открыть видео</a></div>").appendTo("#form-complex-message");
    $("<label>webmaster@frn-pdd.ru</label><br /><br />").appendTo("#form-complex-message");
    $("<textarea id='text-message'></textarea>").appendTo("#form-complex-message");
    $("<label>Ссылка на видео опубликована сайте frn-pdd.ru, оформлено и направлено в ГИБДД заявление с просьбой рассмотреть факт нарушения. Ждём новых видео!</label><br /><br />").appendTo("#form-complex-message");
    $("<label for='id-message-gibdd'>ФИО отправителя</label><input id='id-message-gibdd' type='text' /><br />").appendTo("#form-complex-message");
    $("<button id='close-form-declaration'>Закрыть письмо</button>").appendTo("#form-complex-message");
    $("<button id='send-declaration' case_id = '" + case_id + "' videos = '" + videos + "'>Сохранить письмо и данные</button>").appendTo("#form-complex-message");

    var datadeclaration = $("#declaration").serializeArray();//Сериализовать нужно только для передачи методом $.post. Для метода $.ajax сериализованные данные не подходят
    $.post("server/print_declaration.php", datadeclaration, function(data){   //Отправка номера и текста заявления в БД
        $("#text-message").text(data.otvet[0]['dec_text']);
    }, "json")

    $("<form name='form-send-dec' id='form-send-dec' method='post'></form>").appendTo("#container-message"); //Форма для отправки заявления
    $("<input type='hidden' name='dec-text-gibdd' id='dec-text-gibdd' />").appendTo("#form-send-dec");    //Текст заявления в ГИБДД
    $("<input type='hidden' name='dec-name-gibdd' id='dec-name-gibdd' />").appendTo("#form-send-dec");    //ФИО как регистрационный номер заявления для ГИБДД
    $("<input type='hidden' name='dec-videos-gibdd' id='dec-videos-gibdd' />").appendTo("#form-send-dec");    //ФИО как регистрационный номер заявления для ГИБДД
    $("#dec-videos-gibdd").val($(this).attr("videos"));                   //Идентификатор видео (для поиска)
})

$("body").on("click", "#close-form-declaration, .close-comment", function(){    //Закрываю страницу формирования заявления
    $("#container-message, #sended-comment").remove();
    enableMineLinksButtons()    //в файле help.js
})

$("body").on("click", "#send-declaration", function(){
    var videos = $(this).attr("videos");    //Извлекаю значение из атрибута в начале функции, иначе this потеряется )))
    var case_id = $(this).attr("case_id");
    if($("#id-message-gibdd").val() == ""){
        insteadAlert("Забыл указать ФИО репортёра");
    } else {
        var data = "name_reporter=" + $("#id-message-gibdd").val();     //Проверяю наличие репортёра с такими же инициалами
        $.get("server/prove_reporter_name.php", data, function(otvet){
           if(otvet == "111"){
               insteadAlert("Репортёр с таким именем уже есть");
           } else {
               $("#dec-text-gibdd").val($("#text-message").val());   //Передаю в скрытое поле текст заявления
               $("#dec-name-gibdd").val($("#id-message-gibdd").val());   //Передаю в скрытое поле ФИО репортёра

               var datadeclaration = $("#form-send-dec").serializeArray();//
               $.post("server/send_declaration.php", datadeclaration, function(data){   //Отправка номера и текста заявления в БД

               }, "json");
               $(".img-dec").each(function () { //Проверяю атрибут case_id каждого элемента класса .img-comment
                   if (videos == $(this).attr("videos")) {   //Если case_id из БД совпадает со значением атрибута case_id элемента класса img-comment,
                       $(this).css({display: 'none'});   //то этот элемент делаю невидимым
                   }
               })
               $("#container-message").remove();
               enableMineLinksButtons()    //в файле my-script.js
           }
        })
    }
})

/*$("body").on("click", "#send-declaration", function(){
    var videos = $(this).attr("videos");
    var case_id = $(this).attr("case_id");
    $("#dec-text-gibdd").val($("#text-message").val());   //Передаю в скрытое поле текст заявления
    $("#dec-name-gibdd").val($("#id-message-gibdd").val());   //Передаю в скрытое поле ФИО репортёра

    var datadeclaration = $("#form-send-dec").serializeArray();//
    $.post("server/send_declaration.php", datadeclaration, function(data){   //Отправка номера и текста заявления в БД
        alert("Успешно");
    }, "json")
    $(".img-dec").each(function () { //Проверяю атрибут case_id каждого элемента класса .img-comment
        if (videos == $(this).attr("videos")) {   //Если case_id из БД совпадает со значением атрибута case_id элемента класса img-comment,
            $(this).css({display: 'none'});   //то этот элемент делаю невидимым
        }
    })
    $("#container-message").remove();
    enableMineLinksButtons()    //в файле my-script.js
})*/

$("body").on("click", ".sended", function(){        //Вывожу на экран окошко с краткой сводкой информации о направленном в ГИБДД заявлении
    var violation = $(this).attr("violation").toLowerCase();
    var car_numer = $(this).attr("car_numer");
    var denj = $(this).attr("denj");
    var dataa = $(this).attr("dataa");
    var dif_date = $(this).attr("dif_date");
    var limit_of_action = $(this).attr("limit_of_action");
    var msg_limit = "";
    //if(limit_of_action == 0){
    if(limit_of_action < 0){
        msg_limit = "Срок давности по этому нарушению закончился " + Math.abs(limit_of_action) + " дней назад"
    } else {
        msg_limit = "Срок исковой давности истекает через " + limit_of_action + " дней";
    }
    openComment();      //Открываю комментарий, чтобы посмотреть когда был совершён инцидент, когда было направлено заявление
    $("<h3>Заявление направлено в ГИБДД</h3>").appendTo("#sended-comment");
    $("<p id='span-sended'>(" + car_numer + ", " + violation + ")</p>").appendTo("#sended-comment");
    $("<p class='text-sended'>Нарушение произошло " + denj + ".<br />" +
        "Заявление направлено " + dataa + ", рассматривается уже " + dif_date + " дней.<br />" + msg_limit + "</p>").appendTo("#sended-comment");
    $("<button class='close-comment'>Закрыть</button>").appendTo("#sended-comment");
})

$("body").on("click", ".img-finger-down", function(){
    openComment();      //Открываю комментарий, чтобы посмотреть обвинительный вердикт ГИБДД
    var id_gibdd = $(this).attr("id_gibdd");
    var data = "id_gibdd=" + id_gibdd;
    $("<h3 id='h3-guilty'>Виновен!</h3>").appendTo("#sended-comment");
    $.get("server/get_google_disk.php", data, function(otvet){
        $("<p class='text-sended'><a href='"+otvet+"' target='_blank'>Посмотреть ответ</a></p>").appendTo("#sended-comment");
        $("<button class='close-comment'>Закрыть</button>").appendTo("#sended-comment");
    })
})

$("body").on("click", ".img-finger-up", function(){
    openComment();      //Открываю комментарий, чтобы посмотреть обвинительный вердикт ГИБДД
    var id_gibdd = $(this).attr("id_gibdd");
    var data = "id_gibdd=" + id_gibdd;
    $("<h3 id='h3-unguilty'>Оправдан!</h3>").appendTo("#sended-comment");
    $.get("server/get_google_disk.php", data, function(otvet){
        $("<p class='text-sended'><a href='"+otvet+"' target='_blank'>Посмотреть ответ</a></p>").appendTo("#sended-comment");
        $("<button class='close-comment'>Закрыть</button>").appendTo("#sended-comment");
    })
})

function openComment (){    //Функция открытия комментария к статусу рассмотрения инцидента в ГИБДД
    $("<div id='sended-comment'></div>").appendTo("#page-searchh");
    var left = $(window).width()/2 - 250 + "px";            //Выравниваю по центру блок со вспомогательной информацией
    $("#sended-comment").css({width: "500", left: left});   //---
    $("button, select, input").not("input[type='hidden']").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме скрытого типа
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки
}


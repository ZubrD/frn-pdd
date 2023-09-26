function myPlace() {
    getMyLocation();
}

function getMyLocation () { //собственно наша функция для определения местоположения
    defaultMapMoskow(); //Загружаю карту Москвы на случай, если пользователь или запретил определять местоположение вообще, или временно ("не сейчас")
    if (navigator.geolocation) { //для начала надо проверить, доступна ли геолокация, а то еще у некоторых браузеры то древние. Там о таком и не слышали.
        navigator.geolocation.getCurrentPosition(displayLocation, displayError); //если все ок, то вызываем метод getCurrentPosition и передаем ей нашу функцию displayLocation, реализую ее ниже.
    }
/*    else {
        alert("Упс, геолокация не поддерживается"); //выведем сообщение для старых браузеров.
    }*/
}

function  displayLocation(position) { //передаем в нашу функцию объект position - этот объект содержит ширину и долготу и еще массу всяких вещей.
    var latitude = position.coords.latitude; // излвекаем широту
    var longitude = position.coords.longitude; // извлекаем долготу

    //Теперь пришло время все это записать в наш  DOMа
    $("<div id='my-location'></div>").appendTo("body");
    //$("<div id='min-distance'></div>").appendTo("body");
    $("<table id='location-table'></table>").appendTo("#my-location");
    $.getJSON("server/geoloc.php", "0", function (json) {
        if(json.otvet.length > 0){
            var distances = []; //Массив для расстояний от пользователя до каждого города
            $.each(json.otvet, function () {
                var id_reg = this['id_reg'];
                var id_town = this['id_town'];
                var town = this['town'];
                var lat = this['lat'];
                var long = this['long'];
                var krasCoords =  {
                    latitude: lat,
                    longitude: long
                };
                var km = computeDistance(position.coords, krasCoords);  //Расчёт расстояния до каждого города
                distances.push(km); //Помещаю эти расстояния в массив
                $("<tr class='table-dist' id_reg = '" + id_reg + "' id_town = '" + id_town + "' town = '" + town + "' km = '" + km + "'><td>" + town + "</td><td>" + lat + "</td><td>" + long + "</td><td>" + km + "</td></tr>").appendTo("#location-table");
            })
        }
        var min_distance = distances[0];    //За минимальное принимаю первое значение массива
        for (var i = 0; i < distances.length; i ++){    //Перебираю массив с расстояниям и выбираю наименьшее
            if(distances[i] < min_distance){
                min_distance = distances[i];
            }
        }
        $(".table-dist").each(function () {         // Перебираю все строки невидимой таблицы,
            var tab_min_dist = $(this).attr("km");
            var tab_town = $(this).attr("town");
            var tab_ig_reg = $(this).attr("id_reg");
            var tab_id_town = $(this).attr("id_town");
            if (tab_min_dist == min_distance){      // выбираю ту, где атрибут km минимальный, вывожу на экран город
                $("#reserv-my-town, #my-town").remove();
                $("button, select, input").not(".another-town").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода
                $("a").addClass("disabled");  //Дезактивирую все ссылки кроме тех, что с классом helps
                $("<div id='container-purpose-town'></div>").appendTo("body");
                $("<div id='text-purpose-town'>Ваш город " + tab_town + "?</div>").appendTo("#container-purpose-town");
                $("<button id='button-purpose-town-yes' class='another-town' id_reg = '" + tab_ig_reg + "' id_town = '" + tab_id_town + "' purpose-town = '" + tab_town + "'>Согласен</button>").appendTo("#container-purpose-town");
                $("<button id='button-purpose-town-another' class='another-town'>Выбрать другой город</button>").appendTo("#container-purpose-town");
                //$("<div id='map-town'></div>").appendTo("#page-start");
                $("<div id='reserv-my-town' id_reg = '" + tab_ig_reg + "' id_town = '" + tab_id_town + "' purpose_town = '" + tab_town + "'></div>").appendTo("#top-info");  //Сохраняю значение выбранного города
                $("<form name='my-town' id='my-town'></form>").appendTo("#top-info");
                $("<input type='hidden' name='main-id_reg' id='main-id_reg' />").appendTo("#my-town");
                $("<input type='hidden' name='main-id_town' id='main-id_town' />").appendTo("#my-town");
            }
        })
    })
}

function displayError(error){
    var errorTypes = {
        0: "Неизвестная ошибка",
        1: "Запрещено пользователем",
        2: "Положение не определено",
        3: "Запрос обрабатывается слишком долго"
    };
    var errorMessage = errorTypes[error.code];
    if (error.code == 0 ||  error.code == 2){
        errorMessage = errorMessage + " " + error.message;
        alert(errorMessage);
    }
    if (error.code == 1){
        //defaultMapMoskow();   //
        clearClassSearchCar();  //Делаю ссылки на поиск машины и расширенный поиск снова активными
    }
}

function computeDistance(startCoords, destCoords) {             /*Вычисление расстояния между точками по координатам*/
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);

    var Radius = 6371; // radius of the Earth in km
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
            Math.cos(startLatRads) * Math.cos(destLatRads) *
            Math.cos(startLongRads - destLongRads)) * Radius;

    return distance;
}

function degreesToRadians(degrees) {
    radians = (degrees * Math.PI)/180;
    return radians;
}

///////////////////////////////////////////////////////////////// Соглашаюсь с выбором ближайшего города
$("body").on("click", "#button-purpose-town-yes", function(){
    $("#main-id_reg").val($(this).attr("id_reg"));
    $("#main-id_town").val($(this).attr("id_town"));
    $("#container-purpose-town, #my-location").remove();      //Удаляю всплывающее окно с выбором города пользователя и таблицу с координатами всех городов из БД
    clearClassSearchCar();  //Делаю ссылки на поиск машины и расширенный поиск снова активными
    $("#table-town-violations").remove();   //Удаляю таблицу с данными по городу, выбранному по умолчанию (Москва)
    getDataForMapMyTown();
});

///////////////////////////////////////////////////////////////// Приступить к выбору другого города
$("body").on("click", "#button-purpose-town-another", function(){
    selectAnotherTown() //Функция выбора другого города (не полученного методом расчёта минимального расстояния)
});

function selectAnotherTown(){
    $("#text-purpose-town").remove();
    $("#button-purpose-town-yes").remove();
    $("#button-purpose-town-another").remove();
    $("#reserv-my-town").attr({id_reg: ""});        //Удаляю параметры города, выбранного на основании расчёта минимального расстояния
    $("#reserv-my-town").attr({id_town: ""});       // -----
    $("#reserv-my-town").attr({purpose_town: ""});  // -----
    $("<table id='table-another-town'></table>").appendTo("#container-purpose-town");
    $("<tr><td id='first-column'><div id='text-another-region'>Выберите Ваш регион</div></td><td><div id='text-another-town'>Выберите Ваш город</div></td><td><div id='div-stat'><a id='link-stat' href='#'>Статистика</a></div></td></tr>" +
        "<tr><td><select id='select-my-region'></select></td><td><select id='select-my-town'></select></td></tr>" +
        "<tr><td colspan='3'><div id='div-text'></div></td></tr>" +
        "<tr><td colspan='3'><button id='button-another-town-yes' disabled>Да</button><button id='button-another-town-no' disabled>Нет</button><button id='button-another-town-reconsider'>Передумал</button></td></tr>").appendTo("#table-another-town");
    $("#select-my-region").load("server/regions.php");
}

///////////////////////////////////////////////////////////////// Выбрать другой регион
$("body").on("change", "#select-my-region", function (event) {  // Выбор региона
    $("#text-another-town").show(); // Делаю видимым заголовок в таблице для выбора города
    $("#select-my-town").show(); // Делаю видимым список городов выбранного региона
    $("#reserv-my-town").attr({id_reg: $(event.target).val()}); // Передаю в атрибут id_reg резервного хранилища id региона
    $("#reserv-my-town").attr({id_town: ""});   // Обнуляю в резервном хранилище id города
    $("#reserv-my-town").attr({purpose_town: ""})//Обнуляю в резервном хранилище название города
    $("#main-id_reg").val($(event.target).val());   // Передаю в скрытое поле формы id выбранного региона
    $("#main-id_town").val("");   // Обнуляю в скрытом поле формы id города
    $('[value="00"]', event.target).remove();   // Убираю строчку Select region из списка
    var data = "data=" + $(event.target).val();     //Данные для отправки запроса GET на сервер; val - это значение value выбранного тега option
    $("#select-my-town").load("server/towns.php?" + data); // Загружаю города этого региона
});

/////////////////////////////////////////////////////////////// Выбрать город другого региона
$("body").on("change", "#select-my-town", function (event) {    // Выбор города
    $("#reserv-my-town").attr({id_town: $(event.target).val()}); // Передаю в атрибут id_town резервного хранилища id города
    $("#reserv-my-town").attr({purpose_town: $("#select-my-town :selected").prop("text")})//Передаю в атрибут purpose_town название города
    $("#main-id_town").val($(event.target).val());               // Передаю в скрытое поле формы id выбранного города
    $('[value="00"]', event.target).remove();   // Убираю строку Select town из списка
    $("<div id='text-purpose-another-town'>" + $("#select-my-town :selected").prop("text") + "?</div>").appendTo("#div-text");
    $("#select-my-region, #select-my-town").attr({disabled: "disabled"});
    $("#button-another-town-yes, #button-another-town-no").removeAttr("disabled");
});

$("body").on("click", "#button-another-town-yes", function(){
    $("#container-purpose-town").remove();      //Удаляю всплывающее окно с выбором города пользователя
    $("#table-town-violations").remove();   //Удаляю таблицу с данными по городу, выбранному по умолчанию (Москва)
    clearClassSearchCar();  //Делаю ссылки на поиск машины и расширенный поиск снова активными
    getDataForMapMyTown();
});

$("body").on("click", "#button-another-town-reconsider", function(){
    $("#container-purpose-town").remove();
    clearClassSearchCar();  //Делаю ссылки на поиск машины и расширенный поиск снова активными
})

$("body").on("click", "#button-another-town-no", function(){
    $("#text-purpose-another-town").remove();
    $("#select-my-region, #select-my-town").removeAttr("disabled");
    $("#button-another-town-yes, #button-another-town-no").attr({disabled: "disabled"});
});

function getDataForMapMyTown (){        // Функция определения координат для карты города
    var main_data = $("#my-town").serializeArray();     // id региона и города пользователя (по результату вычисления ближайшего города)
    var zapros = $.getJSON("server/my-town-coords.php", main_data, function(json){   //Вывод на экран карты выбранного города
        if(json.otvet.length > 0){
            var lat = json.otvet[0]['my-town-latitude'];      //Широта
            var long = json.otvet[0]['my-town-longitude'];    //Долгота
            $("#reserv-my-town").attr({town_latitude: lat});
            $("#reserv-my-town").attr({town_longitude: long});
        }
    });
    zapros.complete(function(){     //Функция выполняется как только будет закончен запрос
        var town_lat = $("#reserv-my-town").attr("town_latitude");
        var town_long = $("#reserv-my-town").attr("town_longitude");
        var zoom = 11;
        showMapMyTown(town_lat, town_long, main_data, zoom);  //Вызываю функцию отображения карты города пользователя
    });
}

function showMapMyTown (lat, long, data, zoom) {     //Функция отображения на карте результатов поиска
    $.getJSON("server/my-town-map.php", data, function (json) {
        $("<table id='table-town-violations'></table>").appendTo("#container-map-town");
        $("#reserv-my-town").data("my-town-data", json.otvet);  //Сохраняю в элементе результат запроса
        $("#map-town").empty();
        var myMap;
        ymaps.ready(function(){     //Загрузка по готовности API
            myMap = new ymaps.Map("map-town",
                {
                    center: [lat, long],
                    zoom: zoom
                },
                {
                    searchControlProvider: 'yandex#search'
                }
            );
            if(json.otvet.length > 0){
                var violations_type = [];
                var array_town_name = [];
                var denjs = [];     //Пустой массив дат нарушений
                $.each(json.otvet, function () {        //Добавляю метки на карту
                    var newid = this['newid'];
                    var lat = this['latitude'];      //Широта
                    var long = this['longitude'];    //Долгота
                    var reg_name = this['reg_name'];
                    var town_name = this['town_name'];
                    var id_violation = this['id_violation'];
                    var violation_pic = this['violation_pic'];
                    var violation_picsize1 = parseInt(this['violation_picsize1']);
                    var violation_picsize2 = parseInt(this['violation_picsize2']);
                    var violation = this['violation'];
                    var car_numer = this['car_numer'];
                    var images = this['images'];
                    var videos = this['videos'];
                    var denj = this['denj'];
                    var dataa = this['dataa'];
                    var proved = this['proved'];
                    var author = this['author'];
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
                            //iconImageSize: [15, 10]
                            //preset: violation_style,
                            //iconColor: violation_color
                        });
                    myMap.geoObjects.add(myPlacemark);
                    //violations_type.push(violation);
                    violations_type.push(id_violation); //Записываю в массив id нарушений
                    array_town_name.push(town_name); //Записываю в массив id нарушений
                    denjs.push(denj);             //Записываю в массив даты нарушений
                });
                var min_denj = denjs[0];                    //Определение начальной и конечной даты периода, за который в городе зафиксированы нарушения
                var max_denj = denjs[0];                    //
                for(var i = 0; i < denjs.length; i ++){     //
                    if(denjs[i] < min_denj){                //
                        min_denj = denjs[i];                //
                    }                                       //
                    if(denjs[i] > max_denj){                //
                        max_denj = denjs[i];                //
                    }                                       //
                }                                           //
                $("#reserv-my-town").attr({min_denj: min_denj});    //Сохраняю начальную дату периода
                $("#reserv-my-town").attr({max_denj: max_denj});    //Сохраняю конечную дату периода
                sumViolations(violations_type, array_town_name); // Вызываю функцию суммирования количества нарушений по типам
            } else {
                //alert("По Вашему городу пока нет нарушений!!!");
                $("<tr><td colspan='2'>В городе <span id='span-carnumer-table-town'>" + $("#reserv-my-town").attr("purpose_town") + "</span></td><td><a href='#' id='link-change-town'>Другой город</a></td></tr>").appendTo("#table-town-violations");
                $("<tr><td colspan='3'>нарушения пока не зафиксированы</td></tr>").appendTo("#table-town-violations");
            }
        })
    })
}

function sumViolations (viol_array, array_town_name){        //Функци суммирования количества нарушений по типам
    var town_name = array_town_name[0];
    var min_denj = $("#reserv-my-town").attr("min_denj");   //Начальная дата периода, за который зафиксированы нарушения в данном городе
    var max_denj = $("#reserv-my-town").attr("max_denj");   //Конечная дата периода, за который зафиксированы нарушения в данном городе
    var viol1 = 0;
    var viol2 = 0;
    var viol3 = 0;
    var viol4 = 0;
    var viol5 = 0;
    var viol6 = 0;
    var viol7 = 0;
    var viol8 = 0;
    var viol9 = 0;
    var viol10 = 0;
    var viol11 = 0;
    var viol12 = 0;
    var viol13 = 0;
    var viol14 = 0;
    var viol15 = 0;
    var viol16 = 0;
    var viol17 = 0;
    var viol18 = 0;
    for (var i = 0; i < viol_array.length; i ++){
        switch (viol_array[i]) {
            case '1': viol1 = viol1 + 1; break;
            case '2': viol2 = viol2 + 1; break;
            case '3': viol3 = viol3 + 1; break;
            case '4': viol4 = viol4 + 1; break;
            case '5': viol5 = viol5 + 1; break;
            case '6': viol6 = viol6 + 1; break;
            case '7': viol7 = viol7 + 1; break;
            case '8': viol8 = viol8 + 1; break;
            case '9': viol9 = viol9 + 1; break;
            case '10': viol10 = viol10 + 1; break;
            case '11': viol11 = viol11 + 1; break;
            case '12': viol12 = viol12 + 1; break;
            case '13': viol13 = viol13 + 1; break;
            case '14': viol14 = viol14 + 1; break;
            case '15': viol15 = viol15 + 1; break;
            case '16': viol16 = viol16 + 1; break;
            case '17': viol17 = viol17 + 1; break;
            case '18': viol18 = viol18 + 1; break;
        }
    }
    $("<tr><td colspan='2'>В городе <span id='span-carnumer-table-town'>" + town_name + "</span></td><td><a href='#' id='link-change-town'>Другой город</a></td></tr>").appendTo("#table-town-violations");
    $("<tr><td colspan='3'>за период с "+ min_denj +" по "+ max_denj +" зафиксированы следующие нарушения: </td></tr>").appendTo("#table-town-violations");
    if(viol1 > 0){
        $("<tr><td class='violations' violation='1'>Пересечение сплошной</td><td class='viol-numer' violation='1'>" + viol1 + "</td><td><button class='button-my-town-filter' violation='1' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol2 > 0){
        $("<tr><td class='violations' violation='2'>Встречная полоса</td><td class='viol-numer' violation='2'>" + viol2 + "</td><td><button class='button-my-town-filter' violation='2' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol3 > 0){
        $("<tr><td class='violations' violation='3'>Проезд на красный</td><td class='viol-numer' violation='3'>" + viol3 + "</td><td><button class='button-my-town-filter' violation='3' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol4 > 0){
        $("<tr><td class='violations' violation='4'>Не пропустил пешехода</td><td class='viol-numer' violation='4'>" + viol4 + "</td><td><button class='button-my-town-filter' violation='4' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol5 > 0){
        $("<tr><td class='violations' violation='5'>Агрессивная езда</td><td class='viol-numer' violation='5'>" + viol5 + "</td><td><button class='button-my-town-filter' violation='5' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol6 > 0){
        $("<tr><td class='violations' violation='6'>Парковка на тротуаре</td><td class='viol-numer' violation='6'>" + viol6 + "</td><td><button class='button-my-town-filter' violation='6' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol7 > 0){
        $("<tr><td class='violations' violation='7'>Неправильная парковка</td><td class='viol-numer' violation='7'>" + viol7 + "</td><td><button class='button-my-town-filter' violation='7' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol8 > 0){
        $("<tr><td class='violations' violation='8'>Под знак 'Въезд запрещён'</td><td class='viol-numer' violation='8'>" + viol8 + "</td><td><button class='button-my-town-filter' violation='8' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol9 > 0){
        $("<tr><td class='violations' violation='9'>Езда по обочине</td><td class='viol-numer' violation='9'>" + viol9 + "</td><td><button class='button-my-town-filter' violation='9' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol10 > 0){
        $("<tr><td class='violations' violation='10'>Нарушение рядности</td><td class='viol-numer' violation='10'>" + viol10 + "</td><td><button class='button-my-town-filter' violation='10' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol11 > 0){
        $("<tr><td class='violations' violation='11'>Не уступил дорогу</td><td class='viol-numer' violation='11'>" + viol11 + "</td><td><button class='button-my-town-filter' violation='11' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol12 > 0){
        $("<tr><td class='violations' violation='12'>Обгон на ж/д переезде</td><td class='viol-numer' violation='12'>" + viol12 + "</td><td><button class='button-my-town-filter' violation='12' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol13 > 0){
        $("<tr><td class='violations' violation='13'>Нападение</td><td class='viol-numer' violation='13'>" + viol13 + "</td><td><button class='button-my-town-filter' violation='13' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol14 > 0){
        $("<tr><td class='violations' violation='14'>Езда по тротуару</td><td class='viol-numer' violation='14'>" + viol14 + "</td><td><button class='button-my-town-filter' violation='14' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol15 > 0){
        $("<tr><td class='violations' violation='15'>Разворот на пешеходном</td><td class='viol-numer' violation='15'>" + viol15 + "</td><td><button class='button-my-town-filter' violation='15' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol16 > 0){
        $("<tr><td class='violations' violation='16'>Полоса общественного транспорта</td><td class='viol-numer' violation='16'>" + viol16 + "</td><td><button class='button-my-town-filter' violation='16' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol17 > 0){
        $("<tr><td class='violations' violation='17'>Поворот налево или разворот</td><td class='viol-numer' violation='17'>" + viol17 + "</td><td><button class='button-my-town-filter' violation='17' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
    if(viol18 > 0){
        $("<tr><td class='violations' violation='18'>Прочие</td><td class='viol-numer' violation='18'>" + viol18 + "</td><td><button class='button-my-town-filter' violation='18' pushed='no'>Скрыть</button></td></tr>").appendTo("#table-town-violations")
    }
}

$("body").on("click", "#link-change-town", function(){  //Переход по ссылке "Другой город"
    $("button, select, input").not(".another-town").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода кроме тех, что с классом another-town
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки
    $("<div id='container-purpose-town'></div>").appendTo("body");
    selectAnotherTown();    //Функция смены города
});

function onlyMapMyTown (lat, long, data, zoom){ //Отоображение на карте незаблокированных кнопом "Скрыть" нарушений
    $("#map-town").empty();
    var myMap = new ymaps.Map("map-town",
        {
            center: [lat, long],
            zoom: zoom
        },
        {
            searchControlProvider: 'yandex#search'
        }
    );
    $.each(data, function () {        //Добавляю метки на карту
        var id_violation = this['id_violation'];
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
        var proved = this['proved'];
        var author = this['author'];
        $(".button-my-town-filter[pushed='no']").each(function(){   //Выбираю только те нарушения, кнопы которых не нажаты
            if (id_violation ==  $(this).attr("violation")){
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
            }
        })
    });
}

$("body").on("click", ".button-my-town-filter", function(){ //Добавляю или убираю маркеры нарушений на карте города
    var viol_id = $(this).attr("violation");
    var town_lat = $("#reserv-my-town").attr("town_latitude");
    var town_long = $("#reserv-my-town").attr("town_longitude");
    var zoom = 11;
    var array_my_town = $("#reserv-my-town").data("my-town-data");  //Использую сохранённый набор данных для выбранного города
    if($(this).attr("pushed") == "no"){
        $(this).text("Показать");
        $(this).attr({pushed: "yes"});
        $(this).css("background-color", "red");
        $(".violations[violation='" + viol_id + "'], .viol-numer[violation='" + viol_id + "']").css("opacity", "0.2"); //Выбираю селектор по значению атрибута и делаю его невидимым
    } else if($(this).attr("pushed") == "yes"){
        $(this).text("Скрыть");
        $(this).attr({pushed: "no"});
        $(this).css("background-color", "lightgreen");
        $(".violations[violation='" + viol_id + "'], .viol-numer[violation='" + viol_id + "']").css("visibility", "visible");
        $(".violations[violation='" + viol_id + "'], .viol-numer[violation='" + viol_id + "']").css("opacity", "1"); //Выбираю селектор по значению атрибута и делаю его видимым
    }
    onlyMapMyTown(town_lat, town_long, array_my_town ,zoom) //Вызываю функцию добавления или удаления маркеров нарушений
});

function defaultMapMoskow (){       //По умолчанию и если геолокация в браузере пользователя отключена, вывожу карту Москвы
    $("#reserv-my-town, #my-town").remove();
    $("#map-town").empty();
    $("<div id='reserv-my-town' id_reg = '77' id_town = '1' purpose_town = 'Москва'></div>").appendTo("#top-info");  //Сохраняю значение выбранного города
    $("<form name='my-town' id='my-town'></form>").appendTo("#top-info");
    $("<input type='hidden' name='main-id_reg' id='main-id_reg' value='77' />").appendTo("#my-town");
    $("<input type='hidden' name='main-id_town' id='main-id_town' value='1' />").appendTo("#my-town");
    getDataForMapMyTown();
}

function clearClassSearchCar (){
    $("button, select, input").removeAttr("disabled");  //Восстанавливаю кнопы, элементы выбора, поля ввода
    $("a").removeClass("disabled"); //Восстанавливаю ссылки
}

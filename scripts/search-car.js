$("body").on("click", "#link-carnumer-top-search", function(){
    var shablon = /^[авекмнорстух]\d{3}[авекмнорстух]{2}\d{2}(\d)?$/;
    if(!shablon.test($("#input-carnumer-top-search").val())){       // Проверка номера госрегистрации автомобиля при поиске в базе данных
        $("#text-carnumer-top-search").text("Неверный формат");
        $("#hidden-carnumer").val("");//Обнуляю скрытое поле номера машины
        setTimeout(function(){ //Через пять секунд обнуляю поле ввода номера и убираю предупреждение
            $("#text-carnumer-top-search").text("");
            $("#input-carnumer-top-search").val("");
        }, 5000)
    } else {
        $("#hidden-carnumer").val($("#input-carnumer-top-search").val());//Предаю в скрытое поле значение номера машины
        $("#text-carnumer-top-search").text("");    //Убираю надпись "Неверный формат"
        $("#container-map-town").remove();          //Убираю контейнер для карты выбранного города (если переход с главной страницы)
        $("#cabinett").remove();                    //Убираю контейнер для кабинета (если переход из кабинета)
        $("#container-carnumer-search").remove();   //Убираю контейнер для поиска по номеру машины (для результатов нового поиска)
        $("#page-searchh").remove();                //Убираю контейнер для расширенного поиска
        $("#page-insertt").remove();                //Убираю контейнер для вставки видео
        $("#return-to-choice").show();              //Показываю кноп возврата на Главную страницу
        $("<div id='container-carnumer-search'></div>").appendTo("body");
        $("<div id='map-carnumer'></div>").appendTo("#container-carnumer-search");
        $("<table id='table-carnumer'></table>").appendTo("#container-carnumer-search");
        $("<div id='cont-for-carnumer-json-otvet'></div>").appendTo("#container-carnumer-search"); //Контейнер для сохранения результатов поиска
        var data = $("#form-top-search").serializeArray();
        searchCarMap(data);
        $("#input-carnumer-top-search").val("");    //Очищаю поле ввода номера машины
        $("#text-carnumer-top-search").text("");    //Убираю уведомление о неверном формате номера
    }
    $("#new-button-search").removeClass("disabled");
})

function searchCarMap (data) {     //Функция отображения на карте результатов поиска
    $.getJSON("server/search_case.php", data, function (json) {

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
            var myCarMap;
            ymaps.ready(function(){
                myCarMap = new ymaps.Map("map-carnumer",
                    {
                        bounds: [[min_lat, min_long],[max_lat, max_long]] // Определяю границы отображения карты
                    },
                    {
                        searchControlProvider: 'yandex#search'
                    }
                );

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
                    var videos = this['videos'];
                    var dataa = this['dataa'];
                    var times = this['times'];
                    var grades_yes = this['grades_yes'];
                    var grades_no = this['grades_no'];
                    //var violation_style = this['violation_style'];
                    //var violation_color = this['violation_color'];
                    //var images = this['images'];
                    //var proved = this['proved'];
                    //var author = this['author'];
                    //var new_comments = this['comments'];
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
                            //preset: violation_style,
                            //iconColor: violation_color
                        });
                    myCarMap.geoObjects.add(myPlacemark);
                    $("#table-carnumer").append("<tr><td>" + dataa + "</td>" +
                        "<td>" + times + "</td>" +
                        "<td>" + town_name + "</td>" +
                        "<td><a class='selected-carnumer-coords' case_id='" + newid + "' href='#'>" + car_numer + "</a></td>" +
                        "<td>" + violation + "</td></tr>");
                });
            })
        } else {
            alert("По этим условиям ничего не найдено, уточните параметры поиска!!!");
/*            $("#select-regions-search").load("server/regions.php"); //Перезагружаю список регионов
            $("#select-violation-search").load("server/violations.php"); // Загружаю список нарушений для нового запроса
            $("#select-towns-search").empty(); // Удаляю список, но это не решение!!!!!
            $("#violation-search").val(""); // Обнуляю скрытое поле нарушений
            $("#town-search").val("");  // и скрытое поле города*/
            returnToChoice();   //Возвращаюсь на главную страницу (функция в my-script.js)
        }
        $("#cont-for-carnumer-json-otvet").data("carnumer-data", json.otvet);     //Для страницы ПОИСКА НОМЕРА МАШИНЫ сохраняю в элементе div массив json с результатами поиска json.otvet
    })
}

//Нажимаю ссылку класса selected-carnumer-coords для кабинета и вывожу сообщение с id этой ссылки. ЭТО ДЛЯ ПОИСКА МАШИНЫ ПО НОМЕРУ!!!
$("body").on("click", ".selected-carnumer-coords", function () {
    $("#map-carnumer").empty();
    //$("<div id='map-search'></div>").insertAfter("#case-search");
    var selected_case_id = $(this).attr("case_id");
    var array_selected_case = $("#cont-for-carnumer-json-otvet").data("carnumer-data");
    searchMapCarSelected(array_selected_case, selected_case_id);
});

function searchMapCarSelected (data, selected) {     //Отображение на карте результатов поиска и в центре карты выбранного (клик по ссылке) места события
    var center_lat;
    var center_long;
    $.each(data, function () {
        var newid = this['newid'];
        if (newid == selected){                 //Если id события из БД совпадает с id ссылки, то это событие указывается в центре карты
            center_lat = this['latitude'];      //Широта центральной точки
            center_long = this['longitude'];    //Долгота
        }
    });
    var myMap = new ymaps.Map("map-carnumer",

        {
            center: [center_lat, center_long],
            zoom: 12,
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
        //var violation_style = this['violation_style'];
        //var violation_color = this['violation_color'];
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
                //preset: violation_style,
                //iconColor: violation_color
            });
        myMap.geoObjects.add(myPlacemark);
    });
}
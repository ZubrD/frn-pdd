$("body").on("click", "#new-button-insert", function () {
    $("#cabinett").remove();
    $("#return-to-choice").show();
    createPageInsertt();
});

function createPageInsertt(){
    $("<div id='page-insertt'></div>").appendTo("#main-container");
    $("<button id='file-upload'>Загрузка файла</button>").appendTo("#page-insertt");
    $("<button id='link-upload'>Загрузка прямой ссылки</button>").appendTo("#page-insertt");
    $("<div id='sendingstatus' case='1'></div>").appendTo("#page-insertt");   //Вспомогательный контейнер для записи статусов
    //$("<button id='send-data-imit'>Имитация</button>").appendTo("#page-insertt");
}

$("body").on("click", "#file-upload", function(){   //Нажали кноп отправки файла
    $("#file-upload, #link-upload").remove();
    $("<form name='case' id='case' enctype='multipart/form-data' method='post'></form>").appendTo("#page-insertt");
    $("<table id='table-choose-file'>" +
        "<tr><td>Выберите файл для загрузки</td><td><input type='file' name='file' id='fileupload' /></td></tr></table>").appendTo("#case");
    $("<button id='send-video' disabled='disabled'>Отправить видео</button>").appendTo("#page-insertt");    //Кноп по умолчанию заблокирован, чтобы не отправить пустую форму
    $("<div id='progress-title'>Загрузка файла на Youtube</div>").appendTo("#page-insertt").hide();
    $("<div id='progress'></div>").appendTo("#page-insertt");        //Контейнер прогрессбара
})

$("body").on("change", "#case input[type=file]", function () {  //После выбора файла. его имя высвечивается во всплывающем окне
    //alert($("#case input[type=file]").val());
    $("#send-video").removeAttr("disabled");    //Разблокирую кноп отправки файла
});

$("body").on("click", "#link-upload", function(){   //Нажали кноп отправки прямой ссылки
    $("#file-upload, #link-upload").remove();
    $("<div id='div-link-upload'></div>").appendTo("#page-insertt");
    $("<label for='directlink'>Укажите прямую ссылку на видео в Youtube</label>").appendTo("#div-link-upload");
    $("<input type='text' name='directlink' id='directlink' /><br />").appendTo("#div-link-upload");
    $("<button id='send-directlink'>Отправить ссылку</button>").appendTo("#div-link-upload");
})

$("body").on("click", "#send-directlink", function(){
    var directlink = $("#directlink").val();
    var data = "directlink=" + directlink;
    $.get("server/prove_direct_link.php", data, function(otvet){
        if(otvet == "000"){     //Такой ссылки нет, можно работать дальше
            var shablon_times = /^[a-zA-Z0-9\-\_]{11}$/;
            if(!shablon_times.test($("#directlink").val())){
                $("#directlink").addClass("verify-case");
            } else {
                $("#directlink").removeClass("verify-case");
                var video_id = $("#directlink").val();
                $("#sendingstatus").attr({youtube_id: video_id});
                $("#div-link-upload").remove();
                afterUploadVideo();
            }
        }  else {
            insteadAlert("По данному видео уже оформлено заявление");
        }
    });
})

/*$("body").on("click", "#send-directlink", function(){
    var shablon_times = /^[a-zA-Z0-9\-\_]{11}$/;
    if(!shablon_times.test($("#directlink").val())){
        $("#directlink").addClass("verify-case");
    } else {
        $("#directlink").removeClass("verify-case");
        var video_id = $("#directlink").val();
        $("#sendingstatus").attr({youtube_id: video_id});
        $("#div-link-upload").remove();
        afterUploadVideo();
    }
})*/

/*$("body").on("click", "#send-data-imit", function(){    //Имитация загрузки (служебная функция)
    $("#progress, #case, #send-video, #send-data-imit").remove();                            //Удаляю прогрессбар после получения идентификатора видео
    afterUploadVideo();
})*/

$("body").on("click", "#send-video", function () {
    //$("#video_id_map").val($("#directlink").val()); //Прямая ссылка
    var datacase = new FormData($("#case")[0]);
    //$("#send-video, #fileupload").attr({disabled: "disabled"});   //При нажатии кнопа "Отправить видео" делаю его некактивным
    $(this).remove();
    $("<div id='prepare-toyoutube'>Подготовка к загрузке видео на Youtube...</div>").appendTo("#page-insertt");
    $.ajax({
        url: "server/toserver.php",
        data: datacase,
        dataType: "json",
        type: "POST",
        contentType: false,
        processData: false,
        success: function (data){
            if (data.otvet == "111"){
                alert("Слишком большой файл. Максимальный размер " + data.file_size);
                $("#page-insertt").remove();
                createPageInsertt();
            } else {
                $("#sendingstatus").attr({send_file: "sended"})     //Даю знак о начале проверки загрузки чанков на сервер youtube
                $("#sendingstatus").attr({filename: data.otvet})
                var file_to_yout = {filename: data.otvet};
                $.post("server/toyoutube.php", file_to_yout, function(data2){
                    $("#progress, #progress-title, #case, #send-video").remove();                            //Удаляю прогрессбар после получения идентификатора видео
                    $("#sendingstatus").attr({send_file: "finished"});  //Останавливаю запросы к скрипту uploadprogress.php
                    $.each(data2.otvet, function(){    //Расшифровываю ответ
                        afterUploadVideo();
                        var video_id = this['video_id'];
                        //alert(video_id);
                        $("#sendingstatus").attr({youtube_id: video_id});
                        /*                    setTimeout(function(){    //ПРОБЛЕМА!!! Этот блок закрывает собой другие элементы и делает их недоступными
                         $("<div id='uploaded'><iframe width='300' height='200' src='https://www.youtube.com/embed/" + video_id + "' frameborder='0' allowfullscreen></iframe></div>").appendTo("body");
                         },30000);*/
                    })
                }, "json")  //Параметр "json" следует указывать ОБЯЗАТЕЛЬНО!!!!, иначе ответ php скрипта будет воспринят как текст
                /*            $.post("server/author_limit.php", "0", function (inslimit) {
                 if (inslimit == "111"){
                 alert("На сегодняшний день лимит загрузок закончен.")
                 verifySession();          // Если лимит загрузок на сегодня закончился, перехожу на страницу выбора
                 }
                 })*/
            }
        }
    });
});

setInterval(function () {
    if($("#sendingstatus").attr("send_file") == "sended"){  //Запускаю череду запросов о количестве загруженных чанков
        $("#prepare-toyoutube").remove();
        $("#progress-title").show();
        var filename = {filename: $("#sendingstatus").attr("filename")};
        $.post("server/uploadprogress.php", filename, function(prog){
            $("#progress").progressBar({    //Шкала состояния процесса выполнения загрузки на youtube
                width: 300,
                height: false,
                percent: prog.otvet
            });
        }, "json");
    }
}, 5000);

function afterUploadVideo (){
    $("<table id='table-core'><tr><td><div id='left-column'></div></td><td><div id='right-column'></div></td></tr></table>").appendTo("#page-insertt");
    $("<table id='table-selections1'>" +
        "<tr><td>Регион: </td><td>Город: </td><td>Широта: </td><td>Долгота: </td></tr>"+
        "<tr><td><select id='select-regions'></select></td><td><select id='select-towns'></select></td><td><input type='text' name='lat' id='lat' /></td><td><input type='text' name='long' id='long' /></td></tr></table>").appendTo("#left-column");
    $("<table id='table-selections2'><tr><td>Дата и время нарушения: </td><td>Ориентиры (улица, дом, перекрёсток и т.д.)</td></tr>" +
        "<tr><td><input type='text' name='date_of_case' id='datepicker' /><input type='text' name='select-times' id='select-times' /></td><td><input type='text' id='orientir' name='orientir' /></td></tr></table>").appendTo("#left-column");
    $("<table id='table-selections3'><tr><td>Вид нарушения: </td><td>Номер машины: </td><td>Смотреть с:</td></tr>" +
        "<tr><td><select id='select-violation1' class='select-violation'></select></td><td><input type='text' name='car_numer1' id='car_numer1' class='car-numer' placeholder='x000xx000' /></td><td><input type='text' name='see-from' id='see-from' /></td></tr></table>").appendTo("#left-column");
    $("<button id='add-add-case'>++</button>").appendTo("#left-column");
    //$("<button id='test-send'>Проверить</button><br />").appendTo("#page-insertt");
    $("<button id='send-data'>Отправить данные</button>").appendTo("#left-column");
    verifyAdminSession();
    $("<div id='map'></div>").appendTo("#right-column");

    $("<form name='multycase' id='multycase' method='post'></form>").appendTo("#page-insertt");
    $("<input type='hidden' name='video' id='video' />").appendTo("#multycase");
    $("<input type='hidden' name='source-video' id='source-video' />").appendTo("#multycase");       //Идентификатор видео источника (необязательно)
    $("<input type='hidden' name='region' id='region' />").appendTo("#multycase");
    $("<input type='hidden' name='town' id='town' />").appendTo("#multycase");
    $("<input type='hidden' name='dblat' id='dblat' />").appendTo("#multycase");
    $("<input type='hidden' name='dblong' id='dblong' />").appendTo("#multycase");
    $("<input type='hidden' name='date' id='date' />").appendTo("#multycase");
    $("<input type='hidden' name='times' id='times' />").appendTo("#multycase");
    $("<input type='hidden' name='id_gibdd' id='id_gibdd' />").appendTo("#multycase");
    $("<input type='hidden' name='violation1' id='violation1' class='violation' value='' />").appendTo("#multycase");
    $("<input type='hidden' name='dbcar_numer1' id='dbcar_numer1' class='dbcar_numer' value='' />").appendTo("#multycase");

    $("<form name='declaration' id='declaration' method='post'></form>").appendTo("#page-insertt"); //Форма для отправки заявления
    $("<input type='hidden' name='dec-id-gibdd' id='dec-id-gibdd' />").appendTo("#declaration");    //Регистрационный номер заявления, присваиваемый в ГИБДД
    $("<input type='hidden' name='dec-text' id='dec-text' />").appendTo("#declaration");            //Текст заявления
    $("<input type='hidden' name='dec-video' id='dec-video' />").appendTo("#declaration");            //Идентификатор видео
    $("<input type='hidden' name='dec-source-video' id='dec-source-video' />").appendTo("#declaration");            //Идентификатор видео источника (необязательно)
    $("<input type='hidden' name='sended-to-gibdd' id='sended-to-gibdd' />").appendTo("#declaration");            //Заявление было отправлено в ГИБДД?

    $("#datepicker").datepicker($.datepicker.regional["ru"]={      //Настройка календаря
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

    $("#select-times").timepicker({     //Настройка формы ввода времени
        hourText: 'Часы',
        minuteText: 'Минуты',
        amPmText: ['', ''],
        minutes: {
            interval: 1
        }
    });
    $("#select-regions").load("server/regions.php");
    $(".select-violation").load("server/violations.php");
}

//$("#select-regions").change(function (event) { // Как только изменяется поле select, происходит событие event - новый выбор - Эта строка на случай, если элемент существует на момент вызова
$("body").on("change", "#select-regions", function (event) {
    $("#select-regions").removeClass("verify-case");    //Если там было предупреждение, убираю его
    $("#region").val($(event.target).val()); // Передаю в скрытое поле input id региона
    $("#lat, #long, #datepicker").val("");  //Обнуляю значение value полей "Широта", "Долгота" и "Дата"
    $('[value="00"]', event.target).remove();   // Убираю строчку Select region из списка
    var data = "data=" + $(event.target).val();     //Данные для отправки запроса GET на сервер; val - это значение value выбранного тега option
    $("#select-towns").load("server/towns.php?" + data); // Загружаю города этого региона
    $.getJSON("server/region-map.php", data, function (json) { // После каждого нового выбора отправляю запрос на сервер с идентификатором региона, указанным в переменной data
        if(json.otvet.length > 0){
            $.each(json.otvet, function () {
                var lat = this['lat'];      //Широта
                var long = this['long'];    //Долгота
                var zoom = 7;
                showMap(lat, long, zoom);         //Вызываю функцию отображения карты и передаю в качестве аргументов широту и долготу
            })
        }
    })
});

//$("#select-towns").change(function (event) { // Как только изменяется поле select, происходит событие event - новый выбор
$("body").on("change", "#select-towns", function (event) {
    $("#select-towns").removeClass("verify-case");    //Если там было предупреждение, убираю его
    $("#town").val($(event.target).val()); // Передаю в скрытое поле input id города
    $("#lat, #long, #datepicker").val("");  //Обнуляю значение value полей "Широта", "Долгота" и "Дата"
    $('[value="00"]', event.target).remove();   // Убираю строку Select town из списка
    var data = "data=" + $(event.target).val() + "&reg=" + $("#select-regions").val();     //Данные для отправки запроса GET на сервер; val - это значение value выбранного тега option
    $.getJSON("server/town-map.php", data, function (json) { // После каждого нового выбора отправляю запрос на сервер с идентификатором региона, указанным в переменной data
        if(json.otvet.length > 0){
            $.each(json.otvet, function () {
                var lat = this['lat'];      //Широта
                var long = this['long'];    //Долгота
                var zoom = 12;
                showMap(lat, long, zoom);         //Вызываю функцию отображения карты и передаю в качестве аргументов широту и долготу
            })
        }
    })
});

$("body").on("change", "#lat", function(){
    $("#verify-insert-lat").text("");    //Если там было предупреждение, убираю его
})

// Проверка номера госрегистрации автомобиля при загрузке в базу данных
$("body").on("blur", ".car-numer", function () {
    var shablon = /^[авекмнорстух]\d{3}[авекмнорстух]{2}\d{2}(\d)?$/;
    if(!shablon.test($(this).val())){
        $(this).addClass("verify-case");
        //alert("Неправильный формат");
        insteadAlert("Неправильный формат номера");
        $("#db" + $(this).attr("id")).val("");  //Добавляю префикс #db и получаю с помощью элемента car_numer элемент #dbcar_numer с номером 1, 2 или 3 (до 10)
    } else {
        $(this).removeClass("verify-case");
        $("#db" + $(this).attr("id")).val($(this).val());
    }
});

$("body").on("change", "#datepicker", function (event) {
    var shablon = /^\d{4}-\d{2}-\d{2}$/;
    if(!shablon.test($("#datepicker").val())){
        $("#datepicker").addClass("verify-case");
        $("#date").val("");    //Обнуляю скрытое поле передачи значения начала интервала дат
    } else {
        $("#date").val($("#datepicker").val());  //Передаю в скрытое поле дату
        $("#datepicker").removeClass("verify-case");
    }
    //$("#date").val($(event.target).val());  //Передаю в скрытое поле дату
});

$("body").on("change", "#select-times", function(){
    var shablon_times = /^(([0,1][0-9])|(2[0-3])):[0-5][0-9]$/;
    if(!shablon_times.test($("#select-times").val())){
        $("#select-times").addClass("verify-case");
        $("#times").val("");//Очищаю скрытое поле
    } else {
        $("#times").val($("#select-times").val());  //Передаю в скрытое поле время
        $("#select-times").removeClass("verify-case");
    }
})

function prove_insert_region() {
    if($("#region").val() == ""){
        $("#select-regions").addClass("verify-case");
        return "111";
    } else {
        $("#verify-insert-region").text("");    //  Регион выбран
        return "222";
    }
}

function prove_insert_town() {
    if($("#town").val() == ""){
        $("#select-towns").addClass("verify-case");    //Если там было предупреждение, убираю его
        return "111";
    } else {
        $("#verify-insert-town").text("");    //  Город выбран
        return "222";
    }
}

function prove_insert_lat() {
    if($("#dblat").val() == ""){
        $("#lat").addClass("verify-case");
        return "111";
    } else {
        $("#lat").removeClass("verify-case");    //  Широта указана
        return "222";
    }
}

function prove_insert_long() {
    if($("#dblong").val() == ""){
        $("#long").addClass("verify-case");
        return "111";
    } else {
        $("#long").removeClass("verify-case");    //  Долгота указана
        return "222";
    }
}

function prove_insert_date() {
    if($("#date").val() == ""){
        $("#datepicker").addClass("verify-case");
        return "111";
    } else {
        $("#datepicker").removeClass("verify-case");    //  Дата указана
        return "222";
    }
}

function prove_insert_time() {
    if($("#times").val() == ""){
        $("#select-times").addClass("verify-case");
        return "111";
    } else {
        $("#select-times").removeClass("verify-case");    //  Дата указана
        return "222";
    }
}

function prove_insert_violation() {
    var empty_violation = 0;
    $(".violation").each(function(){
        if($(this).val() == ""){
            empty_violation = empty_violation + 1
            var name_elem = "#select-" + $(this).attr("id");
            $(name_elem).addClass("verify-case");
        } else {
            var name_elem = "#select-" + $(this).attr("id");
            $(name_elem).removeClass("verify-case");
        }
    })
    if(empty_violation == 0){
        return "222"
    } else {
        return "111"
    }
}

function prove_insert_car() {
    var empty_numer = 0;
    $(".dbcar_numer").each(function(){
        if($(this).val() == ""){
            empty_numer = empty_numer + 1
            var name_elem = "#" + $(this).attr("id").substr(2, 10);
            $(name_elem).addClass("verify-case");
        } else {
            var name_elem = "#" + $(this).attr("id").substr(2, 10);
            $(name_elem).removeClass("verify-case");
        }
    })
    if(empty_numer == 0){
        return "222"
    } else {
        return "111"
    }
}

/*$("body").on("click", "#test-send", function () {
    $("#dblat").val($("#lat").val());   //Передаю в скрытое поле значение широты
    $("#dblong").val($("#long").val());//Предаю в скрытое поле значение долготы
    $("#video").val($("#sendingstatus").attr("youtube_id")) //Идентификатор видео от youtube

    if(prove_insert_region() == "111" || prove_insert_town() == "111" || prove_insert_lat() == "111" ||
        prove_insert_long() == "111" || prove_insert_date() == "111" || prove_insert_time() == "111" ||
        prove_insert_violation() == "111" || prove_insert_car() == "111"){
        alert("Надо заполнить форму полностью");
    } else {
        alert("Данные отправлены!");
    }
});*/

$("body").on("click", "#send-data", function () {
    var num_viols = parseInt($("#sendingstatus").attr("case"));
    var name_multy_viol = "#violation" + $("#sendingstatus").attr("case");                  //Удаляю лишнюю незаполненную строку, открытую по ошибке кнопом "++"
    var name_multy_numer = "#dbcar_numer" + $("#sendingstatus").attr("case");               //Формирую имена элементов для удаления
    var name_select_viol = "#select-violation" + $("#sendingstatus").attr("case");          // -----
    var name_select_numer = "#car_numer" + $("#sendingstatus").attr("case");                // -----
    if(num_viols > 1 && $(name_multy_viol).attr("value") == "" && $(name_multy_numer).attr("value") == ""){  //Если в мультиформе значения value для двух элементов (violation и dbcar_numer) пустые, то
        $(name_select_numer).remove();                                                      // удаляю элементы ввода
        $(name_select_viol).remove();                                                       // -----
        $(name_multy_viol).remove();                                                        // и элементы из мультиформы (форма для отправки данных на сервер)
        $(name_multy_numer).remove();                                                       // -----
        var casenum = parseInt($("#sendingstatus").attr("case")) - 1;   // Извлекаю количество уже добавленных строк и уменьшаю его на единицу
        $("#sendingstatus").attr({case: casenum})   //Сохраняю одновлённое количество строк для нарушений
    }
    $("#dblat").val($("#lat").val());   //Передаю в скрытое поле значение широты
    $("#dblong").val($("#long").val());//Предаю в скрытое поле значение долготы
    $("#video").val($("#sendingstatus").attr("youtube_id")) //Идентификатор видео от youtube
    $("#source-video").val($("#input-source").val());       //Идентификатор видео источника

    if(prove_insert_region() == "111" || prove_insert_town() == "111" || prove_insert_lat() == "111" ||
        prove_insert_long() == "111" || prove_insert_date() == "111" || prove_insert_time() == "111" ||
        prove_insert_violation() == "111" || prove_insert_car() == "111" || makeMessage() == "111"){
        //alert("Надо заполнить форму полностью");
        insteadAlert("Надо заполнить форму полностью")
    } else {
        //verifyAdminSession();
        //alert("Готово для отправки");
        //var datacase = new FormData($("#case")[0]);   // Сериализировать можно только данные, но не файлы

        var datacase = $("#multycase").serializeArray();//Сериализовать нужно только для передачи методом $.post. Для метода $.ajax сериализованные данные не подходят
        $.post("server/case.php", datacase, function(data){
            alert("Успешно");
        }, "json")

        //$("#dec-text").val($("#text-message").val());   //Передаю в скрытое поле текст заявления
        $("#dec-video").val($("#sendingstatus").attr("youtube_id")) //Идентификатор видео от youtube
        $("#dec-source-video").val($("#input-source").val());       //Идентификатор видео источника
        $("#sended-to-gibdd").val("no") //Заявление НЕ было отправлено в ГИБДД, только сформирован его текст

        var datadeclaration = $("#declaration").serializeArray();//Сериализовать нужно только для передачи методом $.post. Для метода $.ajax сериализованные данные не подходят
        $.post("server/declare.php", datadeclaration, function(data){   //Отправка номера и текста заявления в БД
            alert("Успешно");
        }, "json")

        $("#page-insertt").remove();
        createPageInsertt();
    }
});

//Функция отображения карты
function showMap(lat, long, zoom) {
    $("#map").empty();          //Очищаю поле для вывода новой карты
    ymaps.ready(init);
    var myMap;

    function init(){
        myMap = new ymaps.Map("map", {
            center: [lat, long],
            zoom: zoom
        });
        myMap.events.add('click', function (e) {
            if (!myMap.balloon.isOpen()) {
                var coords = e.get('coords');
                $("#lat").val(coords[0]); //Передаю значение широты в поле "Широта"
                $("#long").val(coords[1]); //Передаю значение широты в поле "Долгота"
                $("#verify-insert-lat").text("");    //Если там было предупреждение, убираю его
                $("#verify-insert-long").text("");    //Если там было предупреждение, убираю его
                myMap.balloon.open(coords, {
                    contentHeader:'Событие!',
                    contentBody: '<p>Координаты инцидента: ' + [
                        coords[0].toPrecision(7),
                        coords[1].toPrecision(7)
                    ].join(', ') + '</p>',
                    contentFooter:'<sup>Щелкните еще раз</sup>'
                });
            }
            else {
                myMap.balloon.close();
            }
        });

        myMap.events.add('contextmenu', function (e) {
            myMap.hint.show(e.get('coordPosition'), 'Кто-то щелкнул правой кнопкой');
        });
    }
}

$("body").on("click", "#add-add-case", function(){  //Проверка правильности заполнения полей нарушения и номера машины
    var casenum = parseInt($("#sendingstatus").attr("case"));
    var empty_fields = 0    //Количество незаполненных полей
    $(".select-violation, .select-new-violation").each(function(){ //Проверяю все поля класса
        if($(this).val() == "00"){
           empty_fields = empty_fields + 1; // и если не выбрано нарушение, то увеличиваю значение переменной
           $(this).addClass("verify-case");
        } else {
            $(this).removeClass("verify-case");
        }
    })
    $(".car-numer").each(function(){
        if($(this).val() == ""){
            empty_fields = empty_fields + 1; // и если не выбрано нарушение, то увеличиваю значение переменной
        }
        var shablon = /^[авекмнорстух]\d{3}[авекмнорстух]{2}\d{2}(\d)?$/;
        if(!shablon.test($(this).val())){
            $(this).addClass("verify-case");
            empty_fields = empty_fields + 1; // и если не выбрано нарушение, то увеличиваю значение переменной
        } else {
            $(this).removeClass("verify-case"); //Убираю красную заливку
        }
    })

    if(empty_fields == 0){  //Если незаполненных полей нет и ...
        if(casenum < 10){   // количество нарушений не превышает 10, то добавляю новую строку для нарушения
            var casenum = parseInt($("#sendingstatus").attr("case")) + 1;   // Извлекаю количество уже добавленных строк и увеличиваю его на единицу
            $("#sendingstatus").attr({case: casenum})   //Сохраняю одновлённое количество строк для нарушений
            $("<tr><td><select id='select-violation" + casenum + "' class='select-violation'></select></td><td><input type='text' name='car_numer" + casenum + "' id='car_numer" + casenum + "' class='car-numer' placeholder='x000xx000'/></td><td><span id='format" + casenum + "'></span></td></tr>").appendTo("#table-selections3");
            $(".select-violation").load("server/violations.php");   //Загружаю список нарушений в новое ноле
            $("<input type='hidden' name='violation" + casenum + "' id='violation" + casenum + "' class='violation' value=''/>").appendTo("#multycase");
            $("<input type='hidden' name='dbcar_numer" + casenum + "' id='dbcar_numer" + casenum + "' class='dbcar_numer' value=''/>").appendTo("#multycase");
        } else {
            //alert("Больше 10 нарушений нельзя")
            insteadAlert("Больше 10 нарушений нельзя")
        }
    } else {
        //alert("Сначала нужно заполнить то, что есть")
        insteadAlert("Сначала нужно заполнить то, что есть")
    }
})

$("body").on("change", ".select-new-violation", function (event) {
    var name_elem = "#" + $(this).attr("id").substr(7, 20);
    $(name_elem).val($(event.target).val());
});

$("body").on("change", ".select-violation", function(event){    //Первый выбор, затем класс уничтожается и создаётся новый select-new-violation
    var name_elem = "#" + $(this).attr("id").substr(7, 20);
    $(name_elem).val($(event.target).val());
    $(this).removeClass("select-violation");    //Удаляю класс, для того, чтобы при добавлении новой строки в уже заполненное поле не загружался список нарушений из базы и, тем самым, не стиралось выбранное значение
    $(this).addClass("select-new-violation");
});

$("body").on("click", "#open-form-message", function(){             //Открываю бланк формирования письма
    var num_viols = parseInt($("#sendingstatus").attr("case"));
    var name_multy_viol = "#violation" + $("#sendingstatus").attr("case");                  //Удаляю лишнюю незаполненную строку, открытую по ошибке кнопом "++"
    var name_multy_numer = "#dbcar_numer" + $("#sendingstatus").attr("case");               //Формирую имена элементов для удаления
    var name_select_viol = "#select-violation" + $("#sendingstatus").attr("case");          // -----
    var name_select_numer = "#car_numer" + $("#sendingstatus").attr("case");                // -----
    if(num_viols > 1 && $(name_multy_viol).attr("value") == "" && $(name_multy_numer).attr("value") == ""){  //Если в мультиформе значения value для двух элементов (violation и dbcar_numer) пустые, то
        $(name_select_numer).remove();                                                      // удаляю элементы ввода
        $(name_select_viol).remove();                                                       // -----
        $(name_multy_viol).remove();                                                        // и элементы из мультиформы (форма для отправки данных на сервер)
        $(name_multy_numer).remove();                                                       // -----
        var casenum = parseInt($("#sendingstatus").attr("case")) - 1;   // Извлекаю количество уже добавленных строк и уменьшаю его на единицу
        $("#sendingstatus").attr({case: casenum})   //Сохраняю одновлённое количество строк для нарушений
    }
    $("#dblat").val($("#lat").val());   //Передаю в скрытое поле значение широты
    $("#dblong").val($("#long").val());//Предаю в скрытое поле значение долготы
    $("#video").val($("#sendingstatus").attr("youtube_id")) //Идентификатор видео от youtube

    if(prove_insert_region() == "111" || prove_insert_town() == "111" || prove_insert_lat() == "111" ||
        prove_insert_long() == "111" || prove_insert_date() == "111" || prove_insert_time() == "111" ||
        prove_insert_violation() == "111" || prove_insert_car() == "111"){
        //alert("Надо заполнить форму полностью");
        insteadAlert("Надо заполнить форму полностью")
    } else {
        $("<div id='container-message'></div>").appendTo("#page-insertt");
        var left = $(window).width()/2 - 300 + "px";            //Выравниваю по центру блок со вспомогательной информацией
        $("#container-message").css({width: "600", left: left});   //---
        $("button, select, input").not("input[type='hidden']").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме скрытого типа
        $("a, img").addClass("disabled");  //Дезактивирую все ссылки
        $("<div id='title-message'>Текст заявления в ГИБДД</div>").appendTo("#container-message");
        $("<div id='form-message'></div>").appendTo("#container-message");
        $("<label for='email-gibdd'>Электронная почта</label><input id='email-gibdd' type='text' value='webmaster@frn-pdd.ru' /><br />").appendTo("#form-message");
        $("<textarea id='text-message'></textarea>").appendTo("#form-message");
        $("<label for='id-message-gibdd'>Идентификатор письма в ГИБДД</label><input id='id-message-gibdd' type='text' /><br />").appendTo("#form-message");
        $("<button id='close-form-message'>Закрыть письмо</button>").appendTo("#form-message");
        $("<button id='send-data-and-message'>Сохранить письмо и данные</button>").appendTo("#form-message");
        makeMessage();
    }
})

$("body").on("click", "#close-form-message", function(){    //Закрываю страницу формирования письма без отправки данных в БД
    $("#container-message").remove();
    enableMineLinksButtons()    //в файле help.js
})

$("body").on("click", "#send-data-and-message", function(){
    $("#id_gibdd").val($("#id-message-gibdd").val());   //Передаю в скрытое поле значение идентификатора письма в ГИБДД
    var datacase = $("#multycase").serializeArray();//Сериализовать нужно только для передачи методом $.post. Для метода $.ajax сериализованные данные не подходят
    $.post("server/case.php", datacase, function(data){
        alert("Успешно");
    }, "json")

    $("#dec-text").val($("#text-message").val());   //Передаю в скрытое поле текст заявления
    $("#dec-id-gibdd").val($("#id-message-gibdd").val());   //Передаю в скрытое поле регистрационный номер заявления, присвоенный в ГИБДД
    $("#dec-video").val($("#sendingstatus").attr("youtube_id")) //Идентификатор видео от youtube

    var datadeclaration = $("#declaration").serializeArray();//Сериализовать нужно только для передачи методом $.post. Для метода $.ajax сериализованные данные не подходят
    $.post("server/declare.php", datadeclaration, function(data){   //Отправка номера и текста заявления в БД
        alert("Успешно");
    }, "json")

    $("#page-insertt").remove();
    enableMineLinksButtons()    //в файле help.js
    createPageInsertt();
})

$("body").on("click", "#complex-message", function(){
    $("<div id='container-message'></div>").appendTo("#page-insertt");
    var left = $(window).width()/2 - 300 + "px";            //Выравниваю по центру блок со вспомогательной информацией
    $("#container-message").css({width: "600", left: left});   //---
    $("button, select, input").not("input[type='hidden']").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме скрытого типа
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки
    $("<div id='title-message'>Сводное письмо в ГИБДД</div>").appendTo("#container-message");
    $("<div id='form-complex-message'></div>").appendTo("#container-message");
    $("<input type='text' id='video-complex-message' name='video-complex-message' />").appendTo("#form-complex-message");
    $("<button id='search-video-complex-message'>Найти видео</button><label>webmaster@frn-pdd.ru</label><br />").appendTo("#form-complex-message");
    $("<textarea id='text-message'></textarea>").appendTo("#form-complex-message");
    $("<label for='id-message-gibdd'>Идентификатор письма в ГИБДД</label><input id='id-message-gibdd' type='text' /><br />").appendTo("#form-complex-message");
    $("<button id='close-form-message'>Закрыть письмо</button>").appendTo("#form-complex-message");
    $("<button id='send-complex-message'>Сохранить письмо и данные</button>").appendTo("#form-complex-message");
})

$("body").on("click", "#send-complex-message", function(){
    $("#dec-text").val($("#text-message").val());   //Передаю в скрытое поле текст заявления
    $("#dec-id-gibdd").val($("#id-message-gibdd").val());   //Передаю в скрытое поле регистрационный номер заявления, присвоенный в ГИБДД
    $("#dec-video").val("Complex" + $("#video-complex-message").val()) //Идентификатор видео от youtube

    var datadeclaration = $("#declaration").serializeArray();//Сериализовать нужно только для передачи методом $.post. Для метода $.ajax сериализованные данные не подходят
    $.post("server/declare.php", datadeclaration, function(data){   //Отправка номера и текста заявления в БД
        alert("Успешно");
    }, "json")

    $("#page-insertt").remove();
    enableMineLinksButtons()    //в файле help.js
    createPageInsertt();
})

$("body").on("click", "#search-video-complex-message", function(){
    var data = $("#video-complex-message").serialize();
    $.post("server/complex_letter.php", data, function(otvet){
        $("#text-message").text(otvet);
    })
})

function verifyAdminSession (){ //Если пользователь имеет статус админа, то может сформировать письмо и отправить данные
    $.post("server/verify_admin.php", "0", function (data) {
        if(data == 111){                            // это админ (для формирования письма)
            //$("<button id='open-form-message'>Сформировать письмо</button>").appendTo("#left-column");
            //$("<button id='complex-message'>Сводное письмо</button><br />").appendTo("#left-column");
            $("<input type='text' id='input-source' placeholder='Источник видео'/><br />").appendTo("#left-column");
        }
    });
}

function makeMessage(){
    var num_viols = parseInt($("#sendingstatus").attr("case"));
    if($("#see-from").val() != ""){
        var message1_1 = " (смотреть с " + $("#see-from").val() + ")";
    } else {
        var message1_1 = "";
    }
    var message1 = "Из открытых источников (https://www.youtube.com/watch?v=" + $("#sendingstatus").attr("youtube_id") + ")" + message1_1 + " я узнал, что "
        + $("#datepicker").val() + ", примерно в " + $("#select-times").val() + " в г." + $("#select-towns option:selected").text()
        + " (координаты GPS/GLONASS N" + $("#lat").val() + ", E" + $("#long").val() + "), " + $("#orientir").val() + ", ";
    if(num_viols == 1){
        var message2 = " автомобилем с государственным регистрационным номером " + $("#car_numer1").val() + " было совершено следующее нарушение ПДД: "
            + $("#select-violation1 option:selected").text().toLowerCase() + "."
        var message3 = " Видеосвидетельство данного правонарушения приведено по указанному выше интернет адресу.";
        var message4 = message1 + message2 + message3;
    } else if(num_viols > 1) {
        var message2 = " были совершены следующие нарушения ПДД: "
        var message7 = "";
        for(i = 1; i < num_viols + 1; i ++){
            message7 = message7 + "автомобиль номер " + $("#car_numer" + i).val() + ": " + $("#select-violation" + i + " option:selected").text() + "; ";
        }
        message7 = message7.substr(0, message7.length-2).toLowerCase() + ".";
        var message3 = " Видеосвидетельство данных правонарушений приведено по указанному выше интернет адресу.";
        var message4 = message1 + message2 + message7;
    }
    var message5 = /*" Согласно ст. 1.5. КОАП РФ презумпция невиновности не распространяется на случаи нарушений главы 12 кодекса при фиксации нарушения <...> средствами фото- и киносъемки, видеозаписи. " +
        "Согласно ст. 28.1.4 КОАП РФ, фиксация нарушения средствами фото- и киносъемки, видеозаписи, является поводом для возбуждения дела об административном правонарушении. " +
        "Согласно ст. 28.6 КОАП РФ, в случае фиксации нарушения средствами фото- и киносъемки, видеозаписи, постановление по делу выносится без участия лица, " +
        "в отношении которого возбуждено дело об административном правонарушении, и оформляется в порядке, предусмотренном статьей 29.10 КОАП РФ. " +
        "Согласно ст. 2.6.1. КОАП РФ, за административные правонарушения в области дорожного движения в случае их фиксации <...> средствами фото- и киносъемки, " +
        "видеозаписи, привлекаются собственники (владельцы) транспортных средств. Я лично ознакомлен со следующими статьями: " +
        "ст. 51 Конституции РФ, ст. 25.6 КоАП РФ, ст. 17.7, 17.9, 19.7 КоАП РФ и мне они ясны и понятны. " +*/
        " Прошу, на основании вышеизложенного, привлечь к административной ответственности нарушителя ПДД, " +
        "о результатах прошу сообщить мне по электронной почте в установленные законом сроки. " +
        //"В переписке прошу ссылаться на текст исходного обращения или номер нарушителя." +
        "Спасибо. ";
    var message = message4 + message5;
    $("#text-message").text(message);
    $("#dec-text").val(message);//Предаю в скрытое поле текст заявления
    return "222";
}

function insteadAlert (data){
    $("<div id='instead-alert'></div>").appendTo("#main-container");
    var left = $(window).width()/2 - 300 + "px";            //Выравниваю по центру блок со вспомогательной информацией
    $("#instead-alert").css({width: "600", height: "200", left: left});   //---
    $("<div id='instead-alert-text'>" + data + "</div>").appendTo("#instead-alert");
    $("button, select, input").not("input[type='hidden']").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме скрытого типа
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки
    $("<button id='close-instead-alert'>Закрыть</button>").appendTo("#instead-alert");
}

$("body").on("click", "#close-instead-alert", function(){
    $("#instead-alert").remove();
    enableMineLinksButtons()    //в файле my-script.js
})

/*
$("body").on("click", "#send-data", function () {
    //$("#send-data").submit(function () {
    $("#dblat").val($("#lat").val());   //Передаю в скрытое поле значение широты
    $("#dblong").val($("#long").val());//Передаю в скрытое поле значение долготы
    $("#video_id_map").val($("#directlink").val()); //Прямая ссылка

    if(prove_insert_region() == "111" || prove_insert_town() == "111" || prove_insert_lat() == "111" ||
        prove_insert_long() == "111" || prove_insert_date() == "111" || prove_insert_time() == "111" ||
        prove_insert_violation() == "111" || prove_insert_car() == "111" || prove_insert_file() == "111"){
        alert("Надо заполнить форму полностью");
    } else {
        //alert("Готово для отправки");
        //var datacase = $("#case").serializeArray(); // Сериализировать можно только данные, но не файлы
        var datacase = new FormData($("#case")[0]);
        //$.post("server/case.php", datacase);
        $.ajax({
            url: "server/case.php",
            data: datacase,
            dataType: "json",
            type: "POST",
            contentType: false,
            processData: false,
            success: function (data){
                alert("Успешно");
                $.post("server/author_limit.php", "0", function (inslimit) {
                    if (inslimit == "111"){
                        alert("На сегодняшний день лимит загрузок закончен.")
                        verifySession();          // Если лимит загрузок на сегодня закончился, перехожу на страницу выбора
                    }
                })
            }
        });
        $("#select-regions").load("server/regions.php");
        $("#select-violation").load("server/violations.php");
        $("#select-towns, #lat, #long, #datepicker, #select-times, #car_numer, #directlink").val("");  //Обнуляю значение value полей "Широта", "Долгота", "Дата", "Время", "Номер машины", "Прямая ссылка"
    }
});*/

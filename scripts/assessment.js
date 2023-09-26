$("body").on("click", ".finger-up", function () {   //Положительная оценка видео (палец вверх)
    disableSearchElements();
    var case_id = $(this).attr("case_id");
    $("<div id='finger-up-prove'>" +
        "<div id='finger-up-title'><span>Поддерживаю</span>, это нарушение ПДД</div>" +
        "<button class='assess' id='finger-up-yes' case_id='"+ case_id +"'>ДА</button>" +
        "<button class='assess' id='finger-up-no' case_id='"+ case_id +"'>Нет</button>" +
        "</div>").appendTo("#page-searchh");
});

$("body").on("click", "#finger-up-yes", function(){ //Если нажимаю кноп ДА,
    var case_id = $(this).attr("case_id");
    var assess_data = {good_assess_case_id: case_id};
    $.getJSON("server/assessment.php", assess_data);    //Положительная оценка (передаю в БД)
    $(".finger-up[case_id='"+ case_id +"']").css({display: 'none'});    //Картинку "палец вверх" делаю невидимой (фильтрую по атрибуту case_id)
    $(".finger-down[case_id='"+ case_id +"']").css({display: 'none'});  //Картинку "палец вниз" делаю невидимой (фильтрую по атрибуту case_id)
    $(".green-sq[case_id='"+ case_id +"']").css({display: 'block'});    //Картинку "зелёный квадрат" делаю видимой (фильтрую по атрибуту case_id)
    $("#finger-up-prove").remove();
    enableSearchElements();
});

$("body").on("click", "#finger-up-no", function(){
    $("#finger-up-prove").remove();
    enableSearchElements();
})

$("body").on("click", ".finger-down", function () {   //Отрицательная оценка видео (палец вниз)
    disableSearchElements();
    var case_id = $(this).attr("case_id");
    $("<div id='finger-down-prove'>" +
        "<div id='finger-down-title'><span>Не согласен</span>, нарушения не было</div>" +
        "<button class='assess' id='finger-down-yes' case_id='"+ case_id +"'>ДА</button>" +
        "<button class='assess' id='finger-down-no' case_id='"+ case_id +"'>Нет</button>" +
        "</div>").appendTo("#page-searchh");
});

$("body").on("click", "#finger-down-yes", function(){
    var case_id = $(this).attr("case_id");
    var assess_data = {bad_assess_case_id: case_id};
    $.getJSON("server/assessment.php", assess_data);    //Отрицательная оценка
    $(".finger-up[case_id='"+ case_id +"']").css({display: 'none'});    //Картинку "палец вверх" делаю невидимой (фильтрую по атрибуту case_id)
    $(".finger-down[case_id='"+ case_id +"']").css({display: 'none'});  //Картинку "палец вниз" делаю невидимой (фильтрую по атрибуту case_id)
    $(".red-sq[case_id='"+ case_id +"']").css({display: 'block'});    //Картинку "красный квадрат" делаю видимой (фильтрую по атрибуту case_id)
    $("#finger-down-prove").remove();
    enableSearchElements();
})

$("body").on("click", "#finger-down-no", function(){
    $("#finger-down-prove").remove();
    enableSearchElements();
})

function allowAssessment() {
    $.getJSON("server/select_grades.php", "0", function (data) {  //Получаю список оценённых событий
        $.each(data.otvet, function () {
            var case_id = this['case_id'];
            $(".finger-up").each(function () { //Проверяю атрибут case_id каждого элемента класса .finger-up
                if (case_id == $(this).attr('case_id')) {   //Если case_id из БД совпадает со значением атрибута case_id элемента класса finger-up,
                    $(this).css({display: 'none'});   //то этот элемент делаю невидимым
                }
            });
            $(".finger-down").each(function () { //Проверяю атрибут case_id каждого элемента класса .finger-down
                if (case_id == $(this).attr('case_id')) {   //Если case_id из БД совпадает со значением атрибута case_id элемента класса finger-down,
                    $(this).css({display: 'none'});   //то этот элемент делаю невидимым
                }
            });
            $(".grades-yes").each(function () {
                if (case_id ==  $(this).attr('case_id')){
                    $(this).css({display:  'inline-block'});
                }
            })
            $(".grades-no").each(function () {
                if (case_id ==  $(this).attr('case_id')){
                    $(this).css({display:  'block'});
                }
            })
        })
    });
}

function disableSearchElements (){
    $("button, select, input").not(".assess").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме тех, что с классом assess
    $("a, img").addClass("disabled");  //Дезактивирую все ссылки и все картинки
}

function enableSearchElements (){
    $("button, select, input").removeAttr("disabled");  //Восстанавливаю кнопы, элементы выбора, поля ввода
    $("a, img").removeClass("disabled"); //Восстанавливаю ссылки
}
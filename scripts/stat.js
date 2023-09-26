$("body").on("click", "#link-stat", function(){
    $("#container-purpose-town").remove();
    //clearClassSearchCar();  //Делаю ссылки на поиск машины и расширенный поиск снова активными
    $("<div id='container-stat'></div>").appendTo("body");
    $("<table id='table-stat-regions'></table>").appendTo("#container-stat");
    $("<tr><td>Регион</td><td>Нарушений</td><td>В ГИБДД</td><td><button id='stat-close'>Закрыть</button></td></tr>").appendTo("#table-stat-regions");
    $.getJSON("server/stat-reg.php", "000", function(json){
        //alert(json.otvet[0]['region']);
        $.each(json.otvet, function(){
            var region = this['region'];
            var cases = this['cases'];
            var cases_dec = this['cases_dec'];
            $("<tr><td>" + region + "</td><td>" + cases + "</td><td>" + cases_dec + "</td></tr>").appendTo("#table-stat-regions");
        })
    })
})

$("body").on("click", "#stat-close", function(){
    $("#container-stat").remove();
    clearClassSearchCar();  //Делаю ссылки на поиск машины и расширенный поиск снова активными
})
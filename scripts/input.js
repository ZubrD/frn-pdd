$(document).ready(function(){
    $("#send-region").click(function () {
        var data = $("#inputregion").serializeArray(); // В форме должно быть обязательно указано name

        $.post("server/input-region.php", data, function () {
            alert("Отправил");
        }, "json");
    });
});
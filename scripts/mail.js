$("#message, #email").val("");
$("#send-mail").click(function () {
    var data = $("#form-mail").serializeArray();
    $.post("server/mail.php", data, function (resp) {
        alert("Письмо отправлено по адресу " + resp);
    });

})
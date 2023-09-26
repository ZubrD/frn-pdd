$("body").on("click", "#button-registr", function () {
    $("#page-start").hide();
    $("<div id='page-registr'></div>").appendTo("body");
    $("<h2 id='registr-titul'>Регистрация</h2><br />").appendTo("#page-registr");
    $("<form id='form-registr'></form>").appendTo("#page-registr");
    $("<table><tr><td><label for='registr-login'>Ваш логин</label></td><td><input type='text' name='registr-login' class='registrs' id='registr-login' placeholder='4-8 символов латиницы или цифры' /></td><td><span id='verify-login'></span></td></tr>" +
        "<tr><td><label for='registr-parol'>Пароль</label></td><td><input type='text' name='registr-parol' class='registrs' id='registr-parol' placeholder='4-8 символов латиницы или цифры' /></td><td><span id='verify-parol'></span></td></tr>" +
        "<tr><td><label for='registr-reparol'>Повторите пароль</label></td><td><input type='text' name='registr-reparol' class='registrs' id='registr-reparol' /></td><td><span id='verify-reparol'></span></td></tr>" +
        "<tr><td><label for='registr-email'>Email</label></td><td><input type='text' name='registr-email' class='registrs' id='registr-email' /></td><td><span id='verify-email'></span></td></tr></table><br />").appendTo("#form-registr");
    $("<button class='registrs' id='button-send-registr'>Зарегистрироваться</button>").appendTo("#page-registr");
    $("<button class='registrs' id='button-close-registr'>Закрыть</button>").appendTo("#page-registr");
    disableRegistrLinksButtons();   //Дезактивирую ссылки и кнопы
});

$("body").on("blur", "#registr-login", function () {
    prove_login();
});

$("body").on("blur", "#registr-parol", function () {
    prove_parol();
});

$("body").on("blur", "#registr-reparol", function () {
    prove_reparol();
});

$("body").on("blur", "#registr-email", function () {
    prove_email();
});

$("body").on("click", "#button-send-registr", function () {
    prove_login();
    prove_parol();
    prove_reparol();
    prove_email();
    var prov_data_login = $("#registr-login").data("test").flag;
    if(prove_parol() == "111" || prove_reparol() == "111" || prov_data_login == "111" || prove_email() == "111"){
        //alert("Нельзя передавать");
    } else {
        var data = $("#form-registr").serializeArray();
        $.post("server/registr.php", data);
        alert("Вам было отправлено письмо, пройдите поссылке, чтобы завершить регистрацию.");
        enableRegistrLinksButtons();    //Восстанавливаю ссылки и кнопы
        $("#page-registr").remove();
        $("#page-start").show();
        //startingPage();
    }
});

$("body").on("click", "#button-close-registr", function(){      //Событие закрытия формы регистрации
    $("#page-registr").remove();                                //Удалить окно регистрации
    $("#page-start").show();                                    //Сделать видимыми кнопы Входи и Регистрация
    enableRegistrLinksButtons();
})

function prove_login() {
    var shablon_text = /^[a-zA-Z0-9]{4,8}$/;
    if(!shablon_text.test($("#registr-login").val())){
        //$("#page-registr").removeClass("page-registr-normal");
        //$("#page-registr").addClass("page-registr-error");
        $("#verify-login").text("Ошибка");
        $("#registr-login").val("");    //Очищаю поле ввода
        $("#registr-login").data("test", {flag: "111"}); //Передаю данные о неправильном шаблоне через поле
    } else {
        var data = "registr-login=" + $("#registr-login").val();
        $.get("server/verify_login_registr.php", data, function (otvet) {
            if(otvet == "111"){
                $("#verify-login").text("Логин занят"); //Такой логин есть!!!
                $("#registr-login").data("test", {flag: "111"}); //Передаю данные о занятости через поле
            } else if(otvet == "222"){
                $("#verify-login").text("");    //Логин свободен!!!
                $("#registr-login").data("test", {flag: "222"}); //Передаю данные о занятости через поле
            }
        });
    }
}

function prove_parol() {
    var shablon_parol_text = /^[a-zA-Z0-9]{4,8}$/;
    if(!shablon_parol_text.test($("#registr-parol").val())){
        $("#verify-parol").text("Ошибка");
        $("#registr-parol").val("");    //Очищаю поле ввода
        return "111";
    } else {
        $("#verify-parol").text("");    // Пароль правильный
    }
}

function prove_reparol() {
    if(!($("#registr-parol").val() == $("#registr-reparol").val())){
        $("#verify-reparol").text("Ошибка");
        return "111";
    } else {
        $("#verify-reparol").text("");    // Правильно повторили пароль
    }
}

/*function prove_email() {  //Без проверки на уникальность
    var shablon_email = /^[a-zA-Z0-9][a-zA-Z0-9\._\-&!?=#]{1,20}@[a-zA-Z0-9]{1,10}\.[a-zA-Z]{2,5}$/;
    if(!shablon_email.test($("#registr-email").val())){
        $("#verify-email").text("Ошибка");
        return "111";
    } else {
        $("#verify-email").text("");    // Правильный email
    }
}*/

function prove_email() {
    var shablon_email = /^[a-zA-Z0-9][a-zA-Z0-9\._\-&!?=#]{1,30}@[a-zA-Z0-9]{1,10}\.[a-zA-Z]{2,5}$/;
    if(!shablon_email.test($("#registr-email").val())){
        $("#verify-email").text("Ошибка");
        return "111";
    } else {
        $("#verify-email").text("");    // Правильный email
        var data = "registr-email=" + $("#registr-email").val();
        $.get("server/verify_email_registr.php", data, function (otvet) {
            if(otvet == "111"){
                $("#verify-email").text("Email занят"); //Такой email есть!!!
                return "111";
            } else if(otvet == "222"){
                $("#verify-email").text("");    //Email свободен!!!
            }
        });
    }
}

function disableRegistrLinksButtons (){
/*    $("#help-link, #link-carnumer-top-search, #new-button-search, #link-change-town").addClass("disabled"); //Дезактивирую ссылки
    $("#new-button-login, #button-registr, .button-my-town-filter, #send-login, #refuse-send-login").attr({disabled: "disabled"});   ///Дезактивирую кнопы*/
    $("button, select, input").not(".registrs").attr({disabled: "disabled"});    //Дезактивирую кнопы, элементы выбора, поля ввода, кроме тех, что с классом registrs
    $("a").addClass("disabled");  //Дезактивирую все ссылки
}

function enableRegistrLinksButtons (){
/*    $("#help-link, #link-carnumer-top-search, #new-button-search, #link-change-town").removeClass("disabled"); //Восстанавливаю ссылки
    $("#new-button-login, #button-registr, .button-my-town-filter, #send-login, #refuse-send-login").removeAttr("disabled");   ///Восстанавливаю кнопы*/
    $("button, select, input").removeAttr("disabled");  //Восстанавливаю кнопы, элементы выбора, поля ввода
    $("a").removeClass("disabled"); //Восстанавливаю ссылки
}
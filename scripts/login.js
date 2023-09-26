$("body").on("click", "#new-button-login", function () {        //Решил войти в систему
    $("#new-button-login, #button-registr").remove();
    $("<form name='form_login' id='form_login' method='post' action='#'></form>").appendTo("#page-start");
    $("<input type='text' name='name_login' id='name_login' placeholder='Логин' />").appendTo("#form_login");
    $("<input type='password' name='name_password' id='name_password' placeholder='Пароль' />").appendTo("#form_login");
    $("<button id='send-login'>Отправить</button>").appendTo("#page-start");
    $("<button id='refuse-send-login'>Нет</button>").appendTo("#page-start");
    $("<div id='forget-login'><a id='forget-login-link' href='#'></a></div>").appendTo("#page-start");
});

$("body").on("click", "#send-login", function () {              //Отправить пароль для проверки
    var datalogin = $("#form_login").serializeArray();
    $.post("server/login.php", datalogin, function (data) {
        var login_returned = data;
        if (data == 111){
            //alert ("Правильный ответ!!!");
            $("#form_login, #send-login, #refuse-send-login").remove(); //Удаляю форму и кнопы запроса входа в систему
            $("<button id='new-button-cabinet'>Мой кабинет</button>").appendTo("#page-start");
            $("<button id='new-button-logout'>Выход</button>").appendTo("#page-start");
            //$("#loginn").remove();
            //startingPageLogined();
        } else if(data == 000) {
            alert ("Ответ неправильный!!!");
            $("#forget-login-link").text("Забыли логин или пароль?");
        } else if (data == 222) {
            alert("Нет такого пользователя!!!");
            $("#forget-login-link").text("Забыли логин или пароль?");
        } else if (data == 333){
            alert("Вы не завершили регистрацию!!!");
        }
    });
});

$("body").on("click", "#refuse-send-login", function(){         //Отказ от входа в систему
    $("#form_login, #send-login, #refuse-send-login, #forget-login").remove(); //Удаляю форму и кнопы запроса входа в систему, запрос о восстановлении
    $("<button id='new-button-login'>Вход</button>").appendTo("#page-start");
    $("<button id='button-registr'>Регистрация</button>").appendTo("#page-start");
});

$("body").on("click", "#forget-login-link", function(){     //Переход к процедуре восстановления логина и пароля
    $("#name_login, #name_password").val("");   //Обнуляю поля ввода логина и пароля
    $("#forget-login").remove();                //Удаляю вопрос о забывчивости
    //$("#page-start").hide();
    $("<div id='renewal-login'></div>").appendTo("body");
    $("<h2>Восстановление доступа к аккаунту</h2><br />").appendTo("#renewal-login");
    $("<form id='form-renewal'></form>").appendTo("#renewal-login");
    $("<table><tr><td><label for='renewal-email'>Email при регистрации</label></td>" +
        "<td><input type='text' name='renewal-email' id='renewal-email' /></td>" +
        "<td><span id='verify-renewal'></span></td></tr></table><br />").appendTo("#form-renewal");
    $("<button id='button-send-renewal-email'>Проверить email</button>").appendTo("#renewal-login");
    $("<button id='button-close-renewal'>Закрыть</button>").appendTo("#renewal-login");
})

$("body").on("click", "#button-send-renewal-email", function(){
    var data = "renewal-login=" + $("#renewal-email").val();
    $.get("server/verify_renewal_email.php", data, function (otvet) {
        if(otvet == "111"){
            $("#verify-renewal").text("Такого адреса нет"); //Такой логин есть!!!
        } else if(otvet == "222"){
            $("#renewal-login").remove();
            $("#page-start").empty();
            $("<button id='new-button-login'>Вход</button>").appendTo("#page-start");
            $("<button id='button-registr'>Регистрация</button>").appendTo("#page-start");
            //$("#verify-renewal").text("");    //Логин свободен!!!
            alert("Вам было направлено письмо по указанному адресу, пройдите по ссылке, чтобы восстановить доступ к аккаунту")
        }
    });
})

$("body").on("click", "#button-close-renewal", function(){
    $("#renewal-login").remove();
    $("#page-start").empty();
    $("<button id='new-button-login'>Вход</button>").appendTo("#page-start");
    $("<button id='button-registr'>Регистрация</button>").appendTo("#page-start");
})

$("body").on("click", "#new-button-logout", function () {       //Выход из системы
    $.post("server/logout.php", "0", function (data) {
        if(data == 777){
            $("#new-button-cabinet, #new-button-settings, #new-button-logout").remove();
            $("<button id='new-button-login'>Вход</button>").appendTo("#page-start");
            $("<button id='button-registr'>Регистрация</button>").appendTo("#page-start");
        }
    });
});


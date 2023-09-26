<?php
    require_once ('connectvars.php');
    $log = $_POST['registr-login'];
    $parol = $_POST['registr-parol'];
    $email = $_POST['registr-email'];
    $kod = md5(rand(0, 1000000000));

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись
    $query = "INSERT INTO volontiers SET login = '$log', password = md5($parol), email = '$email', registered = NOW(), verified = 'no', kod = '$kod'";
    mysqli_query($dbc, $query) or die("Ошибка при добавлении данных в таблицу");
    mysqli_close($dbc);

    $post_msg = $_POST['message'];

    $get_data = "www.forma03.info/cont/server/mail_back.php?factor1=" . $kod;
    $msg = "<a href='$get_data'>Пройдите по этой ссылке, чтобы завершить регистрацию</a>";
    //$msg .= " " . md5("111");
    //$msg = "Регистрация пользователя " . $log;
    $subject = "Send maill";
    $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: fort@forma03.info\r\n"; //Наименование и почта отправителя
    mail($email, $subject, $msg, $headers);
    echo rand(0, 1000000000);
?>
<?php
    require_once ('connectvars.php');

    $kod = md5(rand(0, 1000000000));
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $email = $_GET['renewal-login'];

    $query = "SELECT * FROM volontiers WHERE email = '$email'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $otvet = mysqli_num_rows($result);
    while($row = mysqli_fetch_array($result)){
        $login = $row['login'];
    }
    if($otvet == 1){
        $query2 = "UPDATE volontiers SET kod = '$kod' WHERE email = '$email'";
        mysqli_query($dbc, $query2) or die("Ошибка при извлечении данных из таблицы");
        $get_data = "www.frn-pdd.ru/mail_back_renewal.php?factor1=" . $kod . "&factor2=" . $login; //Для хостинга frn-pdd.ru
        $msg = "Здравствуйте, $login, <a href='$get_data'>пройдите по этой ссылке, чтобы завершить процедуру восстановления доступа</a>";
        //$msg .= " " . md5("111");
        //$msg = "Регистрация пользователя " . $log;
        $subject = "Восстановление доступа к аккаунту frn-pdd.ru";
        $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
        $headers .= "From: webmaster@frn-pdd.ru\r\n"; //Наименование и почта отправителя
        mail($email, $subject, $msg, $headers);
        echo "222"; // Такой email в базе есть!!!
    } else {
        echo "111"; // Email в базе отсутствует!!!
    }


    mysqli_close($dbc);
?>
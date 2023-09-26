<?php
    //set_include_path('c:/openserver/domains/localhost/roadcontrol/vendor/google/apiclient/src/Google/');
    require_once ('connectvars.php');
    //require_once ('c:/openserver/domains/localhost/roadcontrol/server/connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Чтобы нормально отображались данные в базе и перенесённые из базы на страницу

    $query = "INSERT INTO daily_uploads SET today = NOW(), upload_count = '111'";
    mysqli_query($dbc, $query);
    mysqli_close($dbc);
?>
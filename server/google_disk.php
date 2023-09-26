<?php
    //Файл для localhost отличается от файла на хостинге (разный формат даты в БД)
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $name_reporter = $_POST['name-reporter'];
    $google = $_POST['form-google-disk'];
    $date_answer = $_POST['date-answer'];

    //$query = "UPDATE declaration SET google_disk = '$google', date_answer = '$date_answer' WHERE dec_id_gibdd = '$name_reporter'";
    $query = "UPDATE declaration SET google_disk = '$google', date_answer = '$date_answer' WHERE id_gibdd = '$name_reporter'";
    mysqli_query($dbc, $query) or die("Ошибка при обновлении пути к файлу в облаке");

    mysqli_close($dbc);
?>
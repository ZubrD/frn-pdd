<?php
    require_once ('connectvars.php');
    session_start();
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Чтобы нормально отображались данные в базе и перенесённые из базы на страницу

    $video = $_POST['video'];
    $region = $_POST['region'];
    $town = $_POST['town'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $arraykeys = array_keys($_POST);
    $arrayvalues = array_values($_POST);
    echo count($_POST);
    $j = (count($_POST) - 7)/2 + 1;     //Количество пар значений "нарушение - номер машины" и, следовательно, циклов вставки. 7 - количество одинаковых полей
    $arraykeys = array_keys($_POST);
    $arrayvalues = array_values($_POST);
    for($i = 1; $i < $j; $i ++){
        $query = "INSERT INTO multycase SET video = '$video', region = '$region', town = '$town', latitude = '$latitude', longitude = '$longitude',
                  datee = '$date', timee = '$time', violation = '" . $_POST['violation' . $i . ''] . "', numer = '" . $_POST['numer' . $i . ''] . "'";
        mysqli_query($dbc, $query) or die("Ошибка записи данных из мультиформы");
    }
    mysqli_close($dbc);
?>
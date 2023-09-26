<?php
    header('Content-type: text/html; charset=windows-1251');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    $id = $_POST['id'];
    $region = $_POST['region'];
    $lat = $_POST['lat'];
    $long = $_POST['long'];

    $query = "INSERT INTO regions SET id='$id', region='$region'";
    $result = mysqli_query($dbc, $query) or die(fail("Ошибка запроса"));
?>
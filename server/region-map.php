<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    $id_reg = $_GET['data'];
    $query = "SELECT * FROM regions WHERE id_reg = '$id_reg'";
    $result = mysqli_query($dbc, $query) or die("Плохой запрос");
    $latlong = array();
    while ($row = mysqli_fetch_array($result)){
        array_push($latlong, array('lat' => $row['lat'], 'long' => $row['long']));
    }
    echo json_encode(array('otvet' => $latlong));
?>
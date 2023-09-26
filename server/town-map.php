<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    $id_town = $_GET['data'];
    $id_reg = $_GET['reg'];
    $query = "SELECT * FROM towns WHERE id_reg = '$id_reg' AND id_town = '$id_town'";
    $result = mysqli_query($dbc, $query) or die("Плохой запрос");
    $latlong = array();
    while ($row = mysqli_fetch_array($result)){
        $lat_and_long = explode(",", substr($row['latlong'], 1, -1)); // Удаляю первый и последний символы, разбиваю строку на две части по символу запятая
        $lat = $lat_and_long[0];
        $long = $lat_and_long[1];
        array_push($latlong, array('lat' => $lat, 'long' => $long));
    }
    echo json_encode(array('otvet' => $latlong));
?>
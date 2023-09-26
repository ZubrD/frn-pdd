<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $query = "SELECT * FROM towns";
    $result = mysqli_query($dbc, $query) or die("Ошибка при получении списка городов для определения расстояния до них");
    $array_towns = array();
    while ($row = mysqli_fetch_array($result)){
        $lat_and_long = explode(",", substr($row['latlong'], 1, -1)); // Удаляю первый и последний символы, разбиваю строку на две части по символу запятая
        $lat = $lat_and_long[0];
        $long = $lat_and_long[1];
        array_push($array_towns, array('id_reg' => $row['id_reg'], 'id_town' => $row['id_town'], 'town' => $row['town'], 'latlong' => $row['latlong'], 'lat' => $lat, 'long' => $long));
    }
    echo json_encode(array('otvet' => $array_towns));
    mysqli_close($dbc);
?>
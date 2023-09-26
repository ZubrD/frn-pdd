<?php
    //  Координаты города, карта которого выводится на экран по расчёту расстояния от посетителя
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    $id_reg = $_GET['main-id_reg'];
    $id_town = $_GET['main-id_town'];
    $query = "SELECT * FROM towns WHERE id_reg = '$id_reg' AND id_town = '$id_town'";
    $result = mysqli_query($dbc, $query) or die("Ошибка запроса на получение данных по нарушениям для города");
    $town_coords = array();
    while ($row = mysqli_fetch_array($result)){
        $lat_and_long = explode(",", substr($row['latlong'], 1, -1)); // Удаляю первый и последний символы, разбиваю строку на две части по символу запятая
        $lat = $lat_and_long[0];
        $long = $lat_and_long[1];
        array_push($town_coords, array('id_reg' => $row['id_reg'], 'id_town' => $row['id_town'], 'my-town-latitude' => $lat, 'my-town-longitude' => $long));
    }
    echo json_encode(array('otvet' => $town_coords));
    mysqli_close($dbc);
?>
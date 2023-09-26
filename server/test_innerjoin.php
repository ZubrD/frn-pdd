<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $query = "SELECT * FROM road_case INNER JOIN regions USING (id_reg) INNER JOIN violations USING (id_violation) 
              INNER JOIN towns USING (id_town) WHERE (road_case.id_reg = towns.id_reg)"; //Связываю с таблицей road_case таблицы regions и towns, ограничивая выбор в таблице towns значением из поля id_reg
    $result = mysqli_query($dbc, $query) or die("Ошибка при добавлении данных в таблицу");

    $region_town = array();
    while ($row = mysqli_fetch_array($result)){
        //echo $row['region'];
        array_push($region_town, array('id_reg' => $row['id_reg'], 'reg_name' => $row['region'],
            'town_name' => $row['town'], 'violation' => $row['violation'],
            'violation_style' => $row['violation_style'], 'violation_color' => $row['violation_color'], 
            'latitude' => $row['latitude'], 'longitude' => $row['longitude'], 'car_numer' => $row['car_numer'],
            'images' => $row['images']));
    }
    echo json_encode(array('otvet' => $region_town));
?>
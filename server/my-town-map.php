<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");
    $id_reg = $_GET['main-id_reg'];
    $id_town = $_GET['main-id_town'];

    if ($_GET['main-id_reg']){
        $region = " AND road_case.id_reg = '" . $_GET['main-id_reg'] . "'";
    }

    if ($_GET['main-id_town']){
        $town = " AND road_case.id_town = '" . $_GET['main-id_town'] . "'";
    }

    $query = "SELECT * FROM road_case INNER JOIN regions USING (id_reg) INNER JOIN violations USING (id_violation)
              INNER JOIN towns USING (id_town) WHERE road_case.server_video = '' AND road_case.id_reg = towns.id_reg" . $region . $town;

    $result = mysqli_query($dbc, $query) or die("Ошибка запроса на получение данных по нарушениям для города");
    $town_data = array();
    while ($row = mysqli_fetch_array($result)){
        array_push($town_data, array('newid' => $row['newid'], 'id_reg' => $row['id_reg'], 'reg_name' => $row['region'],
            'id_town' => $row['id_town'], 'town_name' => $row['town'], 'id_violation' => $row['id_violation'], 'violation' => $row['violation'],
            'violation_style' => $row['violation_style'], 'violation_color' => $row['violation_color'], 'violation_pic' => $row['violation_pic'],
            'violation_picsize1' => $row['violation_picsize1'], 'violation_picsize2' => $row['violation_picsize2'],
            'latitude' => $row['latitude'], 'longitude' => $row['longitude'], 'car_numer' => $row['car_numer'],
            'images' => $row['images'], 'videos' => $row['videos'], 'denj' => $row['denj'], 'dataa' => $row['dataa'], 'proved' => $row['proved'],
            'author' => $row['author'], 'comments' => $row['comments'], 'grades_yes' => $row['grades_yes'], 'grades_no' => $row['grades_no']));
    }
    echo json_encode(array('otvet' => $town_data));
    mysqli_close($dbc);
?>
<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

/*    if($_GET['violation-search']){
        $violation = " AND road_case.id_violation = '" . $_GET['violation-search'] . "'";
    }
    if($_GET['region-search']){
        $region = " AND road_case.id_reg = '" . $_GET['region-search'] . "'";
    }

    if($_GET['town-search']){
        $town = " AND road_case.id_town = '" . $_GET['town-search'] . "'";
    }

    if($_GET['dbcar-numer-search']){
        $car_numer = " AND road_case.car_numer = '" . $_GET['dbcar-numer-search'] . "'";
    }

    if($_GET['hidden-carnumer']){                                 //Для поиска только по номеру машины
        $car_numer = " AND road_case.car_numer = '" . $_GET['hidden-carnumer'] . "'";
    }*/

    $query = "SELECT * FROM road_case INNER JOIN regions USING (id_reg) INNER JOIN violations USING (id_violation) 
              INNER JOIN towns USING (id_town) WHERE road_case.server_video = '' AND road_case.id_reg = towns.id_reg AND road_case.id_violation = violations.id_violation"; //Связываю с таблицей road_case таблицы regions и towns, ограничивая выбор в таблице towns значением из поля id_reg
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы"); // proved = yes - значит видео проверено

    $region_town = array();
    while ($row = mysqli_fetch_array($result)){
        //echo $row['region'];
        array_push($region_town, array('newid' => $row['newid'], 'id_reg' => $row['id_reg'], 'reg_name' => $row['region'],
            'town_name' => $row['town'], 'violation' => $row['violation'], 'car_numer' => $row['car_numer'],
            'images' => $row['images'], 'videos' => $row['videos'], 'dataa' => $row['dataa']));
    }
    echo json_encode(array('otvet' => $region_town));
    mysqli_close($dbc);
?>
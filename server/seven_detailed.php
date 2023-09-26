<?php
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");
    $seven_days_ago = date("Y-m-d", (time()-3600*24*7));
    $query = "SELECT * FROM road_case INNER JOIN regions USING (id_reg) INNER JOIN towns USING (id_town) INNER JOIN violations USING (id_violation)
              WHERE road_case.id_reg = towns.id_reg AND id_gibdd NOT IN ('Неизвестный') AND dataa > '$seven_days_ago' ORDER BY dataa ASC";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $detailed = array();
    while($row = mysqli_fetch_array($result)){
        array_push($detailed, array('newid' => $row['newid'], 'id_reg' => $row['id_reg'], 'id_town' => $row['id_town'],
            'town' => $row['town'], 'dataa' => $row['dataa'], 'denj' => $row['denj'], 'car_numer' => $row['car_numer'],
            'violation' => $row['violation']));
    }
    //$otvet = mysqli_num_rows($result);
    //echo $otvet;
    echo json_encode(array('details' => $detailed));
    mysqli_close($dbc);
?>
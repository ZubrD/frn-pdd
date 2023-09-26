<?php
    //Загрузка данных на страницу подтверждения (moder.html)
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $query_for_rows = "SELECT * FROM road_case INNER JOIN regions USING (id_reg) INNER JOIN violations USING (id_violation) 
                  INNER JOIN towns USING (id_town) WHERE road_case.server_video = '' AND road_case.id_reg = towns.id_reg AND road_case.proved = 'no' 
                  AND road_case.ban NOT IN ('yes')"; // Если server_video = '', значит видео уже загружено на youtube; ban = 'yes', значит пользователь и все его видео заблокированы
    $result_for_rows = mysqli_query($dbc, $query_for_rows) or die("Ошибка при определении числа строк"); // proved = no - значит видео не проверено
    $num_rows = mysqli_num_rows($result_for_rows);  //Общее количество загрузок для подтверждения

    $query = "SELECT * FROM road_case INNER JOIN regions USING (id_reg) INNER JOIN violations USING (id_violation) 
              INNER JOIN towns USING (id_town) WHERE road_case.server_video = '' AND road_case.id_reg = towns.id_reg AND road_case.proved = 'no' 
              AND road_case.ban NOT IN ('yes') LIMIT 20"; // Если server_video = yes, значит видео ещё не загружено на youtube
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы"); // proved = no - значит видео не проверено

    $unproved_cases = array();
    while ($row = mysqli_fetch_array($result)){
        //echo $row['region'];
        array_push($unproved_cases, array('newid' => $row['newid'], 'id_reg' => $row['id_reg'], 'reg_name' => $row['region'],
            'town_name' => $row['town'], 'violation' => $row['violation'],
            'violation_style' => $row['violation_style'], 'violation_color' => $row['violation_color'], 
            'latitude' => $row['latitude'], 'longitude' => $row['longitude'], 'car_numer' => $row['car_numer'],
            'images' => $row['images'], 'videos' => $row['videos'], 'author' => $row['author'], 'proved' => $row['proved']));
    }
    echo json_encode(array('otvet' => $unproved_cases, 'vsego' => $num_rows));
    mysqli_close($dbc);
?>
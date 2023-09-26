<?php

    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");
    $query = "SELECT * FROM regions ORDER BY region ASC";       //Выбираю все регионы
    $result = mysqli_query($dbc, $query) or die("Ошибка при выводе названий регионов");
    $array_reg = array();
    while($row = mysqli_fetch_array($result)){
        array_push($array_reg, array('region' => $row['region'], 'id_reg' => $row['id_reg']));  //Формирую из названий регионов и их идентификаторов массив
    }
    $array_reg_stat = array();
    for($i = 0; $i < count($array_reg); $i ++){
        $id_reg = $array_reg[$i]['id_reg'];
        $region = $array_reg[$i]['region'];
        $query2 = "SELECT * FROM road_case WHERE id_reg ='$id_reg'";        //Выбираю записи только конкретного региона
        $result2 = mysqli_query($dbc, $query2) or die("Ошибка при извлечении данных из таблицы");
        $nums = mysqli_num_rows($result2);
        $query3 = "SELECT * FROM road_case WHERE id_reg ='$id_reg' AND id_gibdd !='Неизвестный'";  //Выбираю записи только конкретного региона и направленные в ГИБДД
        $result3 = mysqli_query($dbc, $query3) or die("Ошибка при извлечении данных из таблицы");
        $nums_dec = mysqli_num_rows($result3);
        array_push($array_reg_stat, array('region' => $region, 'id_reg' => $id_reg, 'cases' => $nums, 'cases_dec' => $nums_dec));   //Формирую массив для передачи на сайт
    }
    echo json_encode(array('otvet' => $array_reg_stat));
    mysqli_close($dbc);
?>
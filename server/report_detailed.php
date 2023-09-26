<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $array_reg_stat = array();
    if($_GET['sort_factor'] == "000"){
        $sort_factor_order = " ORDER BY town ASC";
    } else{
        $sort_factor_order = " ORDER BY ".$_GET['sort_factor']." ".$_GET['sort_order']."";
    }


    //$query2 = "SELECT * FROM examp ORDER BY town ASC";
    $query2 = "SELECT * FROM examp" . $sort_factor_order;     // Устанавливаю параметры сортировки
    $result2 = mysqli_query($dbc, $query2) or die("Ошибка при извлечении данных из таблицы road_case");

    while ($row = mysqli_fetch_array($result2)) {    // прохожу в цикле весь массив и отбираю...
        $town = $row['town'];
        $id_reg = $row['id_reg'];
        $id_town = $row['id_town'];
        $nums = $row['cases'];
        $nums_sended = $row['cases_sended'];
        $nums_yes = $row['cases_yes'];
        $nums_no = $row['cases_no'];
        $nums_ignor = $row['cases_ignor'];
        $nums_joke = $row['cases_joke'];
        $nums_excited = $row['cases_excited'];

        array_push($array_reg_stat, array('town' => $town, 'id_reg' => $id_reg, 'id_town' => $id_town, 'cases' => $nums,
            'cases_sended' => $nums_sended, 'cases_yes' => $nums_yes, 'cases_no' => $nums_no, 'cases_ignor' => $nums_ignor,
            'cases_joke' => $nums_joke, 'cases_excited' => $nums_excited));   //Формирую массив для передачи на сайт
    }
    echo json_encode(array('otvet' => $array_reg_stat));
    mysqli_close($dbc);
?>



<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $query = "SELECT * FROM regions ORDER BY region ASC";
    $result = mysqli_query($dbc, $query) or die("Плохой запрос");
    $list = "<option value = '00'>Выберите регион</option>";
    while ($row = mysqli_fetch_array($result)){
        $list .= "<option value=". $row['id_reg'] .">". $row['region'] ."</option>";
    }
    echo $list;
?>
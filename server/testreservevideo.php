<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $query_select_reserve = "SELECT * FROM road_case WHERE server_video = 'yes' LIMIT 3";// Резервирую за скриптом testupload 3 строки
    $result_select_reserve = mysqli_query($dbc, $query_select_reserve) or die("Ошибка при извлечении данных из таблицы");
    while ($row = mysqli_fetch_array($result_select_reserve)) {
        $id_reserve = $row['newid'];
        $query_reserve = "UPDATE road_case SET server_video = '', upload1 = 'yes', dataa = NOW() WHERE newid = '$id_reserve'";
        mysqli_query($dbc, $query_reserve);
    }
    mysqli_close($dbc);
?>
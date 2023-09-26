<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись
    $today = date("Y-m-d");
    $query_for_count = "SELECT * FROM daily_uploads WHERE today = '$today'";
    $result = mysqli_query($dbc, $query_for_count) or die ("Ошибка при извлечении данных из таблицы daily_uploads");
    $num_row = mysqli_num_rows($result);
    $row = mysqli_fetch_array($result);
    if ($num_row == 1){
        $count = $row['upload_count'] + 1;
        $query_for_update_count = "UPDATE daily_uploads SET upload_count = '$count' WHERE today = '$today'";
        mysqli_query($dbc, $query_for_update_count);
        echo "Теперь значение upload_count равен " . $count;
    } else if($num_row == 0) {
        $count = 1;
        $query_for_update_count = "INSERT INTO daily_uploads SET today = '$today', upload_count = '$count'";
        mysqli_query($dbc, $query_for_update_count);
        echo "Начался новый день. Теперь значение upload_count равен" . $count;
    }
    mysqli_close($dbc);
?>
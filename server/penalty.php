<?php
    //Подсчёт штрафов
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $query = "SELECT * FROM road_case INNER JOIN violations USING (id_violation)"; //Связываю с таблицей road_case таблицу violations
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");

    $sum = 0;
    while ($row = mysqli_fetch_array($result)){
        $sum = $sum + $row['penalty'];
    }
    echo $sum;
    mysqli_close($dbc);
?>
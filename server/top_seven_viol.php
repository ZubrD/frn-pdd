<?php
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");
    //$query = "SELECT * FROM road_case WHERE id_gibdd !=''";
    $seven_days_ago = date("Y-m-d", (time()-3600*24*7));
    $query = "SELECT * FROM road_case WHERE id_gibdd NOT IN ('Неизвестный') AND dataa > '$seven_days_ago'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $otvet = mysqli_num_rows($result);
    echo $otvet;
    mysqli_close($dbc);
?>
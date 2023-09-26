<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $many_days_ago = date("Y-m-d", (time()-3600*24*67));     //67 дней назад

    $query = "UPDATE road_case SET dec_status = 'ignor' WHERE dec_status = 'sended' AND denj < '$many_days_ago'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при смене статуса на old_sended");
    //$otvet = mysqli_num_rows($result);
    //echo $otvet;
    mysqli_close($dbc);
?>
<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $newid = $_GET['newid'];
    $status = $_GET['status'];
    $google = $_GET['google'];
    $reporter = $_GET['reporter'];
    $reason = $_GET['reason'];
    $query1 = "UPDATE road_case SET dec_status = '$status', innocent_reason = '$reason' WHERE newid = '$newid'";
    mysqli_query($dbc, $query1) or die("Плохой запрос к таблице road_case");

/*    $query3 = "UPDATE declaration SET google_disk = '$google' WHERE id_gibdd = '$reporter'";
    mysqli_query($dbc, $query3) or die("Плохой запрос к таблице declaration");*/

    $query2 = "SELECT * FROM road_case WHERE newid = '$newid'";
    $result = mysqli_query($dbc, $query2) or die ("Ошибка при изменении статуса заявки");
    while ($row = mysqli_fetch_array($result)){
        $new_status = $row['dec_status'];
    }
    echo $new_status;
?>
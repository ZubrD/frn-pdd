<?php
    //header('Content-type: text/html; charset=windows-1251');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $dec_text_gibdd = $_POST['dec-text-gibdd'];
    $dec_name_gibdd = $_POST['dec-name-gibdd'];
    $dec_videos_gibdd = $_POST['dec-videos-gibdd'];



    $query1 = "UPDATE road_case SET id_gibdd = '$dec_name_gibdd', dec_status = 'sended' WHERE videos = '$dec_videos_gibdd'";
    mysqli_query($dbc, $query1) or die("Ошибка при обновлении данных в таблице road_case");

    $query2 = "UPDATE declaration SET dec_date = NOW(), id_gibdd = '$dec_name_gibdd', dec_text = '$dec_text_gibdd' WHERE videos = '$dec_videos_gibdd'";
    mysqli_query($dbc, $query2) or die("Ошибка при обновлении данных в таблице declaration");

    mysqli_close($dbc)
?>
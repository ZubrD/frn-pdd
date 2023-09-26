<?php
    //header('Content-type: text/html; charset=windows-1251');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $id_gibdd = $_POST['dec-id-gibdd'];
    $dec_text = $_POST['dec-text'];
    $dec_video = $_POST['dec-video'];
    $dec_source_video = $_POST['dec-source-video'];
    $sended_to_gibdd = $_POST['sended-to-gibdd'];

    if($sended_to_gibdd == "no"){   // Если просто был сформирован текст письма, но не отправлено в ГИБДД, то поле даты отправки письма dec_date не заполняю
        $query = "INSERT INTO declaration SET id_gibdd = '$id_gibdd', dec_text = '$dec_text', videos = '$dec_video', source_video = '$dec_source_video'";
        mysqli_query($dbc, $query) or die("Ошибка вставки в declaration при sended_to_gibdd no");
    } else{
        $query = "INSERT INTO declaration SET id_gibdd = '$id_gibdd', dec_text = '$dec_text', dec_date = NOW(), videos = '$dec_video', source_video = '$dec_source_video'";
        mysqli_query($dbc, $query) or die("Ошибка вставки в declaration при sended_to_gibdd другое значение");
    }
    mysqli_close($dbc)
?>
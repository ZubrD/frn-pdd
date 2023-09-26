<?php
    //header('Content-type: text/html; charset=windows-1251');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $dec_videos = $_POST['dec-videos'];
    $query = "SELECT * FROM declaration WHERE videos = '$dec_videos'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы declaration"); //
    $declaration_datas = array();
    while ($row = mysqli_fetch_array($result)){
        array_push($declaration_datas, array('dec_text' => $row['dec_text']));
    }
    echo json_encode(array('otvet' => $declaration_datas));

    mysqli_close($dbc)
?>
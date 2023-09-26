<?php
    //header('Content-type: text/html; charset=windows-1251');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $dec_video = $_POST['video-complex-message'];

    $query = "SELECT * FROM declaration WHERE videos = '$dec_video'";
    $result = mysqli_query($dbc, $query) or die("Ошибка извлечения писем из базы данных");
    $message = "";
    while ($row = mysqli_fetch_array($result)){
        $message = $message . "\n" . $row['dec_text'];
    }
    echo $message;
    mysqli_close($dbc)
?>
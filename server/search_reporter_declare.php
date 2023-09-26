<?php
    //Файл для localhost отличается от файла на хостинге (разный формат даты в БД)
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $name_reporter = $_POST['name-reporter'];

    //$query = "SELECT * FROM declaration WHERE dec_id_gibdd = '$name_reporter'";
    //$query = "SELECT * FROM declaration WHERE dec_id_gibdd LIKE '%$name_reporter%'";
    $query = "SELECT * FROM declaration WHERE id_gibdd LIKE '%$name_reporter%'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при поиске репортёра");

    $reporter = array();
    while ($row = mysqli_fetch_array($result)){
        //array_push($reporter, array('reporter' => $row['dec_id_gibdd'], 'dec_text' => $row['dec_text'], 'videos' => $row['videos'], 'google_disk' => $row['google_disk']));
        array_push($reporter, array('reporter' => $row['id_gibdd'], 'dec_text' => $row['dec_text'], 'videos' => $row['videos'], 'google_disk' => $row['google_disk']));
    }
    echo json_encode(array('otvet' => $reporter));
    mysqli_close($dbc);
?>
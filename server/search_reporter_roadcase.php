<?php
    //Файл для localhost отличается от файла на хостинге (разный формат даты в БД)
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    if($_POST['name-reporter']){
        $name_reporter = $_POST['name-reporter'];
    }

    $query = "SELECT * FROM road_case WHERE id_gibdd LIKE '%$name_reporter%'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при поиске репортёра");

    $reporter = array();
    while ($row = mysqli_fetch_array($result)){
        array_push($reporter, array('newid' => $row['newid'], 'car_numer' => $row['car_numer'],
            'videos' => $row['videos'], 'dataa' => $row['dataa'], 'denj' => $row['denj'],
            'times' => $row['times'], 'author' => $row['author'], 'id_gibdd' => $row['id_gibdd'], 'dec_status' => $row['dec_status']));
    }
    echo json_encode(array('otvet' => $reporter));
    mysqli_close($dbc);
?>
<?php
    header('Content-type: text/html; charset=utf8');    //Чтобы нормально отображалась веб-страница
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Чтобы нормально отображались данные в базе и перенесённые из базы на страницу

    $dir = "../videos/"; // Первые две точки означают, что файл php хранится не в корневой папке (нужно подняться на уровень выше)

    $query = "SELECT * FROM road_case WHERE server_video = 'yes'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    while ($row = mysqli_fetch_array($result)){
        $path = $row['images'];
        @unlink($dir . $path);  // Удаляю файл с сервера
        echo "Удалён файл " . $path;
        $id = $row['newid'];
        $query_for_update = "UPDATE road_case SET server_video = '' WHERE newid = '$id'";
        mysqli_query($dbc, $query_for_update) or die("Ошибка при изменении данных");
    }
    mysqli_close($dbc);
?>
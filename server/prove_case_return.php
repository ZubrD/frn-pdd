<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $newid = $_POST['kandidat'];

    $query = "UPDATE road_case SET proved = 'no' WHERE newid = '$newid'"; // Если server_video = yes, значит видео ещё не загружено на youtube
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы"); // proved = no - значит видео не проверено

    mysqli_close($dbc);
?>
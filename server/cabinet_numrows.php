<?php
    //Определяю наличие записей конкретного автора (для процедуры входа в кабинет)
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $author = $_POST['datalogin'];

    $query = "SELECT * FROM road_case WHERE author = '$author' "; // Определяю наличие авторских записей
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");

    echo mysqli_num_rows($result);
    mysqli_close($dbc);
?>
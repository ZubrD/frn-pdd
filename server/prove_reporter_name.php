<?php
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $name_reporter = $_GET['name_reporter'];
    $query = "SELECT * FROM declaration WHERE id_gibdd = '$name_reporter'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $num_rows = mysqli_num_rows($result);
    if($num_rows > 0){
        echo "111";     //Такое репортёр уже есть, продолжение процедуры запрещено
    } else {
        echo "000";     //Репортёр публикуется впервые, работать можно
    }
    echo $otvet;
    mysqli_close($dbc);
?>
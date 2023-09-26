<?php
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $id_gibdd = $_GET['id_gibdd'];
    $query = "SELECT * FROM declaration WHERE id_gibdd = '$id_gibdd'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $num_rows = mysqli_num_rows($result);
    if($num_rows > 1){
        //echo "Дублирование имён репортёров";
        echo $num_rows;
    } elseif ($num_rows == 1){
        while($row = mysqli_fetch_array($result)){
           $otvet = $row['google_disk'];
        }
    } elseif ($num_rows == 0){
        echo "Репортёра с таким именем нет";
    }
    echo $otvet;
    mysqli_close($dbc);
?>
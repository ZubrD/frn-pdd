<?php
    header('Content-type: text/html; charset=utf8');

    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $query = "SELECT * FROM road_case";
    $result = mysqli_query($dbc, $query) or die("Не получилось извлечь данные из таблицы road_case");

    while ($row = mysqli_fetch_array($result)) {
        $car_numer = $row['car_numer'];
        $query_for_num_car = "SELECT * FROM car_nums WHERE car_numer = '$car_numer'";
        $result_for_num_car = mysqli_query($dbc, $query_for_num_car) or die ("Ошибка запроса в car_nums по номеру машины из road_case");
        $num_rows = mysqli_num_rows($result_for_num_car);
        if ($num_rows == 0) {
            $query_for_insert = "INSERT INTO car_nums SET car_numer = '$car_numer', case_nums = '1'";
            mysqli_query($dbc, $query_for_insert) or die("Ошибка вставки");
        } else {
            $num_rows = $num_rows + 1;
            $query_for_update = "UPDATE car_nums SET case_nums = '$num_rows', case_nums = '$num_rows' WHERE car_numer = '$car_numer'";
            mysqli_query($dbc, $query_for_update) or die("Ошибка обновления");
        }
    }
    mysqli_close($dbc);
?>
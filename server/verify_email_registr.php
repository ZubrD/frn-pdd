<?php
    require_once ('connectvars.php');

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $email = $_GET['registr-email'];

    $query = "SELECT * FROM volontiers WHERE email = '$email'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $otvet = mysqli_num_rows($result);
    if($otvet > 0){
        echo "111"; // Такой email уже используетсяя!!!
    } else {
        echo "222"; // Email в базе отсутствует!!!
    }
    mysqli_close($dbc);
?>
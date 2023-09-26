<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');

    session_start();
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись
    $login = $_SESSION['login'];
    $password = $_POST['renewal-parol'];
    $kod = md5(rand(0, 1000000000));

    $query = "UPDATE volontiers SET password = md5($password), kod = '$kod' WHERE login = '$login'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при изменении пароля");
    mysqli_close($dbc);
    echo $login;
?>
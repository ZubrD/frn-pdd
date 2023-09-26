<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');

    session_start();
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $login = $_POST['dostup_login'];
    $password = $_POST['dostup_pass'];

    $query = "SELECT * FROM volontiers WHERE login = 'den'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $otvet = mysqli_num_rows($result);
    if($otvet == 1){
        while ($row = mysqli_fetch_array($result)) {
            if($row['prosto'] == $password){
                echo "111"; // Правильный ответ!!!
                $_SESSION['dostup'] = $row['login'];
            } else {
                echo "000"; // Неправильный ответ!!!
            }
        }
    } else if($otvet == 0) {
        echo "222"; // Нет такого пользователя!!!
    }
    mysqli_close($dbc);
?>
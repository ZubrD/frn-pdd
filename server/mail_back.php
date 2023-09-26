<?php
    header('Content-type: text/html; charset=utf8');
    $message = urldecode($_GET['factor1']);
    echo "Было получено сообщение: " . $message . "<br /><br />";

    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");
    $kod = $_GET['factor1'];
    $query = "SELECT * FROM volontiers WHERE kod = '$kod'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $num_result = mysqli_num_rows($result);
    if($num_result == 1){
        while ($row = mysqli_fetch_array($result)){
            $new_kod = $row['kod'];
            $new_login = $row['login'];
            $new_verified = $row['verified'];
            if($new_verified == 'no'){
                $kod_query = "UPDATE volontiers SET verified = 'yes', limit_inserts = 50 WHERE kod = '$new_kod'";
                mysqli_query($dbc, $kod_query);
                echo "Вы зарегестрировались под именем " . $new_login;
            } else {
                echo "Вы уже зарегистрировались!!!";    // На тот случай, если по ссылке пройдут второй раз
            }
        }
    } else{
        echo "Ошибка при регистрации";
    }
    mysqli_close($dbc);
?>
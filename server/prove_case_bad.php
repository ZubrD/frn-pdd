<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $newid = $_POST['kandidat'];
    $author = $_POST['author'];

    $query = "UPDATE road_case SET proved = 'bad' WHERE newid = '$newid'"; // Если server_video = yes, значит видео ещё не загружено на youtube
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы"); // proved = no - значит видео не проверено

    $query_volontiers = "SELECT * FROM  volontiers WHERE login = '$author'";
    $result_volontiers = mysqli_query($dbc, $query_volontiers) or die("Ошибка при получении данных пользователя из таблицы авторов");
    $row = mysqli_fetch_array($result_volontiers);
    $bad = $row['bad'];
    if ($bad < 3){
        $bad = $row['bad'] + 1;
        $ban = "";
    } else {
        $ban = "yes";
        $query_ban = "UPDATE road_case SET ban = 'yes' WHERE author = '$author'";
        $result_ban = mysqli_query($dbc, $query_ban) or die("Ошибка обновления таблицы событий данными по бану");
    }


    $query_update_volontiers = "UPDATE volontiers SET good = '0', bad = '$bad', ban = '$ban' WHERE login = '$author'";
    $result_update_volontiers = mysqli_query($dbc, $query_update_volontiers) or die("Ошибка при обновлении в таблице пользователей поля правильных загрузок");
    mysqli_close($dbc);
?>
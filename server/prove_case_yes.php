<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $newid = $_POST['kandidat'];
    $author = $_POST['author'];

    $query = "UPDATE road_case SET proved = 'yes' WHERE newid = '$newid'"; // Если server_video = yes, значит видео ещё не загружено на youtube
    $result = mysqli_query($dbc, $query) or die("Ошибка при обновлении таблицы событий (подтверждение)"); // proved = no - значит видео не проверено

    $query_volontiers = "SELECT * FROM  volontiers WHERE login = '$author'";
    $result_volontiers = mysqli_query($dbc, $query_volontiers) or die("Ошибка при получении данных пользователя из таблицы авторов");
    $row = mysqli_fetch_array($result_volontiers);
    $good = $row['good'] + 1;

    $query_update_volontiers = "UPDATE volontiers SET good = '$good', bad = '0' WHERE login = '$author'";
    $result_update_volontiers = mysqli_query($dbc, $query_update_volontiers) or die("Ошибка при обновлении в таблице пользователей поля правильных загрузок");
    mysqli_close($dbc);
?>
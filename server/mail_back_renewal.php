<?php
    header('Content-type: text/html; charset=utf8');
    $message = urldecode($_GET['factor1']);
    session_start();
    require_once ('server/connectvars.php');    /////////////////////////ВНИМАНИЕ НА ПУТЬ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");
    $kod = $_GET['factor1'];
    $login = $_GET['factor2'];
    $query = "SELECT * FROM volontiers WHERE kod = '$kod'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $num_result = mysqli_num_rows($result);
    if($num_result == 1){
        $_SESSION['login'] = $login;
/*        while ($row = mysqli_fetch_array($result)){
            $new_kod = $row['kod'];
            $new_login = $row['login'];
            $new_verified = $row['verified'];
            if($new_verified == 'no'){
                $kod_query = "UPDATE volontiers SET verified = 'yes' WHERE kod = '$new_kod'";
                mysqli_query($dbc, $kod_query);
                echo "Вы зарегестрировались под именем " . $new_login;
            } else {
                echo "Вы уже зарегистрировались!!!";    // На тот случай, если по ссылке пройдут второй раз
            }
        }*/
    ?>
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <link href="style/my-style.css" rel="stylesheet">
            <link href="style/jquery-ui.css" rel="stylesheet">
            <link href="style/jquery.ui.timepicker.css" rel="stylesheet">
            <link href="style/tinytools.progressbar.css" rel="stylesheet">
            <link href="style/tinytools.progressbar.min.css" rel="stylesheet">
            <link href="style/present.css" rel="stylesheet">
            <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Open+Sans' type='text/css'>
        </head>
        <body>
            <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
            <script src="scripts/jquery-1.10.2.min.js"></script>
            <script src="scripts/tinytools.progressbar.js"></script>
            <script src="scripts/tinytools.progressbar.min.js"></script>
            <script src="scripts/my-script.js"></script>
            <script src="scripts/geoloc-1.js"></script>       <!--Определение местоположения пользователя-->
            <script src="scripts/registr.js"></script>
            <script src="scripts/insert.js"></script>
            <script src="scripts/search.js"></script>
            <!--<script src="scripts/present.js"></script>-->
            <!--<script src="scripts/help.js"></script>-->
            <script src="scripts/comments.js"></script>
            <script src="scripts/assessment.js"></script>   <!--Оценка видео-->
            <script src="scripts/search-car.js"></script>
            <script src="scripts/login.js"></script>
            <script src="scripts/cabinet.js"></script>
            <script src="scripts/jquery-ui.js"></script>
            <script src="scripts/jquery.ui.timepicker.js"></script>
            <script>
                alert(<?php echo "Привет из PHP" ?>);
            </script>
        </body>

<?php
    } else{
        echo "Истёк срок действия письма.";
    }
    mysqli_close($dbc);
?>
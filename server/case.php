<?php
    //header('Content-type: text/html; charset=windows-1251');
    require_once ('connectvars.php');
    session_start();
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $video = $_POST['video'];
    $source_video = $_POST['source-video'];
    $id_reg = $_POST['region'];
    $id_town = $_POST['town'];
    $lat = $_POST['dblat'];
    $long = $_POST['dblong'];
    $date = $_POST['date'];
    $times = $_POST['times'];
    $id_gibdd = $_POST['id_gibdd'];
    $arraykeys = array_keys($_POST);
    $arrayvalues = array_values($_POST);
    echo count($_POST);
    $j = (count($_POST) - 9)/2 + 1;     //Количество пар значений "нарушение - номер машины" и, следовательно, циклов вставки. 9 - количество одинаковых полей
    $author = $_SESSION['login'];

    for($i = 1; $i < $j; $i ++){
        $query = "INSERT INTO road_case SET id_reg = '$id_reg', id_town = '$id_town', latitude = '$lat', longitude = '$long',
        denj = '$date', dataa = NOW(), times = '$times', videos = '$video', id_violation = '" . $_POST['violation' . $i . ''] . "',
        car_numer = '" . $_POST['dbcar_numer' . $i . ''] . "', author = '$author', proved = 'no', id_gibdd = '$id_gibdd', dec_status = 'wait', source_video = '$source_video'";
        mysqli_query($dbc, $query) or die("Ошибка записи данных из мультиформы");
    }

/*    $query = "INSERT INTO road_case SET id_reg = '$id_reg', id_town = '$id_town', latitude = '$lat',
                      longitude = '$long', denj = '$date', times = '$times',
                      images = '$filename', id_violation = '$violation', car_numer = '$car_numer', 
                      videos = '$video_id_map', dataa = NOW(), author = '$author', proved = 'no', server_video = '$server_video'";*/
    //mysqli_query($dbc, $query) or die("Ошибка при добавлении данных в таблицу");

    // Ответ сервера: путь до загруженного файла
    $array = array(
        "filelink" => "videos/".$filename
    );
    echo stripslashes(json_encode($array));

    $query_for_mail = "SELECT * FROM volontiers WHERE login = '$author'";
    $result_for_mail = mysqli_query($dbc, $query_for_mail) or die("Ошибка при получении эл. почты");
    while ($row = mysqli_fetch_array($result_for_mail)){
        $email = $row['email'];
    }

    $msg = "Вы загрузили видео, просмотреть его можно в личном кабинете. Это письмо сгенерировано автоматически, отвечать на него не надо.";   // Отправка уведомления на почту
    $subject = "Uploaded video";
    $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: webmaster@frn-pdd.ru\r\n"; //Наименование и почта отправителя
    mail($email, $subject, $msg, $headers);

    $today = date("Y-m-d");
    $query_author_date = "SELECT * FROM author_inserts WHERE today = '$today' AND author = '$author'";  // Подсчёт количества загрузок этим пользователем
    $result_for_author_date = mysqli_query($dbc, $query_author_date) or die("Ошибка извлечения данных из таблицы дневных загрузок авторов");
    $num_row = mysqli_num_rows($result_for_author_date);  //Проверяю, есть ли строка с сегодняшней датой
    $row_for_count = mysqli_fetch_array($result_for_author_date);
    if($num_row == 1){
        $count = $row_for_count['inserts'] + 1;
        $query_for_update_inserts = "UPDATE author_inserts SET inserts = '$count' WHERE today = '$today' AND author = '$author'";
        mysqli_query($dbc, $query_for_update_inserts);
    } elseif ($num_row == 0){
        $count = 1;
        $query_for_update_inserts = "INSERT INTO author_inserts SET today = '$today', inserts = '$count', author = '$author'";
        mysqli_query($dbc, $query_for_update_inserts);
    }

    $query_for_num_car = "SELECT * FROM car_nums WHERE car_numer_sv = '$car_numer'";            //Суммирую нарушения по номерам машин в таблице car_nums
    $result_for_num_car = mysqli_query($dbc, $query_for_num_car) or die ("Ошибка запроса в car_nums по номеру машины из road_case");
    $num_rows = mysqli_num_rows($result_for_num_car);
    if ($num_rows == 0) {
        $query_for_insert = "INSERT INTO car_nums SET car_numer_sv = '$car_numer', case_nums_sv = '1'";
        mysqli_query($dbc, $query_for_insert) or die("Ошибка вставки");
    } else {
        $row_for_case = mysqli_fetch_array($result_for_num_car);
        $sum_case = $row_for_case['case_nums_sv'] + 1;
        $query_for_update = "UPDATE car_nums SET case_nums_sv = '$sum_case' WHERE car_numer_sv = '$car_numer'";
        mysqli_query($dbc, $query_for_update) or die("Ошибка обновления");
    }

/*    if ($_POST['video_id_map']){    //Загружен файл или прямая ссылка?
        $server_video = "";         //Загружена прямая ссылка
    } else {
        $server_video = "yes";      //Загружен файл

        $dir = "../videos/"; // Первые две точки означают, что файл php хранится не в корневой папке (нужно подняться на уровень выше)
        $_FILES["file"]["type"] = strtolower($_FILES["file"]["type"]);

        // Новое имя файла
        $filename = md5(date("YmdHis")).basename($_FILES['file']['name']);
        $file = $dir.$filename;     //Конечный путь к файлу

        // Копирование файла
        move_uploaded_file($_FILES["file"]["tmp_name"], $file); //Перемещение файла в целевую папку
    }*/

    /*if ($_FILES["file"]["type"] == "video/mp4" || $_FILES["file"]["type"] == "video/avi")    {

        // Новое имя изображения
        $filename = md5(date("YmdHis")).basename($_FILES['file']['name']);
        $file = $dir.$filename;

        // Копирование файла
        move_uploaded_file($_FILES["file"]["tmp_name"], $file);

        $query = "INSERT INTO road_case SET id_reg = '$id_reg', id_town = '$id_town', latitude = '$lat', 
                  longitude = '$long', denj = '$date', hours = '$hours', minutes = '$minutes', 
                  images = '$filename', id_violation = '$violation', car_numer = '$car_numer', 
                  videos = '$video_id_map', dataa = NOW(), author = '$author', proved = 'no', server_video = '$server_video'";
        mysqli_query($dbc, $query) or die("Ошибка при добавлении данных в таблицу");

        // Ответ сервера: путь до загруженного файла
        $array = array(
            "filelink" => "videos/".$filename
        );
        echo stripslashes(json_encode($array));
    } else {
        $array = array(
            "error_response" => "Неправильный тип файла, должен быть .mp4, .avi"
        );
        echo stripslashes(json_encode($array));
    }*/
    mysqli_close($dbc)
?>
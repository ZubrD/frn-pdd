<?php
    //header('Content-type: text/html; charset=windows-1251');
    require_once ('connectvars.php');
    session_start();
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $car_numer = $_POST['dbcar_numer'];
    $id_reg = $_POST['region'];
    $id_town = $_POST['town'];
    $lat = $_POST['dblat'];
    $long = $_POST['dblong'];
    $date = $_POST['date'];
    $times = $_POST['times'];
    $violation = $_POST['violation'];
    $video_id_map = $_POST['video_id_map'];
    $author = $_SESSION['login'];

    if ($_POST['video_id_map']){    //Загружен файл или прямая ссылка?
        $server_video = "";         //Загружена прямая ссылка
    } else {
        $server_video = "yes";      //Загружен файл

        $file_tmp_size = filesize($_FILES["file"]["tmp_name"]);
        if($file_tmp_size > 15000000){
            //echo "111";
            echo json_encode(array('otvet' => "111", 'file_size' => "15Mb"));
        } else {
            $dir = "../videos/"; // Первые две точки означают, что файл php хранится не в корневой папке (нужно подняться на уровень выше)
            $_FILES["file"]["type"] = strtolower($_FILES["file"]["type"]);

            // Новое имя файла
            $filename = md5(date("YmdHis")).basename($_FILES['file']['name']);
            //$filename = basename($_FILES['file']['name']);
            $file = $dir.$filename;     //Конечный путь к файлу

            // Копирование файла
            move_uploaded_file($_FILES["file"]["tmp_name"], $file); //Перемещение файла в целевую папку
            $file_size = filesize($file);
            $chunks = $file_size/(1024 * 256);  //Количество порций отправок видео

            $query = "INSERT INTO progbar SET clip_name = '$filename', clip_size = '$file_size', chunk_assess = '$chunks'";
            mysqli_query($dbc, $query) or die ("Ошибка");
            echo json_encode(array('otvet' => $filename));
        }
    }



    mysqli_close($dbc);
?>
<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");

    //Путь до папки с изображениями, где хранятся загруженные изображения
    $dir = "../images/"; // Первые две точки означают, что файл php хранится не в корневой папке (нужно подняться на уровень выше)
    $_FILES["file"]["type"] = strtolower($_FILES["file"]["type"]);

    if ($_FILES["file"]["type"] == "image/png"
        || $_FILES["file"]["type"] == "image/jpg"
        || $_FILES["file"]["type"] == "image/gif"
        || $_FILES["file"]["type"] == "image/jpeg"
        || $_FILES["file"]["type"] == "image/pjpeg")
    {
        // Новое имя изображения
        $filename = md5(date("YmdHis")).".jpg";
        $file = $dir.$filename;
        $region = $_POST['region'];

        // Копирование файла
        move_uploaded_file($_FILES["file"]["tmp_name"], $file);

        $query = "INSERT INTO road_case SET images = '$filename', id_reg = '$region'";
        mysqli_query($dbc, $query) or die("Ошибка при добавлении данных в таблицу");

        // Ответ сервера: путь до загруженного файла
        $array = array(
            "filelink" => "images/".$filename
        );
        echo stripslashes(json_encode($array));
    }
    mysqli_close($dbc)
?>
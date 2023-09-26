<?php
    require_once ('connectvars.php');
    //$filename = basename($_FILES['file']['name']);
    $filename = $_POST['filename'];
    //echo $filename;

    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    $query = "SELECT * FROM progbar WHERE clip_name = '$filename'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
    $row = mysqli_fetch_array($result);
    $total = $row['chunk_assess'];
    $uploaded = $row['clip_prog'];
    $otvet = floor($uploaded/$total * 100);
    echo json_encode(array('otvet' => $otvet));
    mysqli_close($dbc);
?>
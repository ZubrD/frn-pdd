<?php
    //Вставляю комментарии в таблицу БД
    require_once ('connectvars.php');
    session_start();
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $comment_case_id = $_POST['comment-case-id'];
    $text_comment = $_POST['text-comment'];
    $writer = $_SESSION['login'];

    $query = "INSERT INTO comments SET case_id = '$comment_case_id', writer = '$writer', comment = '$text_comment'";
    mysqli_query($dbc, $query) or die("Ошибка при добавлении данных в таблицу");

    $query_for_case = "UPDATE road_case SET comments = 'yes' WHERE newid = '$comment_case_id'";
    mysqli_query($dbc, $query_for_case) or die("Ошибка при внесении изменений в таблицу road_case");
    mysqli_close($dbc);
?>
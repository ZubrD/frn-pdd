<?php
    //Ответ на запрос по выведению на экран комментариев в кабинете
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    $case_id = $_GET['case_id'];

    $query = "SELECT * FROM comments WHERE case_id = '$case_id'";
    $result = mysqli_query($dbc, $query) or die("Не получилось получить комментарии по событию " . $case_id . "");
    $comments = array();
    while ($row = mysqli_fetch_array($result)){
        array_push($comments, array('writer' => $row['writer'], 'comment' => $row['comment']));
        //$odin_otvet = $row['comment'];
    }
    echo json_encode(array('otvet' => $comments));
    mysqli_close($dbc);
?>
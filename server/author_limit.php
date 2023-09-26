<?php
    require_once ('connectvars.php');
    session_start();
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");

    $author = $_SESSION['login'];
    $today = date("Y-m-d");
    $query_limit = "SELECT * FROM volontiers WHERE login =  '$author'";
    $result_limit = mysqli_query($dbc, $query_limit) or die ("Ошибка при получении общего лимита загрузок");
    $row_for_limit = mysqli_fetch_array($result_limit);
    $limit_value = $row_for_limit['limit_inserts'];
    $ban = $row_for_limit['ban'];   //Наличие метки бана ("yes");

    $query_today_limit = "SELECT * FROM author_inserts WHERE author = '$author' AND today = '$today'";
    $result_today_limit = mysqli_query($dbc, $query_today_limit) or die ("Ошибка при получении количества сегодняшних загрузок");;
    $num_row = mysqli_num_rows($result_today_limit);
    $row_for_today = mysqli_fetch_array($result_today_limit);
    if ($num_row == 0){
        //echo "000";             //Первая загрузка за день
        $today_limit = "000";
    } elseif ($num_row == 1){
        if($row_for_today['inserts'] < $limit_value){
            //echo "000";         //Лимит не закончился
            $today_limit = "000";
        } else {
            //echo "111";         //Лимит исчерпан
            $today_limit = "111";
        }
    }
    echo json_encode(array('inslimit' => $today_limit, 'ban' => $ban));
    mysqli_close($dbc);
?>
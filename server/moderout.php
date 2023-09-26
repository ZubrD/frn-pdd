<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');

    session_start();
    $_SESSION = array();
    if(isset($_COOKIE[session_name()])){
        setcookie(session_name(), '', time() - 3600);
    }
    if (!isset($_SESSION['dostup'])){    //Проверка удаления переменной сессии
        echo "777";
    }
    session_destroy();
?>
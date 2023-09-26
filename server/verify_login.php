<?php
    session_start();
    if(isset($_SESSION['login'])){
        echo "111";
    } else{
        echo "000";
    }
?>
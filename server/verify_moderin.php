<?php
    session_start();
    if(isset($_SESSION['dostup'])){
        echo "111";
    } else{
        echo "000";
    }
?>
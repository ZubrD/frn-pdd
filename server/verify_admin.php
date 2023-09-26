<?php
session_start();
if($_SESSION['status'] == "admin"){
    echo "111";
} else{
    echo "000";
}
?>
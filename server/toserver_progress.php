<?php
    //header('Content-type: text/html; charset=windows-1251');
    session_start();
    $fileprogr = $_SESSION['upload_progress']['name'];

    echo json_encode(array('progr' => $fileprog));

?>
<?php
    $post_msg = $_POST['message'];

    $get_data = "www.forma03.info/server/mail_back.php?factor1=" . $post_msg;
    $msg = "<a href='$get_data'>". $post_msg ."</a>";
    //$msg .= " " . md5("111");
    $to = $_POST['email'];
    $subject = "Send maill";
    $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: fort@forma03.info\r\n"; //Наименование и почта отправителя
    mail($to, $subject, $msg, $headers);
    echo $to;
?>
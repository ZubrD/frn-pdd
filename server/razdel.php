<?php
    //$row_string = '02/01/2017';
    $row_string = $_POST['hidden-search-from'];
   //echo $row_string;
    $ready_year = substr($row_string, 6, 4);
    $ready_month = substr($row_string, 0, 2);
    $ready_day = substr($row_string, 3, 2);
    echo $ready_year . "-" . $ready_month . "-" . $ready_day;
?>
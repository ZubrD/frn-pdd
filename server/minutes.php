<?php
    $minutes = "";
    for($i = 1; $i < 60; $i ++){
        $minutes .= "<option value='$i'>" . $i . "</option>";
    };
    echo $minutes;
?>
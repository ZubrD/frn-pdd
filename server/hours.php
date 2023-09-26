<?php
    $hours = "";
    for($i = 0; $i < 24; $i ++){
        $hours .= "<option value='$i'>" . $i . "</option>";
    };
    echo $hours;
?>
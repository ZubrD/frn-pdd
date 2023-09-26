<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    $query  = "SELECT * FROM volontiers";
    $result = mysqli_query($dbc, $query) or die("Не получилось взять список авторов");
    while ($row = mysqli_fetch_array($result)){
        $author;
        $autor_cases = 0;
        if ($row['login']){
            $author = $row['author'];
            if($author == $row['author']){
                $autor_cases += $autor_cases;
            }
        }
    }
?>
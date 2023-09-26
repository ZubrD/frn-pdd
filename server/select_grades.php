<?php
    //Выбираю оценки для заданного запросом пользователя
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    session_start();
    $author = $_SESSION['login'];
    $query = "SELECT * FROM case_grade WHERE assessor = '$author'";
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы оценок");

    $selected_grades = array();
    while ($row = mysqli_fetch_array($result)){
        array_push($selected_grades, array('assessor' => $row['assessor'], 'case_id' => $row['case_id']));
    }
    echo json_encode(array('otvet' => $selected_grades));
    mysqli_close($dbc);
?>
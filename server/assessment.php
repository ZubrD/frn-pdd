<?php
    //Вставляю оценку в таблицу case_grade и подсчитываю суммарную количество положительных и отрицательных отзывов в таблице road_case
    require_once ('connectvars.php');
    session_start();
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

    $author = $_SESSION['login'];

    if (isset($_GET['good_assess_case_id'])){
        $case_id = $_GET['good_assess_case_id'];
        $query = "INSERT INTO case_grade SET case_id = '$case_id', assessor = '$author', good_grade = '1', bad_grade = '0'";
        mysqli_query($dbc, $query) or die("Не получилось добавить положительную оценку видео");

        $query_select_grades = "SELECT grades_yes FROM road_case WHERE newid = '$case_id'";
        $result_select = mysqli_query($dbc, $query_select_grades) or die("Не получилось извлечь положительную оценку из таблицы road_case");
        $row = mysqli_fetch_array($result_select);
        $yes = $row['grades_yes'];
        $yes = $yes + 1;
        $query_update_grades = "UPDATE  road_case SET grades_yes = '$yes' WHERE newid = '$case_id'";
        mysqli_query($dbc,  $query_update_grades) or die("Не получилось обновить суммарную положительную оценку в таблице road_case");
    }
    if (isset($_GET['bad_assess_case_id'])){
        $case_id = $_GET['bad_assess_case_id'];
        $query = "INSERT INTO case_grade SET case_id = '$case_id', assessor = '$author', good_grade = '0', bad_grade = '1'";
        mysqli_query($dbc, $query) or die("Не получилось добавить отрицательную оценку видео");

        $query_select_grades = "SELECT grades_no FROM road_case WHERE newid = '$case_id'";
        $result_select = mysqli_query($dbc, $query_select_grades) or die("Не получилось извлечь отрицательную оценку из таблицы road_case");
        $row = mysqli_fetch_array($result_select);
        $no = $row['grades_no'];
        $no = $no + 1;
        $query_update_grades = "UPDATE  road_case SET grades_no = '$no' WHERE newid = '$case_id'";
        mysqli_query($dbc,  $query_update_grades) or die("Не получилось обновить суммарную отрицательную оценку в таблице road_case");
    }

    mysqli_close($dbc);
?>
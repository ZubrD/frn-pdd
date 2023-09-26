<?php
    //Файл для localhost отличается от файла на хостинге (разный формат даты в БД)
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    if($_GET['violation-search']){
        $violation = " AND road_case.id_violation = '" . $_GET['violation-search'] . "'";
    }
    if($_GET['region-search']){
        $region = " AND road_case.id_reg = '" . $_GET['region-search'] . "'";
    }

    if($_GET['town-search']){
        $town = " AND road_case.id_town = '" . $_GET['town-search'] . "'";
    }

    if($_GET['dbcar-numer-search']){
        $car_numer = " AND road_case.car_numer = '" . $_GET['dbcar-numer-search'] . "'";
    }

    if($_GET['dec-status']){                                       //Статус запроса в ГИБДД
        $stat = $_GET['dec-status'];
        if ($stat != "00"){
            $dec_status = " AND road_case.dec_status = '" . $_GET['dec-status'] . "'";
        } elseif ($stat == "00") {
            $dec_status = " AND (road_case.dec_status = 'wait' OR road_case.dec_status = 'sended' OR road_case.dec_status = 'yes' OR road_case.dec_status = 'no' OR road_case.dec_status = 'ignor' OR road_case.dec_status = 'joke')";
        }
    }

    if($_GET['hidden-carnumer']){                                 //Для поиска только по номеру машины
        $car_numer = " AND road_case.car_numer = '" . $_GET['hidden-carnumer'] . "'";
    }

    if($_GET['dbcar-author-search']){
        $author = " AND road_case.author = '" . $_GET['dbcar-author-search'] . "'";
    }

    if(!$_GET['dbcar-author-search']){
        $only_proved = " AND road_case.proved = 'yes'";     // Если данные НЕ для кабинета, то выбираются только подтверждённые видео
    }

    if($_GET['proved-yes-search']){
        $proved_yes = " AND road_case.proved NOT IN ('" . $_GET['proved-yes-search'] . "')";
    }

    if($_GET['proved-no-search']){                              //Для кабинета (нерассмотренные)
        $proved_no = " AND road_case.proved NOT IN ('" . $_GET['proved-no-search'] . "')";
    }

    if($_GET['proved-bad-search']){                             //Для кабинета (отклонённые)
        $proved_bad = " AND road_case.proved NOT IN ('" . $_GET['proved-bad-search'] . "')";
    }

    if($_GET['date-from'] AND !$_GET['date-to']){                //Если в запросе указана ТОЛЬКО НАЧАЛЬНАЯ дата
        $row_string_from = $_GET['date-from'];
/*        $ready_year_from = substr($row_string_from, 6, 4);    //Выделяю год
        $ready_month_from = substr($row_string_from, 0, 2);   //Выделяю месяц
        $ready_day_from = substr($row_string_from, 3, 2);     //Выделяю день
        $ready_date_from = $ready_year_from . "-" . $ready_month_from . "-" . $ready_day_from;   //Снова составляю дату, только на сей раз соответствующую формату даты из БД
        $date_interval = " AND road_case.dataa >= '$ready_date_from'";*/
        $date_interval = " AND road_case.denj >= '$row_string_from'";
    }

    if(!$_GET['date-from'] AND $_GET['date-to']){                //Если в запросе указана ТОЛЬКО КОНЕЧНАЯ дата
        $row_string_to = $_GET['date-to'];
/*        $ready_year_to = substr($row_string_to, 6, 4);    //Выделяю год
        $ready_month_to = substr($row_string_to, 0, 2);   //Выделяю месяц
        $ready_day_to = substr($row_string_to, 3, 2);     //Выделяю день
        $ready_date_to = $ready_year_to . "-" . $ready_month_to . "-" . $ready_day_to;   //Снова составляю дату, только на сей раз соответствующую формату даты из БД
        $date_interval = " AND road_case.dataa <= '$ready_date_to'";*/
        $date_interval = " AND road_case.denj <= '$row_string_to'";
    }

    if($_GET['date-from'] AND $_GET['date-to']){                //Если в запросе указана И НАЧАЛЬНАЯ И КОНЕЧНАЯ даты
        $row_string_from = $_GET['date-from'];
/*        $ready_year_from = substr($row_string_from, 6, 4); $ready_month_from = substr($row_string_from, 0, 2); $ready_day_from = substr($row_string_from, 3, 2);
        $ready_date_from = $ready_year_from . "-" . $ready_month_from . "-" . $ready_day_from;*/

        $row_string_to = $_GET['date-to'];
/*        $ready_year_to = substr($row_string_to, 6, 4); $ready_month_to = substr($row_string_to, 0, 2); $ready_day_to = substr($row_string_to, 3, 2);
        $ready_date_to = $ready_year_to . "-" . $ready_month_to . "-" . $ready_day_to;
        $date_interval = " AND road_case.dataa <= '$ready_date_to' AND road_case.dataa >= '$ready_date_from'";*/
        $date_interval = " AND road_case.denj <= '$row_string_to' AND road_case.denj >= '$row_string_from'";
    }

    if($_GET['time-from'] AND !$_GET['time-to']){                //Если в запросе указано ТОЛЬКО НАЧАЛО временного интервала
        $time_from = $_GET['time-from'];
        $time_interval = " AND road_case.times >= '$time_from'";
    }

    if(!$_GET['time-from'] AND $_GET['time-to']){                //Если в запросе указан ТОЛЬКО КОНЕЦ временного интервала
        $time_to = $_GET['time-to'];
        $time_interval = " AND road_case.times <= '$time_to'";
    }

    if($_GET['time-from'] AND $_GET['time-to']){                //Если в запросе указаны И НАЧАЛО И КОНЕЦ временного интервала
        $time_from = $_GET['time-from'];
        $time_to = $_GET['time-to'];
        $time_interval = " AND road_case.times <= '$time_to' AND road_case.times >= '$time_from'";
    }

    $query = "SELECT * FROM road_case INNER JOIN regions USING (id_reg) INNER JOIN violations USING (id_violation)
              INNER JOIN towns USING (id_town) WHERE road_case.server_video = '' AND road_case.id_reg = towns.id_reg" .
              $violation . $region . $town . $car_numer . $author . $proved_yes . $proved_no . $proved_bad . $only_proved . $date_interval . $time_interval . $dec_status; //Связываю с таблицей road_case таблицы regions и towns, ограничивая выбор в таблице towns значением из поля id_reg
    $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы"); // proved = yes - значит видео проверено

    $region_town = array();
    $cur_date = date("Y-m-d");
    while ($row = mysqli_fetch_array($result)){
        $dif_date = (strtotime($cur_date) - strtotime($row['dataa']))/3600/24;              //Сколько дней уже рассматривается заявление
        $limit_of_action = 60 - (strtotime($cur_date) - strtotime($row['denj']))/3600/24;   //Сколько дней осталось до истечения срока давности
/*        if ($limit_of_action <= 0){
            $limit_of_action = 0;
        }*/
        array_push($region_town, array('newid' => $row['newid'], 'id_reg' => $row['id_reg'], 'reg_name' => $row['region'],
            'town_name' => $row['town'], 'violation' => $row['violation'], 'violation_style' => $row['violation_style'],
            'violation_color' => $row['violation_color'], 'violation_pic' => $row['violation_pic'],
            'violation_picsize1' => $row['violation_picsize1'], 'violation_picsize2' => $row['violation_picsize2'],
            'latitude' => $row['latitude'], 'longitude' => $row['longitude'], 'car_numer' => $row['car_numer'], 'images' => $row['images'],
            'videos' => $row['videos'], 'dataa' => $row['dataa'], 'denj' => $row['denj'], 'dif_date' => $dif_date, 'limit_of_action' => $limit_of_action,
            'times' => $row['times'], 'proved' => $row['proved'], 'author' => $row['author'], 'comments' => $row['comments'],
            'grades_yes' => $row['grades_yes'], 'grades_no' => $row['grades_no'], 'id_gibdd' => $row['id_gibdd'], 'dec_status' => $row['dec_status']));
    }
    echo json_encode(array('otvet' => $region_town));
    mysqli_close($dbc);
?>
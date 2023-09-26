<?php
    header('Content-type: text/html; charset=utf8');
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////СОЗДАНИЕ ТАБЛИЦЫ//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $drop_tab = "DROP TABLE examp";
    mysqli_query($dbc, $drop_tab) or ("Ошибка при удалении таблицы examp");
    $create_tab = "CREATE TABLE examp (town VARCHAR (30), id_reg VARCHAR (10), id_town VARCHAR (10), cases INTEGER (5), cases_sended INTEGER (5),
                  cases_yes INTEGER (5), cases_no INTEGER (5), cases_ignor INTEGER (5), cases_joke INTEGER (5), cases_excited INTEGER (5))";
    mysqli_query($dbc,  $create_tab) or die ("Ошибка при создании таблицы");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $query = "SELECT * FROM towns ORDER BY town ASC";       //Выбираю все города
    $result = mysqli_query($dbc, $query) or die("Ошибка при выводе названий регионов");
    $array_reg = array();
    while($row = mysqli_fetch_array($result)){
        array_push($array_reg, array('town' => $row['town'], 'id_reg' => $row['id_reg'], 'id_town' => $row['id_town']));  //Формирую из названий регионов и их идентификаторов массив
    }
    $array_reg_stat = array();
    for($i = 0; $i < count($array_reg); $i ++){
        $id_reg = $array_reg[$i]['id_reg'];
        $id_town = $array_reg[$i]['id_town'];
        $town = $array_reg[$i]['town'];

        $query2 = "SELECT * FROM road_case WHERE id_reg ='$id_reg' AND id_town = '$id_town' AND id_gibdd !='Неизвестный'";//Выбираю записи только конкретного города для которого есть рапорты
        $result2 = mysqli_query($dbc, $query2) or die("Ошибка при извлечении данных из таблицы road_case");
        $nums = mysqli_num_rows($result2);  // Для проверки наличия рапортов

        if($nums > 0){      // Если рапортов по городу больше нуля, то...
            $nums_sended = 0;
            $nums_yes = 0;
            $nums_no = 0;
            $nums_ignor = 0;
            $nums_joke = 0;
            $nums_excited = 0;
            while ($row = mysqli_fetch_array($result2)){    // прохожу в цикле весь массив и отбираю...
                if($row['dec_status'] == 'sended'){         // если статус sended, то увеличиваю на единицу переменную nums_sended (в итоге получаю количество направленных рапортов)
                    $nums_sended = $nums_sended + 1;        // и так далее...
                }
                if($row['dec_status'] == 'yes'){
                    $nums_yes = $nums_yes + 1;
                }
                if($row['dec_status'] == 'no'){
                    $nums_no = $nums_no + 1;
                }
                if($row['dec_status'] == 'ignor'){
                    $nums_ignor = $nums_ignor + 1;
                }
                if($row['dec_status'] == 'joke'){
                    $nums_joke = $nums_joke + 1;
                }
                if($row['dec_status'] == 'excited'){
                    $nums_excited = $nums_excited + 1;
                }
            }
/*            array_push($array_reg_stat, array('town' => $town, 'id_reg' => $id_reg, 'id_town' => $id_town, 'cases' => $nums,
                'cases_sended' => $nums_sended, 'cases_yes' => $nums_yes, 'cases_no' => $nums_no, 'cases_ignor' => $nums_ignor,
                'cases_joke' => $nums_joke, 'cases_excited' => $nums_excited));   //Формирую массив для передачи на сайт*/
/////////////////////////////////////////////////////////////ДОБАВЛЕНИЕ СТРОК В СВОДНУЮ ТАБЛИЦУ///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $insert_tab = "INSERT INTO examp SET town = '$town', id_reg = '$id_reg', id_town = '$id_town', cases = '$nums',
                          cases_sended = '$nums_sended', cases_yes = '$nums_yes', cases_no = '$nums_no',  cases_ignor = '$nums_ignor',
                          cases_joke = '$nums_joke', cases_excited = '$nums_excited'";
            mysqli_query($dbc, $insert_tab) or die("Ошибка при добавлении строк в таблицу exited");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }
    //echo json_encode(array('otvet' => $array_reg_stat));
    echo "Успешно";
    mysqli_close($dbc);
?>



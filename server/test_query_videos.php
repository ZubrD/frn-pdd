<?php
    require_once ('connectvars.php');
    $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
    mysqli_query($dbc, "SET CHARACTER SET 'utf8'");

    include_once('config.php');

    function clean($string) {
        $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
        return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
    }

    $array_id = array();
    $query = "SELECT * FROM road_case WHERE reserved = ''";
    $result = mysqli_query($dbc, $query) or die("Ошибка при получении списка несохранённых видео");
    while($row = mysqli_fetch_array($result)){
        array_push($array_id, $row['videos']);
    }

    $array_reserved_video  = array();
    //$array_id = array("OjEAGSvGkVI", "JhVr9sN6dXU", "R7DPFGuQrwM", "GQm2jQjOx10", "pX6SuX0Z6AQ", "mHhomX1jF2E");//МОЙ КОД ПРЯМОЙ ВСТАВКИ ID ВИДЕО
    $reserved_video_path='C:\OpenServer\domains\localhost\ybd\reserved_video.txt';
    for($j = 0; $j < count($array_id); $j ++){
        $my_id = $array_id[$j];
        $my_video_info = 'http://www.youtube.com/get_video_info?&video_id='. $my_id.'&asv=3&el=detailpage&hl=en_US'; //video details fix *1
        $my_video_info = curlGet($my_video_info);       //Отправляем запрос на youtube
        /* Check return from curl for status code */
        $thumbnail_url = $title = $url_encoded_fmt_stream_map = $type = $url = '';
        parse_str($my_video_info);                      //Разбираем полученный ответ

        $my_title = $title;
        $cleanedtitle = clean($title);

        $my_formats_array = explode(',',$url_encoded_fmt_stream_map);

        /* create an array of available download formats */
        $avail_formats[] = '';
        $i = 0;
        $ipbits = $ip = $itag = $sig = $quality = '';
        $expire = time();

        foreach($my_formats_array as $format) {
            parse_str($format);
            $avail_formats[$i]['itag'] = $itag;
            $avail_formats[$i]['quality'] = $quality;
            $type = explode(';',$type);
            $avail_formats[$i]['type'] = $type[0];
            $avail_formats[$i]['url'] = urldecode($url) . '&signature=' . $sig;
            parse_str(urldecode($url));
            $avail_formats[$i]['expires'] = date("G:i:s T", $expire);
            $avail_formats[$i]['ipbits'] = $ipbits;
            $avail_formats[$i]['ip'] = $ip;
            $i++;
        }

        for ($i = 0; $i < count($avail_formats); $i++) {
            if($avail_formats[$i]['itag'] == 18){           //ЭТО МОЙ КОД ПРЯМОГО СКАЧИВАНИЯ БЕЗ ССЫЛКИ, НАЧАЛО НА СТРОКЕ 90
                $mime = $avail_formats[$i]['type'];
                $ext  = str_replace(array('/', 'x-'), '', strstr($mime, '/'));
                $final_url = $avail_formats[$i]['url'];
                $local='C:\OpenServer\domains\localhost\ybd\\' .$my_title . "." . $ext;		//Дополнительным слэшем экранирую тот слэш, что перед именем файла
                echo $my_id . ": " . file_put_contents($local, file_get_contents($final_url)) . "<br />";   // Скачивание файла и вывод на экран переданного количество байтов
            }
        }
        //Получение данных из файла со списком скаченных из Youtube роликов
        if(file_exists($reserved_video_path)){      //Если файл с идентифкаторами видео в youtube уже существует ...
            $array_reserved_video = json_decode(file_get_contents($reserved_video_path));   //извлекаю и декодирую массив...
            array_push($array_reserved_video, $my_id);                                      //добавляю очередной идентификатор ...
            $json_reserved_video = json_encode($array_reserved_video);                      //кодирую в формат json и
            file_put_contents($reserved_video_path, $json_reserved_video);                  //обновляю файл с идентификаторами
        } else {
            array_push($array_reserved_video, $my_id);
            $json_reserved_video = json_encode($array_reserved_video);
            file_put_contents($reserved_video_path, $json_reserved_video);
        }
    }
?>
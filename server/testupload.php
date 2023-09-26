<?php
    //include_once "templates/base.php";
    include_once "c:/openserver/domains/localhost/roadcontrol/vendor/google/apiclient/examples/templates/base.php"; // Для крона
    //set_include_path("../vendor/google/apiclient/src/" . PATH_SEPARATOR . get_include_path());
    //set_include_path("c:/openserver/domains/localhost/roadcontrol/vendor/google/apiclient/src/");
    set_include_path(get_include_path() . PATH_SEPARATOR . 'c:/openserver/domains/localhost/roadcontrol/vendor/google/apiclient/src/');
    // Call set_include_path() as needed to point to your client library.
    require_once 'Google/Client.php';
    require_once 'Google/Service/YouTube.php';
    require_once 'Google/connectvars.php';
    //require_once ('c:/openserver/domains/localhost/roadcontrol/server/connectvars.php'); // Для крона
    $key = file_get_contents('c:/openserver/domains/localhost/roadcontrol/server/the_key.txt');

    //session_start();

    /*
     * You can acquire an OAuth 2.0 client ID and client secret from the
     * Google Developers Console <https://console.developers.google.com/>
     * For more information about using OAuth 2.0 to access Google APIs, please see:
     * <https://developers.google.com/youtube/v3/guides/authentication>
     * Please ensure that you have enabled the YouTube Data API for your project.
     */
    $OAUTH2_CLIENT_ID = '11525113127-tnl6v6tcqadm69hdpkmd7b2h3na2ul4o';
    $OAUTH2_CLIENT_SECRET = 'TgNaLIXB6dzVoYckHVeEdIfd';

    $client = new Google_Client();

    $client->setClientId($OAUTH2_CLIENT_ID);
    $client->setClientSecret($OAUTH2_CLIENT_SECRET);
    $client->setAccessType('offline');
    $client->setAccessToken($key);
    $client->setApprovalPrompt('auto');
    $client->setScopes('https://www.googleapis.com/auth/youtube');
    /*$redirect = filter_var('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'],
        FILTER_SANITIZE_URL);*/
    $redirect = 'http://localhost/roadcontrol/server/testupload.php';
    $client->setRedirectUri($redirect);

    // Define an object that will be used to make all API requests.
    $youtube = new Google_Service_YouTube($client);

/*    if (isset($_GET['code'])) {
        if (strval($_SESSION['state']) !== strval($_GET['state'])) {
            die('The session state did not match.');
        }

        $client->authenticate($_GET['code']); // получаю временный код и обмениваю его, после выполнения функции authenticate, на access token
        $_SESSION['token'] = $client->getAccessToken();
        header('Location: ' . $redirect);
    }*/

    /*if($client->isAccessTokenExpired()) {
        $_SESSION['token'] = $client->getRefreshToken();
        $authUrl = $client->createAuthUrl();
        //header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
        header('Location: ' . $redirect);

    }*/

/*    if (isset($_SESSION['token'])) {
        $client->setAccessToken($_SESSION['token']);
        echo '<code>' . $_SESSION['token'] . '</code>';
    }*/
    //echo $_GET['token'];

    // Check to ensure that the access token was successfully acquired.



    if ($client->getAccessToken()) {



        if($client->isAccessTokenExpired()) {
            $newToken = json_decode($client->getAccessToken());
            $client->refreshToken($newToken->refresh_token);
            file_put_contents('the_key.txt', $client->getAccessToken());
        }

        try {
            // Надо извлечь из БД строки, в которых server_video равно yes, получить названия файлов,
            // в цикле while добавить пути к файлам в массив $manyvideos
            $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
            mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Чтобы нормально отображались данные в базе и перенесённые из базы на страницу

            //$dir = "../videos/"; // Первые две точки означают, что файл php хранится не в корневой папке (нужно подняться на уровень выше)
            $dir = "c:/openserver/domains/localhost/roadcontrol/videos/"; // Для крона

            $query_select_reserve = "SELECT * FROM road_case WHERE server_video = 'yes' LIMIT 6";// Резервирую за скриптом testupload 6 строк
            $result_select_reserve = mysqli_query($dbc, $query_select_reserve) or die("Ошибка при извлечении данных из таблицы");
            while ($row = mysqli_fetch_array($result_select_reserve)){
                $id_reserve = $row['newid'];
                $query_reserve = "UPDATE road_case SET server_video = '', upload1 = 'yes' WHERE newid = '$id_reserve'";
                mysqli_query($dbc, $query_reserve);
            }

            //$query = "SELECT * FROM road_case WHERE upload1 = 'yes'";// Если server_video = yes, значит видео ещё не загружено на youtube

            //Извлекаю зарезервированные строки
            $query = "SELECT * FROM road_case INNER JOIN regions USING (id_reg) INNER JOIN violations USING (id_violation)
              INNER JOIN towns USING (id_town) WHERE upload1 = 'yes' AND road_case.id_reg = towns.id_reg AND road_case.id_violation = violations.id_violation"; //Связываю с таблицей road_case таблицы regions и towns, ограничивая выбор в таблице towns значением из поля id_reg

            $result = mysqli_query($dbc, $query) or die("Ошибка при извлечении данных из таблицы");
            $num_uploads = 0;

            //foreach ($manyvideos as $videoPath) {
            while ($row = mysqli_fetch_array($result)){
                $path = $dir . $row['images'];
                $video_title = substr($row['images'], 0, -4);   //Удаляю расширение из названия файла и делаю его титулом видео
                $car_numer = $row['car_numer'];
                $reg_name = $row['region'];
                $town_name = $row['town'];
                $violation = $row['violation'];
                $dataa = $row['dataa'];

                // Create a snippet with title, description, tags and category ID
                // Create an asset resource and set its snippet metadata and type.
                // This example sets the video's title, description, keyword tags, and
                // video category.
                $snippet = new Google_Service_YouTube_VideoSnippet();
                $snippet->setTitle($video_title);
                $snippet->setDescription($violation);
                //$snippet->setTags(array("tag1", "tag2"));
                $snippet->setTags(array($reg_name, $town_name, $car_numer, $violation));

                // Numeric video category. See
                // https://developers.google.com/youtube/v3/docs/videoCategories/list
                $snippet->setCategoryId("22");

                // Set the video's status to "public". Valid statuses are "public",
                // "private" and "unlisted".
                $status = new Google_Service_YouTube_VideoStatus();
                $status->privacyStatus = "public";

                // Associate the snippet and status objects with a new video resource.
                $video = new Google_Service_YouTube_Video();
                $video->setSnippet($snippet);
                $video->setStatus($status);

                // Specify the size of each chunk of data, in bytes. Set a higher value for
                // reliable connection as fewer chunks lead to faster uploads. Set a lower
                // value for better recovery on less reliable connections.
                $chunkSizeBytes = 1 * 1024 * 1024;

                // Setting the defer flag to true tells the client to return a request which can be called
                // with ->execute(); instead of making the API call immediately.
                $client->setDefer(true);

                // Create a request for the API's videos.insert method to create and upload the video.
                $insertRequest = $youtube->videos->insert("status,snippet", $video);

                // Create a MediaFileUpload object for resumable uploads.
                $media = new Google_Http_MediaFileUpload(
                    $client,
                    $insertRequest,
                    'video/*',
                    null,
                    true,
                    $chunkSizeBytes
                );
                $media->setFileSize(filesize($path));


                // Read the media file and upload it chunk by chunk.
                $status = false;
                $handle = fopen($path, "rb");
                while (!$status && !feof($handle)) {
                    $chunk = fread($handle, $chunkSizeBytes);
                    $status = $media->nextChunk($chunk);
                }

                fclose($handle);

                // If you want to make other calls after the file upload, set setDefer back to false
                $client->setDefer(false);


                $htmlBody .= "<h3>Video Uploaded</h3><ul>";
                $htmlBody .= sprintf('<li>%s (%s)</li>',
                    $status['snippet']['title'],
                    $status['id']);

                $htmlBody .= '</ul>';

                @unlink($path);  // Удаляю файл с сервера
                //echo "Удалён файл " . $path;
                $id = $row['newid'];
                $video_id = $status['id'];  //ИДЕНТИФИКАТОР YOUTUBE ДЛЯ ЗАГРУЖЕННОГО ВИДЕО
                $query_for_update = "UPDATE road_case SET upload1 = '', videos = '$video_id', dataa = NOW() WHERE newid = '$id'";//Обнуляю, зарезервированное под этот скрипт поле upload1
                mysqli_query($dbc, $query_for_update) or die("Ошибка при изменении данных");
                $num_uploads = $num_uploads + 1;

                $today = date("Y-m-d");     //Можно оформить в виде функции
                $query_for_count = "SELECT * FROM daily_uploads WHERE today = '$today'";
                $result_count = mysqli_query($dbc, $query_for_count) or die ("Ошибка при извлечении данных из таблицы daily_uploads");
                $num_row = mysqli_num_rows($result_count);  //Проверяю, есть ли строка с сегодняшней датой
                $row_for_count = mysqli_fetch_array($result_count);
                if ($num_row == 1){ //Если есть, то увеличиваю количество загрузок на единицу
                    $count = $row_for_count['upload_count'] + 1;
                    $query_for_update_count = "UPDATE daily_uploads SET upload_count = '$count' WHERE today = '$today'";
                    mysqli_query($dbc, $query_for_update_count);
                    //echo "Теперь значение upload_count равен " . $count;
                } else if($num_row == 0) {  //Если нет, то добавляю строку с сегодняшней датой и устанавливаю количество загрузок в единицу
                    $count = 1;
                    $query_for_update_count = "INSERT INTO daily_uploads SET today = '$today', upload_count = '$count'";
                    mysqli_query($dbc, $query_for_update_count);
                    //echo "Начался новый день. Теперь значение upload_count равен" . $count;
                }

        }
        echo $num_uploads;
        mysqli_close($dbc);

        } catch (Google_Service_Exception $e) {
            $htmlBody .= sprintf('<p>A service error occurred: <code>%s</code></p>',
                htmlspecialchars($e->getMessage()));
        } catch (Google_Exception $e) {
            $htmlBody .= sprintf('<p>An client error occurred: <code>%s</code></p>',
                htmlspecialchars($e->getMessage()));
        }

        $_SESSION['token'] = $client->getAccessToken();
    } else {
        // If the user hasn't authorized the app, initiate the OAuth flow

        $state = mt_rand();
        $client->setState($state);
        $_SESSION['state'] = $state;

        $authUrl = $client->createAuthUrl();
        $htmlBody = <<<END
      <h3>Authorization Required</h3>
      <p>You need to <a href="$authUrl">authorize access</a> before proceeding.<p>
END;
    }



?>

<!doctype html>
<html>
<head>
    <title>Video Uploaded</title>
</head>
<body>
<?=$htmlBody?>
</body>
</html>
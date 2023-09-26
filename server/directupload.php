<?php
//header('Content-type: text/html; charset=windows-1251');
require_once ('connectvars.php');
session_start();
$dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) or die("Ошибка соединения с сервером");
mysqli_query($dbc, "SET CHARACTER SET 'utf8'"); // Изменение кодировки данных в таблице, чтобы кириллические символы корректно вставлялись

$car_numer = $_POST['dbcar_numer'];
$id_reg = $_POST['region'];
$id_town = $_POST['town'];
$lat = $_POST['dblat'];
$long = $_POST['dblong'];
$date = $_POST['date'];
$times = $_POST['times'];
$violation = $_POST['violation'];
$video_id_map = $_POST['video_id_map'];
$author = $_SESSION['login'];

if ($_POST['video_id_map']){    //Загружен файл или прямая ссылка?
    $server_video = "";         //Загружена прямая ссылка
} else {
    $server_video = "yes";      //Загружен файл

    $dir = "../videos/"; // Первые две точки означают, что файл php хранится не в корневой папке (нужно подняться на уровень выше)
    $_FILES["file"]["type"] = strtolower($_FILES["file"]["type"]);

    // Новое имя файла
    $filename = md5(date("YmdHis")).basename($_FILES['file']['name']);
    //$filename = basename($_FILES['file']['name']);
    $file = $dir.$filename;     //Конечный путь к файлу

    // Копирование файла
    move_uploaded_file($_FILES["file"]["tmp_name"], $file); //Перемещение файла в целевую папку
    $file_size = filesize($file);
    $chunks = $file_size/(1024 * 256);  //Количество порций отправок видео

    $query = "INSERT INTO progbar SET clip_name = '$filename', clip_size = '$file_size', chunk_assess = '$chunks'";
    mysqli_query($dbc, $query) or die ("Ошибка");
}

echo json_encode(array('otvet' => $filename));
// Ответ сервера: путь до загруженного файла
$array = array(
    "filelink" => "videos/".$filename
);
//echo stripslashes(json_encode($array));
//mysqli_close($dbc);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    $OAUTH2_CLIENT_ID = '11525113127-tnl6v6tcqadm69hdpkmd7b2h3na2ul4o';
    $OAUTH2_CLIENT_SECRET = 'TgNaLIXB6dzVoYckHVeEdIfd';

    $client = new Google_Client();

    $client->setClientId($OAUTH2_CLIENT_ID);
    $client->setClientSecret($OAUTH2_CLIENT_SECRET);
    $client->setAccessType('offline');
    $client->setAccessToken($key);
    $client->setApprovalPrompt('auto');
    $client->setScopes('https://www.googleapis.com/auth/youtube');

    $redirect = 'http://localhost/roadcontrol/server/testupload.php';
    $client->setRedirectUri($redirect);

    // Define an object that will be used to make all API requests.
    $youtube = new Google_Service_YouTube($client);

    // Check to ensure that the access token was successfully acquired.

    if ($client->getAccessToken()) {

        if($client->isAccessTokenExpired()) {
            $newToken = json_decode($client->getAccessToken());
            $client->refreshToken($newToken->refresh_token);
            file_put_contents('the_key.txt', $client->getAccessToken());
        }

        try {

            //$dir = "c:/openserver/domains/localhost/roadcontrol/videos/"; // Для крона

            $path = $dir . $filename;
            $video_title = "Титул";

            $snippet = new Google_Service_YouTube_VideoSnippet();
            $snippet->setTitle($video_title);
            $snippet->setDescription("Описание");
            //$snippet->setTags(array("tag1", "tag2"));
            $snippet->setTags("Прямая загрузка");

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
            //$chunkSizeBytes = 1 * 1024 * 1024;
            $chunkSizeBytes = 1 * 1024 * 256;

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
            $num = 0;
            while (!$status && !feof($handle)) {
                $num = $num + 1;
                $chunk = fread($handle, $chunkSizeBytes);
                $status = $media->nextChunk($chunk);
                $query = "UPDATE progbar SET clip_prog = '$num' WHERE clip_name = '$filename'";
                mysqli_query($dbc, $query) or die ("Ошибка");
            }

            fclose($handle);

            // If you want to make other calls after the file upload, set setDefer back to false
            $client->setDefer(false);

            @unlink($path);  // Удаляю файл с сервера
            //echo "Удалён файл " . $path;
            $id = $row['newid'];
            $video_id = $status['id'];  //ИДЕНТИФИКАТОР YOUTUBE ДЛЯ ЗАГРУЖЕННОГО ВИДЕО
            echo json_encode(array('otvet' => $video_id));
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
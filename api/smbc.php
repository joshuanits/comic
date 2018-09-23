<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "https://www.smbc-comics.com/";

if($id != "0"){
    $url = "https://www.smbc-comics.com/comic/$id";
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

try {
    $response = curl_exec($ch);
    if(curl_errno($ch))
        throw new Exception(curl_error($ch));
    if(strpos($response, "There is no comic with this ID."))
        throw new Exception("not_found");
    curl_close ($ch);  
    
    $resp = array();

    $doc = new DOMDocument();
    $doc->loadHTML($response);

    $resp['link'] = $doc->getElementById('permalinktext')->getAttribute('value');
    $resp['id'] = explode("/", $resp['link'])[4];
    $resp['img'] = str_replace(" ", "%20", $doc->getElementById('cc-comic')->getAttribute('src'));
    $resp['bonus'] = $doc->getElementById('aftercomic')->firstChild->getAttribute('src');
    $resp['title'] = $doc->getElementById('cc-comic')->getAttribute('title');

    $resp['success'] = 1;

} catch (HttpException $ex) {
    $resp["success"] = 0;
    $resp["error"] = $ex;
} catch (Exception $ex) {
    $resp["success"] = 0;
    $resp["error"] = $ex->getMessage();
}

header('Content-Type: application/json');
echo json_encode($resp);
?>
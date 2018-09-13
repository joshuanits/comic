<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$config_json = file_get_contents("../config.json");
$config = json_decode($config_json, true);


$id = $_GET["id"];

$api_key = $config['tumblr_key'];

$url = "https://api.tumblr.com/v2/blog/webcomicname/posts/photo?api_key=$api_key";
if($id != 0){
    $url .= "&id=$id";
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if(curl_errno($ch))
    echo 'Curl error: '.curl_error($ch);
curl_close ($ch);  

header('Content-Type: application/json');
$resp = array();

try {
    $response_obj = json_decode($response, true);
    
    $resp['id'] = (string) $response_obj['response']['posts'][0]['id'];
    $resp['link'] = $response_obj['response']['posts'][0]['short_url'];

    $doc = new DOMDocument();
    $doc->loadHTML($response_obj['response']['posts'][0]['body']);
    $img_tag = $doc->getElementsByTagName('img')[0];

    $resp['img'] = $img_tag->getAttribute('src');

} catch (HttpException $ex) {
    $resp["success"] = 0;
    $resp["error"] = $ex;
}


echo json_encode($resp);


?>
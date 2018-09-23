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
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

try {
    $response = curl_exec($ch);
    if(curl_errno($ch))
        throw new Exception(curl_error($ch));
    if(curl_getinfo($ch)['http_code'] == 404)
        throw new Exception("not_found");
    curl_close ($ch);  
    
    $resp = array();
    $response_obj = json_decode($response, true);
    
    $resp['id'] = (string) $response_obj['response']['posts'][0]['id'];
    $resp['link'] = $response_obj['response']['posts'][0]['short_url'];

    $doc = new DOMDocument();
    $doc->loadHTML($response_obj['response']['posts'][0]['body']);
    $img_tag = $doc->getElementsByTagName('img')[0];

    $resp['img'] = $img_tag->getAttribute('src');

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
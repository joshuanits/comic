<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "http://explosm.net/comics/latest";
if($id != 0){
    $url = "http://explosm.net/comics/$id";
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

try {
    $response = curl_exec($ch);
    if(curl_errno($ch))
        throw new Exception(curl_error($ch));
    if(curl_getinfo($ch)['http_code'] == 404)
        throw new Exception("not_found");
    curl_close ($ch);  
    
    $resp = array();

    $doc = new DOMDocument();
    $doc->loadHTML($response);

    $resp['id'] = $doc->getElementById('comic-social-favorite')->getAttribute('data-id');
    $resp['img'] = $doc->getElementById('main-comic')->getAttribute('src');
    $id = $resp['id'];
    $resp['link'] = "explosm.net/comics/$id";

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
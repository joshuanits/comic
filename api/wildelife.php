<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "http://www.wildelifecomic.com/";

if($id != "0"){
    $url = "http://www.wildelifecomic.com/comic/$id";
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
    if(curl_getinfo($ch)['http_code'] == 404)
        throw new Exception("not_found");
    curl_close ($ch);  
    
    $resp = array();

    $doc = new DOMDocument();
    $doc->loadHTML($response);

    $img = $doc->getElementById('cc-comicbody')->firstChild;

    if($img->firstChild) {
        $img = $img->firstChild;
    }
    
    $resp['img'] = $img->getAttribute('src');
    $resp['title'] = $img->getAttribute('title');
   
    $resp['id'] = $doc->getElementById('bottomleft')->childNodes[1]->firstChild->textContent;
    $id = $resp['id'];
    $resp['link'] = "http://www.wildelifecomic.com/comic/$id";
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
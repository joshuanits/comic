<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "http://www.channelate.com";

if($id != "0"){
    $url = "http://www.channelate.com/comic/$id";
}

if($id == "random"){
    $url = "http://www.channelate.com/?random&nocache=1";
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
    if(curl_getinfo($ch)['http_code'] == 404 || curl_getinfo($ch)['http_code'] == 301)
        throw new Exception("not_found");
    curl_close ($ch);  
    
    $resp = array();

    $doc = new DOMDocument();
    $doc->loadHTML($response);

    if($id === "0") {
        $headerTags = $doc->getElementsByTagName('h2');
        $header = $headerTags[0];
        if($header->getAttribute('class') == "post-title") {
            $resp['link'] = $header->firstChild->getAttribute('href');
        }
    } else {
        $resp['link'] = $url . "/";
    }

    $spanTags = $doc->getElementsByTagName('span');
    foreach($spanTags as $span){
        if($span->getAttribute('class') == "comic-square" || $span->getAttribute('class') == "comic-tall" || $span->getAttribute('class') == "comic-wide") { 
            $resp['img'] = $span->firstChild->getAttribute('src');
            $resp['title'] = $span->firstChild->getAttribute('title');
        }
    }
    
    $bonusdiv = $doc->getElementById('extrapanelbutton');
    if($bonusdiv != NULL) {
        $resp['bonus'] = $bonusdiv->childNodes[1]->getAttribute('href');
    }
        

    if(array_key_exists('link', $resp)){
        $parts = explode("/", $resp['link']);
        $resp['id'] = $parts[count($parts) - 2];
    }

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
<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "http://www.channelate.com";
if($id != 0){
    $url = "http://channelate.com/comic/$id";
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
if(curl_errno($ch))
    echo 'Curl error: '.curl_error($ch);
curl_close ($ch);  

$resp = array();

try {
    $doc = new DOMDocument();
    $doc->loadHTML($response);

    $headerTags = $doc->getElementsByTagName('h2');
    $header = $headerTags[0];
    if($header->getAttribute('class') == "post-title") {
        $resp['link'] = $header->firstChild->getAttribute('href');
    }

    $spanTags = $doc->getElementsByTagName('span');
    foreach($spanTags as $span){
        if($span->getAttribute('class') == "comic-square" || $span->getAttribute('class') == "comic-tall") { 
            $resp['img'] = $span->firstChild->getAttribute('src');
            $resp['title'] = $span->firstChild->getAttribute('title');
        }
    }
    
    $bonusdiv = $doc->getElementById('extrapanelbutton');
    $resp['bonus'] = $bonusdiv->childNodes[1]->getAttribute('href');

    if(array_key_exists('link', $resp)){
        $parts = explode("/", $resp['link']);
        $resp['id'] = $parts[count($parts) - 2];
    }

} catch (HttpException $ex) {
    $resp["success"] = 0;
    $resp["error"] = $ex;
}

header('Content-Type: application/json');
echo json_encode($resp);
?>
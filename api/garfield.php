<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "https://garfield.com/comic/";
if($id != 0){
    $url = "https://garfield.com/comic/$id";
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

    $found = false;
    $aTags = $doc->getElementsByTagName('a');
    foreach($aTags as $a){
        if($found) break;
        if(preg_match("(garfield.com/comic/2)", $a->getAttribute('href')) == 1) { 
            $found = true;
            $resp['link'] = $a->getAttribute('href');
            $linkparts = explode('/', $resp['link']);
            $idparts = array_splice($linkparts, 0, -3);
            $id = join("/", $linkparts);
            $resp['id'] = $id;
        }
    }

    $found = false;
    $imgTags = $doc->getElementsByTagName('img');
    foreach($imgTags as $img){
        if($found) break;
        if($img->getAttribute('class') == "img-responsive") { 
            $found = true;
            $resp['img'] = $img->getAttribute('src');
        }
    }

} catch (HttpException $ex) {
    $resp["success"] = 0;
    $resp["error"] = $ex;
}

header('Content-Type: application/json');
echo json_encode($resp);
?>
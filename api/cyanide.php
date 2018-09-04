<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "www.explosm.net";
if($id != 0){
    $url = "www.explosm.net/comics/$id";
}

$reponse = http_get($url);

$resp = array();

try {
    $doc = new DOMDocument();
    $doc->loadHTML($response);
    $resp['id'] = $doc->getElementById('comic-social-favorite')->getAttribute('data-id');
    $resp['imgUrl'] = $doc->getElementById('main-comic')->getAttribute('src');
    $resp['perm'] = "explosm.net/comics/" + $resp['id'];
} catch (HttpException $ex) {
    $resp["success"] = 0;
    $resp["error"] = $ex;
}

echo json_encode($resp);


?>
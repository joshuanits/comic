<?php
$id = $_GET["id"];

$url = "www.explosm.net";
if($id != 0){
    $url = "www.explosm.net/comics/$id";
}

$r = new HttpRequest($url, HttpRequest::METH_GET);
try {
    $r->send();
    if($r->getResponseCode() == 200) {
        $reponse = $r->getResponseBody();
        echo $response;
    }
} catch (HttpException $ex) {
    echo $ex;
}
?>
<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "http://www.poorlydrawnlines.com";

if($id != "0"){
    $url = "http://www.poorlydrawnlines.com/comic/$id";
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

    $finder = new DomXPath($doc);
    $nodes = $finder->query("//figure[@class='wp-block-image']");

    $img = $nodes[0]->firstChild;

    $resp['img'] = $img->getAttribute('src');
    
    $link = substr($response, strpos($response, "var disqus_url"));
    $link = substr($link, strpos($link, "'") + 1);
    $link = substr($link, 0, strpos($link, "'"));

    $link_parts = explode("/", $link);

    $resp['id'] = $link_parts[count($link_parts) - 2];
    $resp['link'] = $link;
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
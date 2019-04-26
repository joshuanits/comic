<?php
if(!array_key_exists('id', $_GET)){
    exit(400);
}

$id = $_GET["id"];

$url = "http://tomanddave.cfw.me/";

if($id != "0"){
    $url = "http://tomanddave.cfw.me/comics/$id";
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
    if(curl_getinfo)
    curl_close ($ch);  
    
    $resp = array();

    $doc = new DOMDocument();
    $doc->loadHTML($response);

    $finder = new DomXPath($doc);
    $img = $finder->query("//meta[@name='twitter:image']")[0];
    $resp['img'] = $img->getAttribute('content');

    $title = $finder->query("//meta[@property='og:description']")[0];
    $resp['title'] = $title->getAttribute('content');

    if($id == "0" || $id == "random") {
        # hacky fix to make sure the id is correct if it's the first page    
        if(strpos($response, "987666")) {
            $id = 1;
        } else {
            $link_nodes = $finder->query("//a[@rel='prev']");
            $link = $link_nodes[0]->getAttribute('href');
            $link_parts = explode("/", $link);
            $id = (string)((int) ($link_parts[count($link_parts) - 1] + 1));
        }
    }
    
    $resp['id'] = $id;
    $resp['link'] = "http://tomanddave.cfw.me/comics/$id";
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
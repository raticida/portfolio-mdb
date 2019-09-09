<?php
header("Access-Control-Allow-Origin: *");
$url = 'https://exame.abril.com.br/mercados/feed/';
$xml = simplexml_load_file($url) or die("feed not loading");


$data = array();


foreach($xml->channel->item as $item) {
	
$device = array();

	foreach($item as $key => $value) {
		
		$device[(string)$key] = strip_tags((string)$value);
	
	}
     
$data[] = $device;

}
  
// Percorrer os dados pré-definidos
shuffle($data);

$count = 0;

foreach ($data as $item) {
	
	if ($count < 1) {
		
		if (!empty($item['description'])) {
			
			
			$value = $item['link'];
			
			$curl = curl_init();

			curl_setopt_array($curl, array(
			  CURLOPT_URL => "https://api-ssl.bitly.com/v4/shorten",
			  CURLOPT_RETURNTRANSFER => true,
			  CURLOPT_ENCODING => "",
			  CURLOPT_MAXREDIRS => 10,
			  CURLOPT_TIMEOUT => 30,
			  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			  CURLOPT_CUSTOMREQUEST => "POST",
			  CURLOPT_POSTFIELDS => "{\"long_url\": \"$value\"}",
			  CURLOPT_HTTPHEADER => array(
				"Authorization: Bearer 579d444101573d6ddb7e08d58b117f921d361661",
				"Content-Type: application/json",
				"cache-control: no-cache"
			  ),
			));

			$response = curl_exec($curl);
			$err = curl_error($curl);

			curl_close($curl);
			
			$json = @json_decode($response, true);
						

			$array = array(
				"title" => $item['title'],
				"description" => $item['description'], 
				"link" => $json['link'], 
				"pubDate" => $item['pubDate']
				);
		
		}
	
	$count++;
	
	}
	
}
 
// Definir tipo de resposta do script e charset de codificação

header("Content-Type: application/json; charset=utf-8");
 
// Imprimir JSON gerado
echo json_encode($array);



?>
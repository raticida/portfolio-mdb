<?php
header("Access-Control-Allow-Origin: *");
$url = 'https://www.google.com.br/async/finance_price_updates?ei=IWqPWvWJD8yEwgTzz5HoAg&yv=2&async=lang:en-US,country:br,rmids:%2Fm%2F04xjcr,_fmt:jspb'; //IBOVESPA
//$url = 'https://www.google.com.br/async/finance_price_updates?ei=RqGQWpm5HYL-wASnuY-IAw&yv=2&async=lang:pt-BR,country:br,rmids:%2Fm%2F02853rl,_fmt:jspb'; //NASDAQ

$content = implode('', file($url));//

//echo $content;

$stringCorrigida = str_replace(')]}\'', '', $content);

//echo $stringCorrigida;


header('Content-Type: application/json');
//echo $stringCorrigida;

$content = file_get_contents($url);
$json = json_decode($stringCorrigida, true);


$variavel = intval($json['PriceUpdates']['0']['0']['1']['7']);

if ($variavel > 0) {
	$variavel = 'positivo';
} else {
	$variavel = 'negativo';
}

$data = date_create_from_format('M d\, g:i A T', $json['PriceUpdates']['0']['0']['3']);

$nova_data = date_format($date,'d/m/Y \à\s G:i');

$resultado = new \stdClass();

$resultado->valor = $json['PriceUpdates']['0']['0']['1']['0'];
$resultado->indice = $json['PriceUpdates']['0']['0']['1']['1'] .' ('.$json['PriceUpdates']['0']['0']['1']['2'].')';
//$resultado->variacao = $json['PriceUpdates']['0']['0']['1']['2'];
//$resultado->codigo = $json['PriceUpdates']['0']['0']['2'];
$resultado->data = $nova_data;
$resultado->tipo_variacao = $variavel;

echo json_encode($resultado);

?>


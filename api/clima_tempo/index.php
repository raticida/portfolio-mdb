<?php
header("Access-Control-Allow-Origin: *");
$json = file_get_contents('http://apiadvisor.climatempo.com.br/api/v1/weather/locale/4312/current?token=502908cd4d778d9fd4e3b49629255a05');

$obj = json_decode($json);

$resultado = new \stdClass();
$resultado->success = false;

$resultado->cidade = $obj->name.' - '.$obj->state;
$resultado->temperatura = $obj->data->temperature.'°';
$resultado->icone = 'icones/'.$obj->data->icon.'.png';
$resultado->descricao = $obj->data->condition;
$resultado->sensacao = $obj->data->sensation.'°';
$resultado->umidade = $obj->data->humidity.'%';
$resultado->pressao = $obj->data->pressure.'hPa';
$resultado->vento = $obj->data->wind_velocity.'km/h';

$data_hora = explode(" ", $obj->data->date);

$resultado->hora = $data_hora[1];

echo json_encode($resultado);



?>
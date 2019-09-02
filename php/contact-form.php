<?php
/*
Name: 			Contact Form
Written by: 	Okler Themes - (http://www.okler.net)
Version: 		4.2.0
*/


//Load reCAPTCHA Library
require('autoload.php');

$siteKey = '6LcZKBcUAAAAAHpc9HmBNu0-qQbjZLCkRWWFSgaE';
$secret = '6LcZKBcUAAAAAB-zY7tasC6vsqXzRWYu_LdZsp2Y';

$recaptcha = new \ReCaptcha\ReCaptcha($secret);

session_cache_limiter('nocache');
header('Expires: ' . gmdate('r', 0));

header('Content-type: application/json');

// Step 1 - Enter your email address below.
$to = 'contato@canaltvon.com';

$emailsender='contato@canaltvon.com'; 

$subject = $_POST['subject'];


if(isset($_POST['email'])) {

	$name = $_POST['name'];
	$email = $_POST['email'];
	$gRecaptchaResponse = $_POST['recaptcha'];
	$remoteIp = $_SERVER['REMOTE_ADDR'];


	$fields = array(
		0 => array(
			'text' => 'Nome',
			'val' => $_POST['name']
		),
		1 => array(
			'text' => 'Endereço de E-mail',
			'val' => $_POST['email']
		),
		2 => array(
			'text' => 'Mensagem',
			'val' => $_POST['message']
		)
	);

	$message = "";

	foreach($fields as $field) {
		$message .= $field['text'].": " . htmlspecialchars($field['val'], ENT_QUOTES) . "<br>\n";
	}

	$resp = $recaptcha->verify($gRecaptchaResponse, $remoteIp);
	
	if ($resp->isSuccess()) {
		
		// verified!
		$headers = '';
		$headers .= 'From: ' . $name . ' <' . $email . '>' . "\r\n";
		$headers .= "Reply-To: " .  $email . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

		if (mail($to, $subject, $message, $headers,"-r".$emailsender)){
			$arrResult = array ('response'=>'success');
		} else{
			$arrResult = array ('response'=>'error');
		}
		
		echo json_encode($arrResult);
		
	} else {
		//$errors = $resp->getErrorCodes();
		$arrResult = array ('response'=>'error');
		echo json_encode($arrResult);
		
	}

} else {

	$arrResult = array ('response'=>'error');
	echo json_encode($arrResult);

}
?>

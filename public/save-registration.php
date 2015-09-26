<!DOCTYPE html>
<html>

<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<title>Saving Registration</title>
</head>

<body>
<?php
//store the form inputs in variables
$username = $_POST['username'];
$password = $_POST['password'];
$confirm = $_POST['confirm'];
$ok = true;

//recaptcha check
$secret = "6LcPmgQTAAAAAD2XQXfomdwCcyxkQ-x7mJLoGQqz";
$response = $_POST['g-recaptcha-response'];

//call the recaptcha api
$url = 'https://www.google.com/recaptcha/api/siteverify';

//add the 2 values to include in the post to the google api
$post_data = array();
$post_data['secret'] = $secret;
$post_data['response'] = $response;

//initialize the request to the remote url
$ch = curl_init();

//add the options to the url request
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);

//execute the post request and get a result back from Google
$result = curl_exec($ch);
curl_close($ch);

//evaluate the result
//echo $result;

//decode the result that's in json format
$obj = json_decode($result, true);

if ($obj['success'] == false) {
	$ok = false;
	echo 'Please confirm you\'re a human!<br />';
}

//print_r($obj);

//var_dump($obj);
//echo $obj->success;


//input validation
if (empty($username)) {
	echo 'Username is required<br />';
	$ok = false;
}

if (empty($password)) {
	echo 'Password is required<br />';
	$ok = false;
}

if ($password != $confirm) {
	echo 'Passwords must match<br />';
	$ok = false;
}

if ($ok) {
	//hash the password
	$password = hash('sha512', $password);
	
	//connect
	require_once('db.php');
		
	//insert
	$sql = "INSERT INTO users (username, password) VALUES (:username, :password)";
	$cmd = $conn->prepare($sql);
	$cmd->bindParam(':username', $username, PDO::PARAM_STR, 50);
	$cmd->bindParam(':password', $password, PDO::PARAM_STR, 128);
	$cmd->execute();
	
	//disconnect
	$conn = null;
	
	//show a message or give login link
	echo 'Your Registration was saved. Click <a href="login.php">here</a> to log in.';
}
?>
</body>

</html>

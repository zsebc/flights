<?php
header('Access-Control-Allow-Origin: *');
if (isset($_POST['username']) && $_POST['username'] && isset($_POST['password']) && $_POST['password']) {
    $username = $_POST['username'];
	$password = $_POST['password'];
	
	$dbhost = "localhost";
    $dbname = "wsb_flightsb";
    $dbuser = "wsb_flightsu";
    $dbpassword = "c-aN#70-OpZ)al7f";
    $db_conn = new PDO("mysql:host=" . $dbhost . ";dbname=" . $dbname, $dbuser, $dbpassword);
    $res = $db_conn->query("SELECT * FROM users WHERE username = '$username' AND password = MD5('$password')");
    $data = $res->fetch(PDO::FETCH_ASSOC);
    if (isset($data) && $data)
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
	else
		echo "error";
}
else
	echo "error";
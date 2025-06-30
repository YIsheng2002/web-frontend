<?php
 $server = 'localhost';
 $username = 'root';
 $password = '';
 $db = 'order_management_system';


 try{
    //
    $conn = new PDO("mysql:host=$server;dbname=$db", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
 }
 catch(PDOException $e){
    // If there is an error, display it
    echo "Connection failed: " . $e->getMessage();
 }

?>
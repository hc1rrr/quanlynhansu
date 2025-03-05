<?php
    $servername="localhost";
    $username= "root";
    $password= "";
    $db="quanlynhansu";
    $conn = new mysqli($servername,$username,$password,$db);
    if ($conn->connect_error){
        die("connection failded :" .$conn->connect_error);
    }
?>
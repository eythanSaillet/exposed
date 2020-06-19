<?php

// Errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ini_set('max_execution_time', 300);
// ini_set('memory_limit', '256M');
// set_time_limit(300);

$pdo = new PDO('mysql:host=localhost;dbname=exposed;port=8888', 'root', 'root');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

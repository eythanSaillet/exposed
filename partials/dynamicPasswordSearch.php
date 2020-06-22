<?php

include '../config/config.php';

$index = '';
$search = '';

if ($_GET) {
    $index = $_GET['index'];
    $search = $_GET['search'];
}

$query = $pdo->query('SELECT password FROM combos WHERE password LIKE "%'.$search.'%" LIMIT 100 OFFSET '.$index * 2);

$data = $query->fetchAll();

echo $index;
echo ' & ';
echo $search;

$test = json_encode($data);

echo $test;
<?php

include '../config/config.php';

$search = $_GET['search'];

// Contains
// Count
$containsCountQuery = $pdo->query('SELECT COUNT(password) FROM combos WHERE password LIKE "%'.$search.'%"');
$containsCountData = $containsCountQuery->fetch();
// First 100
$containsQuery = $pdo->query('SELECT DISTINCT password FROM combos WHERE password LIKE "%'.$search.'%" and password NOT LIKE "'.$search.'" LIMIT 51');
$containsData = $containsQuery->fetchAll();

// Equal
// Count
$equalCountQuery = $pdo->query('SELECT COUNT(password) FROM combos WHERE password LIKE "'.$search.'"');
$equalCountData = $equalCountQuery->fetch();

$data = new stdClass();
$data->containsCount = $containsCountData;
$data->equalCount = $equalCountData;
$data->containsPasswords = $containsData;

$response = json_encode($data);

echo $response;
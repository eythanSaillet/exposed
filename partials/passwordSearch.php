<?php

include '../config/config.php';

$search = $_GET['search'];

$query = $pdo->query('SELECT password FROM combos WHERE password LIKE "%'.$search.'%"');

$data = $query->fetchAll();

$reponse = json_encode($data);

echo $reponse;
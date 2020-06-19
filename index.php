<?php

include 'partials/header.php';

include 'config/config.php';

?>
<div class="main">
	<div class="grid"></div>
</div>
<?php

// DB JSON INSERT

// $string = file_get_contents("sdqsdq.json");

// $json = json_decode($string);

// foreach ($json as $val) {
// 	$prepare = $pdo->prepare('
// 	INSERT INTO sdqsdq (length, number)
// 	VALUES (:length, :number)');

// 	$prepare->execute(array(':length' => (int) $val[0], ':number' => $val[1]));
// }

// DB JSON INSERT

include 'partials/footer.php';
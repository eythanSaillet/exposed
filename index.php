<?php

include 'partials/header.php';

include 'config/config.php';

?>
<div class="main">
	<div class="grid"></div>

	<!-- Password response -->
	<div class="babyOverlay searchInfoBabyOverlay passwordResponseBabyOverlay">
		<div class="textContainer">
			<p class="text">
				Your password is like a big and nasty shit. We advise you to change it son of crs !
			</p>
		</div>
		<div class="strengthContainer">
			<div class="strength">
				<p class="label">STRENGTH</p>
				<div class="barContainer">
					<div class="bar"></div>
					<span class="number">0%</span>
				</div>
			</div>
		</div>
	</div>
	<!-- Errors display -->
	<div class="babyOverlay searchInfoBabyOverlay errorsDisplayBabyOverlay">
		<div class="textContainer">
			<p class="text">
				Look what append when we fix the error :) A amazing new password appeared ! nananan il est super bo trop stylé olala je meurs trop rhalou
			</p>
		</div>
		<div class="strengthContainer">
			<div class="strength oldStrength">
				<p class="oldPassword">Password</p>
				<div class="barContainer">
					<div class="bar"></div>
					<span class="number">0%</span>
				</div>
			</div>
			<div class="strength newStrength">
				<p class="newPassword">Password</p>
				<div class="barContainer">
					<div class="bar"></div>
					<span class="number">0%</span>
				</div>
			</div>
		</div>
	</div>
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
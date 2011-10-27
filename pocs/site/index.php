<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>game</title>
	<link rel="stylesheet" href="site.css" />
</head>
<body>
	<h1>Shockwave Studios</h1>
	welcome<?php
		if($_REQUEST['un']){
			echo ', '.$_REQUEST['un'];
		}
	?>
	!<br />
	<a href="create.php">create an account</a><br />
	<a href="game.php?<?php if($_REQUEST['un']){echo 'un='.$_REQUEST['un'];} ?>">go to the game</a>
</body>
</html>

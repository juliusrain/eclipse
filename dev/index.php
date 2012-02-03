<html>
	<head>
		<title>GAME</title>
		<noscript>
			<meta http-equiv="refresh" content="0; url=nojs.html" />
		</noscript>
		<link rel="stylesheet" href="waldo.css" />
		<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
		<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>
	</head>
	<body>
		<div id="banner">LOGO/BANNER UP HERE</div>
		<div id="tabs">
			<ul>
				<li><a href="#tabs-welcome">Welcome</a></li>
				<li><a href="#tabs-story">Story</a></li>
				<li><a href="#tabs-screenshots">Screenshots</a></li>
				<li><a href="#tabs-register">Register</a></li>
			</ul>
		<div id="tabs-welcome" class="tabbox">
			<h2>Welcome</h2>
			<p>Friends lost in hostile territory, and it's up to you to rescue them. Play the action-packed game that has you fighting off aliens, finding clues, and turning the tides of a war!</p>
			<div id="playnowbutton">PLAY NOW!</div>
		</div>
		<div id="tabs-story" class="tabbox">
			<h2>Story</h2>
			<p>Same ship, different day.</p>
			<p>Current faster-than-light travel allows inter-planetary voyages by means of an interdimentional drive, or "IDD". With an IDD, a ship can jump from one solar system to another instantaneously. With all of its virtues, contemporary IDD technology has a limited range and accuracy. Scientists have been researching to develop a special new engine that far exceeds anything now available. Two days ago, a prototype was tested at a secret facility in the &lt;insert name&gt; sector. The new drive performed far better than anyone involved predicted. Unfortunately, the test ship is now lost in a distant sector of space. This sector is inhabited by &lt;insert alien race/empire&gt;, who would love to get their hands on this technology. The test ship has minimal defenses. What's more, it was only equipped for a four-hour mission, with emergency supplies lasting 72 hours. It is assumed that they searched for an inhabitable planet to set down and hide. Your ship has been ordered to the &lt;insert name&gt; outpost on the outer edge of our territory, neighbouring that sector. Your mission is to find them, and escort them back to safety.</p>
		</div>
		<div id="tabs-screenshots" class="tabbox">
			<h2>Screenshots</h2>
			<div id="screenshots">
				<img src="screenshot01.png" /><br /><br />
				<img src="screenshot02.png" /><br />
			</div>
		</div>
		<div id="tabs-register" class="tabbox">
			<h2>Register</h2>
			<form method="POST" action="">
				<div class="regbox"><div class="reglabel">your email</div> <div class="regfield"><input type="email" name="email" required /></div></div>
				<div class="regbox"><div class="reglabel">new username</div> <div class="regfield"><input type="text" name="uname" required /></div></div>
				<div class="regbox"><div class="reglabel">new password</div> <div class="regfield"><input type="password" name="password1" required /></div></div>
				<div class="regbox"><div class="reglabel">re-type password</div> <div class="regfield"><input type="password" name="password2" required /></div></div>
				<br style="clear:both;" />
				<input type="submit" name="submit" value="Submit" />
			</form>
		</div>
		</div>
		<div id="pagefooter">
			2011-2012 &copy; Shockwave Studios in collaboration with 361Games, MU
		</div>
		<script>
			$(function() {
				$( "#tabs" ).tabs({
					event: "mouseover"
				});
				$("#playnowbutton").click(function (){
					$("#tabs").tabs("select", "#tabs-register");
				});
			});
		</script>
	</body>
</html>

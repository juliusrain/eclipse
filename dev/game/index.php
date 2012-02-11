<html>
<head>
	<meta charset="UTF-8">
	<title>GAME</title>
	<style type="text/css">
		* {
			margin:0px;
		}
		body {
			margin:0px;
			padding:0px;
		}
		#top {
			background-color:orange;
			padding:5px 0px;
			width:990px;
			height:20px;
			position:absolute;
			left:10px;
			top:10px;
			overflow:hidden;
		}
		#left {
			width:200px;
			background-color:lightgreen;
			position:absolute;
			left:10px;
			top:39px;
			overflow:hidden;
		}
		#lefttop {
			height:225px;
		}
		#middle {
			width:601px;
			background-color:#FFF;
			position:absolute;
			left:210px;
			top:39px;
			background-color:lightblue;
			overflow:hidden;
		}
		#maindiv {
			width:100%;
			height:100%;
		}
		#right {
			width:200px;
			height:400px;
			background-color:pink;
			position:absolute;
			left:810px;
			top:39px;
			overflow:hidden;
		}
		#righttop {
			height:375px;
			overflow:auto;
		}
		#bottom {
			clear:both;
			padding:5px 0px;
			width:990px;
			background-color:orange;
			position:absolute;
			left:10px;
			top:439px;
			overflow:hidden;
		}
		#test {
			background-color:brown;
			width:90%;
			padding:5%;
		}
		#minibox {
			background-color:blue;
			width:90%;
			padding:0px;
			margin:0px;
			position:absolute;
		}
	</style>
</head>
<body>
	<div id="head"></div>
	<div id="container">
		<div id="top">top</div>
		<div id="left">
			left
			<div id="test">testing</div>
			<div id="minibox"><canvas id="minimap"></canvas></div>
		</div>
		<div id="middle"><div id="maindiv"></div></div>
		<div id="right">right</div>
		<div id="bottom">bottom</div>
	</div>
	<div id="foot"></div>
	<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
	<script type="text/javascript" src="build/Three.js"></script>
	<script type="text/javascript" src="js/Detector.js"></script>
	<script type="text/javascript" src="js/Stats.js"></script>
	<script type="text/javascript" src="graphics.js"></script>
	<script type="text/javascript" src="frame.js"></script>
	<script type="text/javascript" src="game.js"></script>
	<script type="text/javascript">
		//alert('hey');
	</script>
</body>
</html>

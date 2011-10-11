<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>Game</title>
	<link rel="stylesheet" href="site.css" />
	<style type="text/css">
		body {
			background-color:lightblue;
		}
		canvas {
			background-color:#000;
		}
		#top {
			background-color:orange;
			padding:5px;
			width:990px;
			position:absolute;
			left:10px;
			top:10px;
		}
		#left {
			width:200px;
			background-color:lightgreen;
			position:absolute;
			left:10px;
			top:39px;
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
		}
		#right {
			width:200px;
			height:400px;
			background-color:pink;
			position:absolute;
			left:810px;
			top:39px;
		}
		#righttop {
			height:375px;
			overflow:auto;
		}
		#bottom {
			clear:both;
			padding:5px;
			width:990px;
			background-color:orange;
			position:absolute;
			left:10px;
			top:439px;;
		}
	</style>
</head>
<body>
	<div id="top">
		status updates status updates status updates status updates status updates status updates status updates 
	</div>
	<div id="left">
		<div id="lefttop">
			menus<br />leaderboard<br />menus<br />leaderboard<br />menus<br />leaderboard<br />menus<br />leaderboard<br />
		</div>
		<canvas id="minimap" width="190px" height="175px"></canvas>
	</div>
	<div id="middle">
		<canvas id="main" width="600" height="400"></canvas>
	</div>
	<div id="right">
		<div id="righttop">
		</div>
		<input type="text" id="chat" />
	</div>
	<div id="bottom">
		controls controls controls controls controls controls controls controls controls controls controls
	</div>
	<!--<div id="comments">
		comments<br />
		comments<br />
		comments<br />
		comments<br />
		comments<br />
		comments<br />
	</div>
	<a href=".">back to home</a>-->
	<script type="text/javascript">
		var canvas = document.getElementById('main');
		var ctx = canvas.getContext('2d');
		var CW = 600, CH = 400;
		ctx.fillStyle = '#fff';
		ctx.fillText('hey', 300, 200);
		function newX(oldX, oldY){
			
		}
		function generate() {
			var i, stars = [], range = 300;
			for(i = 0; i < 100; i++){
				stars.push({
					x:(Math.random()*(CW+range)) - ((CW+range)/2),
					y:(Math.random()*(CH+range)) - ((CH+range)/2)
				});
			}
			return (function (){
				canvas.width = canvas.width;
				ctx.fillStyle = '#fff';
				ctx.save();
				ctx.translate(CW/2, CH/2);
				for(i in stars){
					ctx.fillRect(stars[i].x, stars[i].y, 2, 2);
					stars[i].x *= 1.02;
					stars[i].y *= 1.02;
					/*if(i==0){
						console.log(stars[i].x+":"+stars[i].y);
					}*/
					if(stars[i].x > (CW/2)+range || stars[i].x < -(CW/2)-range){// || stars[i].y > (CH/2)+range || stars[i].y < -(CH/2)-range){
						stars[i].x = (Math.random()*(CW/3)) - (CW/6);
						stars[i].y = (Math.random()*(CH/3)) - (CH/6);
					}
				}
				ctx.restore();
			});
		}
		var canvast = setInterval(generate(), 40);
	</script>
	<script type="text/javascript">
		var mm = document.getElementById('minimap');
		var minimap = mm.getContext('2d');
		var MMW = 190, MMH = 175;
		minimap.fillStyle = '#fff';
		minimap.fillText('hey', 75, 50);
		function gen() {
			var i, stars = [];
			for(i=0;i<50;i++){
				stars.push({
					x:Math.random()*MMW,
					y:Math.random()*MMH
				});
			}
			return (function (){
				mm.width = mm.width;
				minimap.fillStyle = '#fff';
				for(i in stars){
					minimap.fillRect(stars[i].x, stars[i].y, 1, 1);
					stars[i].y++;
					if(stars[i].y > MMH){
						stars[i].y = -4;
						stars[i].x = Math.random()*MMW;
					}
				}
			});
		}
		var mmt = setInterval(gen(), 40);
		
		//chat box
		var chatter = document.getElementById('chat');
		var chattee = document.getElementById('righttop');
		chatter.onkeypress = function (e){
			if(e.keyCode === 13 && chatter.value){
				chattee.innerHTML += chatter.value + '<br />';
				chatter.value = '';
				chattee.scrollByLines(10);
			}
		};
	</script>
</body>
</html>
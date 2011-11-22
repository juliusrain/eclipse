// The Primary Game Object
function Game() {
	var cnvs = document.getElementById('maincanvas');
	var ctx = cnvs.getContext('2d');
	var player = Player(ctx);
	setInterval(function () {
		cnvs.width = cnvs.width;
		player.draw();
	}, 60);
	var ui = UI(cnvs, window);
}


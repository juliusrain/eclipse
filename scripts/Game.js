// The Primary Game Object
function Game() {
	// get canvas elements and contexts
	var cnvs = document.getElementById('maincanvas');
	var ctx = cnvs.getContext('2d');
	var minmap = document.getElementById('minimap');
	var map = minmap.getContext('2d');
	var player = Player(ctx);
	
	/*setInterval(function () {
		cnvs.width = cnvs.width;
		player.draw();
	}, 60);*/
	var ui = UI({obj:cnvs, func:clickOnMain}, {obj:minmap, func:clickOnMinimap});

	// what to do when
	
	function clickOnMain(x, y) {
		console.log('click on main map, relative coords:');
		console.log(x+"x"+y);
	
	}
	
	function clickOnMinimap(x, y) {
		console.log('click on minimap, relative coords:');
		console.log(x+"x"+y);
		
	}
}
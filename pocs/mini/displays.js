/*
	needed:
		- design more sophisticated HUD
		- add visible/invisible option for map
		- add zooming feature for map
		- begin implementing mouse inputs
*/
function Map(space) {
	this.space = space;
	this.scale = 0.1;
}
Map.prototype.mapLocation = function (x, y) {
	//calculate position on map relative to player (and scaled down)
	var nx = (x - this.space.pl.x) * this.scale,
		ny = (y - this.space.pl.y) * this.scale;
	return {x:nx, y:ny};
};
Map.prototype.draw = function () {
	//draw each item's "blip" at the correct location
	var i, tempLoc;
	//planets
	for(i in this.space.planets){
		tempLoc = this.mapLocation(this.space.planets[i].x, this.space.planets[i].y);
		this.space.planets[i].blip(tempLoc.x, tempLoc.y);
	}
};

function HUD() {
	this.mode = "";
}
HUD.prototype.draw = function () {
	ctx.save();
	ctx.fillStyle = '#fff';
	ctx.fillText("x: "+Math.floor(space.pl.x),10,20);
	ctx.fillText("y: "+Math.floor(space.pl.y),10,30);
	ctx.fillText("vel: "+space.pl.vel,10,40);
	ctx.restore();
}


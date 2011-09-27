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
	this.drawStats();
	if(space.pl.propulsionMode == 'short'){
		this.drawMediumJumpButton();
	}
	else if(space.pl.propulsionMode == 'medium'){
		this.drawMediumJumpButton(true);
		this.drawMediumJumpTarget();
	}
};
HUD.prototype.drawStats = function () {
	ctx.save();
	ctx.fillStyle = '#fff';
	ctx.fillText("x: "+Math.floor(space.pl.x),10,20);
	ctx.fillText("y: "+Math.floor(space.pl.y),10,30);
	ctx.fillText("vel: "+space.pl.vel,10,40);
	ctx.restore();
};
HUD.prototype.drawMediumJumpButton = function (cancel) {
	var mjl = ctx.measureText('MEDIUM JUMP').width,
		toExecute;
	if(cancel){
		mjl = ctx.measureText('CANCEL').width;
	}
	
	if(!interactions.mediumJumpActivate){
		interactions.mediumJumpActivate = {
			inside: insideRect(10, CH - 50, mjl + 30, CH - 15)
		};
	}
	if(cancel){
		interactions.mediumJumpActivate.execute = function () {
			space.pl.propulsionMode = 'short';
			delete interactions2.mediumJump;
			console.log('cancel');
		};
	}
	else{
		interactions.mediumJumpActivate.execute = function () {
			space.pl.propulsionMode = 'medium';
			delete interactions.mediumJumpActivate;
		};
	}
	
	ctx.save();
	if(cancel){
		ctx.fillStyle = '#0a0';
	}
	else{
		ctx.fillStyle = '#0a0';
	}
	ctx.fillRect(10, CH - 50, mjl + 20, 35);
	ctx.fillStyle = '#fff';
	if(cancel){
		ctx.fillText("CANCEL", 20, CH - 30);
	}
	else{
		ctx.fillText("MEDIUM JUMP", 20, CH - 30);
	}
	ctx.restore();
};
HUD.prototype.drawMediumJumpTarget = function () {
	var maxrange = space.pl.mediumMax,
		Dx = mouser.x - HCW,
		Dy = mouser.y - HCH,
		d = dist(mouser.x, mouser.y, HCW, HCH),
		angle = Dx >= 0 ? Math.atan(Dy / Dx) : Math.atan(Dy / Dx) + Math.PI;
	d = d > maxrange ? maxrange : d;
	
	if(!interactions2.mediumJump){
		interactions2.mediumJump = {
			inside: insideRect(0, 0, CW, CH)
		};
	}
	interactions2.mediumJump.execute = function () {
		space.pl.mediumJump(angle, d);
	};
	
	ctx.save();
	ctx.beginPath();
	ctx.translate(HCW, HCH);
	ctx.rotate(angle);
	ctx.moveTo(0, 0);
	ctx.lineTo(d * 1.5, -d/space.pl.mediumAccuracy);
	ctx.lineTo(d * 1.5, d/space.pl.mediumAccuracy);
	ctx.closePath();
	ctx.fillStyle = 'rgba(255,255,255,0.5)';
	ctx.fill();
	ctx.restore();
};


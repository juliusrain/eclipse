/*
	needed:
		- create parent "Immovable" class (and possibly find a better name)
		- create "Station" class (for friendly or enemy)
		- create moons? (child class to Planet)
*/
function Planet(x, y, size) {
	this.x = x;
	this.y = y;
	this.size = size;
}
Planet.prototype.draw = function (dx, dy) {
	ctx.save();
	ctx.translate(HCW-dx, HCH-dy);
	
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
	ctx.strokeStyle = '#fff';
	ctx.stroke();
	ctx.fillStyle = '#800';
	ctx.fill();
	
	ctx.restore();
};
Planet.prototype.blip = function (x, y) {
	ctx.save();
	ctx.translate(HCW, HCH);
	
	ctx.beginPath();
	ctx.arc(x, y, this.size * 0.025, 0, 2 * Math.PI, false);
	ctx.strokeStyle = '#00f';
	ctx.stroke();
	
	ctx.restore();
};
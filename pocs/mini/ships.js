/*
	needed:
		- create parent "Ship" class,
			capable of supporting AI and user-controlled ships
		- convert to private variables (to prevent cheating)
		- create medium-range IDD
		- create "autopilot"
*/
function Player() {
	this.x = 0;
	this.y = 0;
	this.vel = 0;
	this.orientation = 0;
	this.maxspeed = 10;
	this.speedincr = 1;
}
Player.prototype.cycle = function () {
	this.draw();
	this.updateLocation();
}
Player.prototype.draw = function () {
	ctx.save();
	ctx.fillStyle = '#fff';
	
	ctx.translate(HCW, HCH);
	ctx.rotate(this.orientation);
	
	ctx.beginPath();
	ctx.moveTo(-10, -5);
	ctx.lineTo(-10, 5);
	ctx.lineTo(10, 0);
	ctx.closePath();
	ctx.fillStyle = '#00f';
	ctx.fill();
	ctx.strokeStyle = '#fff';
	ctx.stroke();
	
	if(this.vel){
		//ctx.fillRect(-10,-5, -10,10);
		var farback = -(10+this.vel*1.5);
		ctx.beginPath();
		ctx.moveTo(-10,-3 + rando(-1,1));
		ctx.lineTo(farback + rando(0,2),-5 + rando(-1,1));
		ctx.lineTo(farback + rando(0,2),0 + rando(-1,1));
		ctx.fillStyle = 'orange';
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(-10,3 + rando(-1,1));
		ctx.lineTo(farback + rando(0,2),5 + rando(-1,1));
		ctx.lineTo(farback + rando(0,2),0 + rando(-1,1));
		ctx.fill();
	}
	
	ctx.restore();
}
Player.prototype.setOrientation = function (dir) {
	var amt = Math.PI/(18 + (this.vel * 6));
	if(dir > 0){
		this.orientation += amt;
		if(this.orientation > Math.PI * 2){
			this.orientation = 0;
		}
	}
	else{
		this.orientation -= amt;
		if(this.orientation < 0){
			this.orientation = Math.PI * 2;
		}
	}
};
Player.prototype.adjustVelocity = function (up) {
	if(up){
		if(this.vel < this.maxspeed){
			this.vel += this.speedincr;
		}
	}
	else{
		if(this.vel > 0){
			this.vel -= this.speedincr;
		}
	}
}
Player.prototype.updateLocation = function () {
	//update position
	this.x += this.vel * Math.cos(this.orientation);
	this.y += this.vel * Math.sin(this.orientation);
};
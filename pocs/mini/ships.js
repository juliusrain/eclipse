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
	this.propulsionMode = 'short';
	this.mediumAccuracy = 5;
	this.mediumMax = 200;
	this.mediumRange = 20;
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
	ctx.lineWidth = 1.1;
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
	//change direction of ship based on user input
	//any positive number rotates clockwise; anything else rotates counterclockwise
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
	//change speed based on user input
	//any positive number increases speed, anything else decreases speed
	if(up > 0){
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
	//update position based on current speed
	this.x += this.vel * Math.cos(this.orientation);
	this.y += this.vel * Math.sin(this.orientation);
};
Player.prototype.mediumJump = function (orientation, range) {
	var range = range <= this.mediumMax ? range : this.mediumMax,
		destX = (this.x + 15*range*Math.cos(orientation)),
		destY = (this.y + 15*range*Math.sin(orientation));
	
	//jump
	this.x = destX + Math.random() * range/this.mediumAccuracy - range/(2*this.mediumAccuracy);
	this.y = destY + Math.random() * range/this.mediumAccuracy - range/(2*this.mediumAccuracy);
	this.orientation = Math.random() * 2 * Math.PI;
	
	//reset stars
	this.parent.ministars = this.parent.generateMinistars();
	
	//cleanup
	this.propulsionMode = 'short';
	delete interactions.mediumJumpActivate;
	delete interactions2.mediumJump;
};
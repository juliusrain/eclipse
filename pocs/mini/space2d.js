function Space() {
	this.landmarks = [];
	this.pl = new Player();
	this.pl.parent = this;
	this.planets = [];
	this.planets.push(new Planet(1300, 1900, 150));
	this.planets.push(new Planet(-500, -1570, 175));
	this.planets.push(new Planet(709, -170, 90));
}
Space.prototype.cycle = function () {
	var i;
	this.draw();
	for(i in this.planets){
		this.planets[i].draw(this.pl.x, this.pl.y);
	}
	this.pl.cycle();
	if(this.pl.vel){
		this.ministars.update(this.pl.orientation, this.pl.vel);
	}
}
Space.prototype.draw = function () {
	ctx.fillRect(0,0,CW,CH);
	this.ministars.draw();
}
Space.prototype.ministars = (function () {
	var i, j, stars = [[],[],[],[]], quants = [10, 20, 20, 40];
	function generate() {
		return {
			x:Math.random() * (CW + EDGES * 2) - EDGES,
			y:Math.random() * (CH + EDGES * 2) - EDGES
		};
	}
	//fastest to slowest
	for(i in stars){
		for(j = 0; j < quants[i]; j++){
			stars[i].push(generate());
		}
	}
	function change(star, dx, dy, amt) {
		star.x -= dx * amt;
		star.y -= dy * amt;
		if(star.x < -EDGES){
			star.x = CW + EDGES;
			star.y = Math.random() * (CH + EDGES * 2) - EDGES;
		}
		else if(star.x > CW + EDGES){
			star.x = -EDGES;
			star.y = Math.random() * (CH + EDGES * 2) - EDGES;
		}
		if(star.y < -EDGES){
			star.x = Math.random() * (CW + EDGES * 2) - EDGES;
			star.y = CH + EDGES;
		}
		else if(star.y > CH + EDGES){
			star.x = Math.random() * (CW + EDGES * 2) - EDGES;
			star.y = -EDGES;
		}
	}
	return {
		update: function (direction, speed) {
			var dx = Math.cos(direction);
			var dy = Math.sin(direction);
			for(i in stars){
				for(j in stars[i]){
					change(stars[i][j], dx, dy, speed/(i+2));
				}
			}
		},
		draw: function () {
			ctx.save();
			ctx.fillStyle = '#fff';
			for(i in stars){
				for(j in stars[i]){
					ctx.fillRect(stars[i][j].x, stars[i][j].y, 2, 2);
				}
			}
			ctx.restore();
		}
	};
}());

// user interactions class

function UI() {
	// Mouse Events
	// 	Attaches an event listener to each argument object.
	// 	Each event listener captures the location of the click and executes the given function.
	for(var i in arguments){
		console.log("UI for: "+arguments[i].obj);
		// argument must be defined, must contain an object and a function
		if(typeof arguments[i] != "undefined" && typeof arguments[i].obj == "object" && typeof arguments[i].func == "function"){
			// generate and attach event listener
			arguments[i].obj.onclick = function (fn) {
				return (function (e) {
					var ox = typeof this.offsetLeft == "undefined" ? 0 : this.offsetLeft,
						oy = typeof this.offsetTop == "undefined" ? 0 : this.offsetTop,
						x = e.pageX - ox,
						y = e.pageY - oy;
					fn(x, y);
				});
			}(arguments[i].func);
		}
	}
	
	// Keyboard Events
	window.onkeypress = function (e){
		console.log("key!");
		console.log(e);
		/*console.log("keyCode "+e.keyCode);
		console.log("charCode "+e.charCode);
		console.log("which "+e.which);*/
	}
	
	console.log('UI suite loaded.');
}
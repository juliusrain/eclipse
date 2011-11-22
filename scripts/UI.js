// user interactions class

function UI() {
	for(var i in arguments){
		console.log(arguments[i]);
		arguments[i].onclick = function (e) {
			console.log(this);
			console.log(e);
			console.log("page: "+e.pageX+"x"+e.pageY);
			return false;
		};
	}
	console.log('UI class loaded.');
}
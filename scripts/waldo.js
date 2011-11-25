var Waldo = {
	// Chooser
	// choose between a value that is defined, or a default value
	ch: function (defined, def) {
		if(typeof defined == "undefined"){
			return def;
		}
		else{
			return defined;
		}
	}
}
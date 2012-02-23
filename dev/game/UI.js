
// window resize events
$(window).load(sizeGame);
$(window).resize(sizeGame);

// click events
$('#jumpmapcontrol').click(toggleJumpMap);
$('#mouselockcontrol').click(toggleCursor);

// keyboard events
$(window).keypress(function (e){
    //console.log(e);
    switch(e.keyCode){
        // j = toggle jump map
        case 106: {
            toggleJumpMap();
            break;
        }
        // l = bind/unbind cursor
        case 108: {
            toggleCursor();
            break;
        }
		// space = fire weapon
		case 32: {
			gameEngine.fireWeapon();
			break;
		}
    }
});

$('#chatcompose').keydown(function (e){

    $('#chatcompose').val($('#chatcompose').val() + String.fromCharCode(e.keyCode));
    return false;
});

function toggleJumpMap() {
    if($('#jumpmapbox:visible').length){
        $('#jumpmapbox').hide();
        graphicsEngine.toggleCursor(false);
    } else{
        $('#jumpmapbox').show();
        graphicsEngine.toggleCursor(true);
    }
}

function toggleCursor() {
    graphicsEngine.toggleCursor();
}


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
        // t = auto repair
        case 116:{
            toggleAutoRepair();
            break;
        }
        // c = chat box
        case 99: {
            switchToChat();
            break;
        }
        //create explosion (for testing) p
        case 112: {
            graphicsEngine.addExplosionLarge(50, 0, -100);
            sceneElements.AIShips[0].fireLaser();
            break;
        }
    }
});

$('#chatcompose').keydown(function (e){

    $('#chatcompose').val($('#chatcompose').val() + String.fromCharCode(e.keyCode));
    return false;
});

function toggleJumpMap() {
    // hide jump map
    if($('#jumpmapbox:visible').length){
        $('#jumpmapbox').hide();
        graphicsEngine.toggleCursor(false);
        $('#jumpmapcontrol').removeClass('on');
    } else { // show jump map
        $('#jumpmapbox').show();
        graphicsEngine.toggleCursor(true);
        $('#jumpmapcontrol').addClass('on');
    }
}

function toggleAutoRepair() {
    if($('#autorepaircontrol').hasClass("on")){
        // auto repair is now off, turn it on
        gameEngine.autorepair = true;
        $('#autorepaircontrol').removeClass('on');
    } else{
        // auto repair is now on, turn it off
    gameEngine.autorepair = false;
        $('#autorepaircontrol').addClass('on');
    }
}

function toggleCursor() {
    graphicsEngine.toggleCursor();
	if($('#mouselockcontrol').hasClass("on")){
		$('#mouselockcontrol').removeClass('on');
		$('body').css('cursor', 'none');
	}
	else{
		$('#mouselockcontrol').addClass('on');
		$('body').css('cursor', 'auto');
	}
}

function switchToChat() {

}

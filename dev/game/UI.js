
var chatfocus = false;

// window resize events
$(window).load(sizeGame);
$(window).resize(sizeGame);

// click events
$('#jumpmapcontrol').click(toggleJumpMap);
$('#mouselockcontrol').click(toggleCursor);
$('#chatcontrol').click(switchToChat);
$('#chatcompose').focus(function (){
	console.log('true');
	$('#chatcontrol span').html('Esc');
	chatfocus = true;
});
$('#chatcompose').blur(function (){
	console.log('false');
	$('#chatcontrol span').html('C');
	chatfocus = false;
});

// keyboard events
$(window).keypress(function (e){
    //console.log(e);
    e.stopImmediatePropagation();
    switch(e.keyCode){
        // j = toggle jump map
        case 106: {
            if (!chatfocus) {
                toggleJumpMap();
            }
            break;
        }
        // l = bind/unbind cursor
        case 108: {
            if(!$('#jumpamapbox:visible').length && !chatfocus) {
                toggleCursor();
            } 
            break;
        }
        // space = fire weapon
        case 32: {
            if (!chatfocus) {
                gameEngine.fireWeapon();
            }
            break;
        }
        // t = auto repair
        case 116:{
            if (!chatfocus) {
                toggleAutoRepair();
            }
            break;
        }
        // c = chat box
        case 99: {
            if (!chatfocus) {
                switchToChat();
            }
            break;
        }
        case 111: {
            sceneElements.AIShips[0].fireLaser();
            break;
        }
        //create explosion (for testing) p
        case 112: {
            if (!chatfocus) {
                graphicsEngine.addExplosionLarge(50, 0, -100);
                sceneElements.AIShips[0].fireLaser();
            }
            graphicsEngine.addExplosionLarge(50, 0, -100);
            break;
        }
    }
});

$('#chatcompose').keydown(function (e){
    console.log(e);
    e.stopImmediatePropagation();
    var chatbox=$("#chatcompose");
    if (e.which == 27) {
        $('#chatcompose').blur();
    }
    else if (e.which == 13) {
        console.log("you pressed enter");
        newMessage(chatbox.val());
        chatbox.val("");
    } else {
    }
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
	console.log('chat?');
	if(chatfocus){
		$('#chatcompose').blur();
	}
	else{
		$('#chatcompose').focus();
	}
}

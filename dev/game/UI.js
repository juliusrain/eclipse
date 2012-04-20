var chatfocus = false;
var shooting = false;

// window resize events
$(window).load(sizeGame);
$(window).resize(sizeGame);

// click events
$('#jumpmapcontrol').click(toggleJumpMap);
$('#mouselockcontrol').click(toggleCursor);
$('#medjumpcontrol').click(medJump);
$('#chatcontrol').click(switchToChat);
$('#chatcompose').focus(function (){
    $('#chatcontrol').addClass('on');
    chatfocus = true;
});
$('#chatcompose').blur(function (){
    $('#chatcontrol').removeClass('on');
    chatfocus = false;
});

// keyboard events
$(window).keypress(function (e){
    //console.log(e);
    switch(e.keyCode) {
        // j = toggle jump map
        case 106: {
            if(!chatfocus) {
            //    toggleJumpMap();
            }
            break;
        }
			// m = medium jump
		case 109: {
			if(!chatfocus) {
				medJump();
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
        // t = auto repair
        case 116:{
            if(!chatfocus) {
                toggleAutoRepair();
            }
            break;
        }
        // enter = chat box
        case 13: {
            toggleChat();
            return false;
            break;
        }
        //create explosion (for testing) p
        case 112: {
            if(!chatfocus) {
                //graphicsEngine.addExplosionLarge(50, 0, -100);
                sceneElements.AIShips[0].fireLaser();
            }
            break;
        }
        case 111: {
            if(!chatfocus) {
                var new_ship = jQuery.extend(true, {}, ship_template);
                console.log(new_ship);
                //graphicsEngine.addGameObject(new_ship);
            }
            break;
        }
    }
});
$(window).keydown(function (e){
    if(!chatfocus) {
        if(e.keyCode === 32) {
            shooting = true;
            return false;
        }
    }
});
$(window).keyup(function (e){
    if(!chatfocus) {
        if(e.keyCode === 32) {
            shooting = false;
            return false;
        }
    }
});

$('#chatcompose').keydown(function (e){
    //console.log(e);
    var chatbox=$("#chatcompose");
    if (e.which == 27) {
        // if user pressed esc, leave chat mode
        toggleChat();
    }
    else if (e.which == 13) {
        // if user pressed answer, send new msg and leave chat mode
        if(chatbox.val() != "") {
            newMessage(chatbox.val());
            chatbox.val("");
        }
<<<<<<< HEAD
    } else {
        // stop propagation of event so it doesn't affect ship steering
        e.stopImmediatePropagation();
=======
>>>>>>> e8933cfa16e03e1ba883a5f99125934657cc986e
    }
    // stop propagation of event so it doesn't affect ship steering
    e.stopImmediatePropagation();
});

function toggleJumpMap() {
    // hide jump map
    if($('#jumpmapbox:visible').length){
        $('#jumpmapbox').hide();
        graphicsEngine.toggleCursor(false);
        graphicsEngine.jumpmap.setVisible(false);
        $('#jumpmapcontrol').removeClass('on');
    } else { // show jump map
        $('#jumpmapbox').show();
        graphicsEngine.toggleCursor(true);
        graphicsEngine.jumpmap.setVisible(true);
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
        $('body').css('cursor', 'crosshair');
    }
    else{
        $('#mouselockcontrol').addClass('on');
        $('body').css('cursor', 'auto');
    }
}

<<<<<<< HEAD
function medJump() {
	gameEngine.mediumJump();
}

function switchToChat() {
    console.log('chat?');
=======
function toggleChat() {
>>>>>>> e8933cfa16e03e1ba883a5f99125934657cc986e
    if(chatfocus){
        $('#chatcompose').blur();
    }
    else{
        $('#chatcompose').focus();
    }
}

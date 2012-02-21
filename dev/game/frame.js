function sizeGame(){
    if(window.innerWidth > 600 && window.innerHeight > 500){
        sizeElements();
        graphicsEngine.resizePlayWindow();
    }
}

function sizeElements(){
    var ww = window.innerWidth,
        wh = window.innerHeight,
        centerTop,
        centerBottom,
        centerHeight;
    $("#top").css({
        'width':ww,
        'top':0,
        'left':0,
    });
    centerTop = parseInt($("#top").height());
    $("#bottom").css({
        'width':ww,
        'top':wh-(parseInt($("#bottom").css("height"))),
        'left':0,
    });
    centerBottom = wh-(parseInt($("#bottom").css("height")));
    centerHeight = centerBottom - centerTop;
    $("#left").css({
        'width':ww/6,
        'height':centerHeight,
        'top':centerTop,
        'left':0,
    });
    $("#right").css({
        'width':ww/6,
        'height':centerHeight,
        'top':centerTop,
        'left':5*ww/6,
    });
    $("#minimap").css({
        'width':ww/8,
        'height':ww/8,
        'left':10,
        'bottom':10,
    });
    //$('#main')
    /*$("#middle").css({
        'width':4*ww/6,
        'height':centerHeight,
        'top':centerTop,
        'left':ww/6,
    });*/
    $('#minibox').height(parseInt($('#minibox').width()));
    $('#minibox').css('top', parseInt($('#left').css('top'))+$('#left').height()-$('#minibox').height()*1.25);
};
window.onload = sizeGame;
window.onresize = sizeGame;

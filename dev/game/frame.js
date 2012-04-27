function sizeGame(){
    if(window.innerWidth > 600 && window.innerHeight > 500){
        sizeElements();
        if(typeof graphicsEngine == "object" && typeof graphicsEngine.resizePlayWindow == "function"){
            graphicsEngine.resizePlayWindow();
        }
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
        'width':ww/7,
        'height':ww/7,
    });
    $('#minibox').height(parseInt($('#minibox').width()));
    $('#minibox').css('top', parseInt($('#left').css('top'))+$('#left').height()-$('#minibox').height()*1.25);
};

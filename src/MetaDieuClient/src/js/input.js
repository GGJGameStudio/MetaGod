
function initInput(){
    keyEsc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    keyEsc.onDown.add(exitApplication, this);

    key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key1.onDown.add(skill1, this);

    key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key2.onDown.add(skill2, this);

    key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key3.onDown.add(skill3, this);

    keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keySpace.onDown.add(reset, this);

    game.input.onDown.add(mouseClick, this);

    game.input.mouse.mouseMoveCallback = mouseMove;
}

function reset () {

    var win = gui.Window.get();
    win.reloadDev();
}

function skill1 () {
    client.currentPower = 0;
    client.ihm1.visible = true;
    client.ihm2.visible = false;
    client.ihm3.visible = false;
    console.log("skill1");
}

function skill2 () {
    client.currentPower = 1;
    client.ihm1.visible = false;
    client.ihm2.visible = true;
    client.ihm3.visible = false;
    console.log("skill2");
}

function skill3 () {
    client.currentPower = 2;
    client.ihm1.visible = false;
    client.ihm2.visible = false;
    client.ihm3.visible = true;
    console.log("skill3");
}

function mouseClick(evt){
    if (evt.button == 0){
        mouseLeft(evt);
    } else if (evt.button == 2){
        mouseRight(evt);
    }
}


function mouseLeft(evt){
    var tileClicked = getTileClicked(evt);
    var x = tileClicked.x;
    var y = tileClicked.y;
    var command;
    switch(client.currentPower){
        case 0: command = 'AddElevationCommand'; break;
        case 1: command = 'AddHumidityCommand'; break;
        case 2: command = 'AddWhirlwindCommand'; break;
    }

    var data = { command: command, x: x, y: y };
    socket.emit('update',data );
}

function mouseRight(evt){
    var tileClicked = getTileClicked(evt);
    var x = tileClicked.x;
    var y = tileClicked.y;
    var command;
    switch(client.currentPower){
        case 0: command = 'RemoveElevationCommand'; break;
        case 1: command = 'RemoveHumidityCommand'; break;
        case 2: command = 'RemoveWhirlwindCommand'; break;
    }

    var data = { command: command, x: x, y: y };
    socket.emit('update',data );
}

function getTileClicked(evt){
    var x = Math.floor((evt.positionDown.x - client.ground.position.x - client.tileMargin * client.scaleX) / ((client.tileWidth + client.tileMargin) * client.scaleX));
    var y = Math.floor((evt.positionDown.y - client.ground.position.y - client.tileMargin * client.scaleY) / ((client.tileHeight + client.tileMargin) * client.scaleY));
    return {x : x, y : y};
}

function mouseMove(evt){
    client.cameraMoveLeft = evt.layerX < 50;
    client.cameraMoveRight = evt.layerX > client.windowWidth - 50;
    client.cameraMoveUp = evt.layerY < 50;
    client.cameraMoveDown = evt.layerY > client.windowHeight - 50;

}
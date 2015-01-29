var gui = require('nw.gui');
var win = gui.Window.get(); 
var playerName;
var playerId;
//var serverip = window.prompt('Server ip');
var serverip = "192.168.13.60";
//var serverip = "localhost";

var socket = io('http://'+ serverip +':1337');
socket.on('acquittal', function(data) {
    playerId = data;
    playerName = window.prompt('Player name');
    var data = {
        command : 'LoginCommand',
        login : playerName
    }
    socket.emit('update', data );
});

 
window.onload = function() {
    
    var client = {
        playerName : "",
        playerId : "",
        windowWidth : 1280,
        windowHeight : 900,
        mapWidth : 60,
        mapHeight : 40,
        tileWidth : 64,
        tileHeight : 64,
        scaleX : 0.5,
        scaleY : 0.5,
        tiles : [],
        pilgrims : {},
        cameraMoveRight : false,
        cameraMoveLeft : false,
        cameraMoveUp : false,
        cameraMoveDown : false,
        currentPower : 0,
        players : {},
        colors : { yellow:'0xffd800', blue:'0x1b1bc7 ', green: '0x11910b', orange: '0xe3810d', magenta: '0xd01283', cyan: '0x00bff3', purple: '0x92278f' }
    };
    
    var game = new Phaser.Game(client.windowWidth, client.windowHeight, Phaser.AUTO, '', { 
        preload: preload, 
        create: create, 
        update: update
    });

    
    var players = {};
    
    function preload () {
        game.load.spritesheet('pilgrim1', 'assets/spritesheet pilgrim.png', 42, 72, 8);
        game.load.spritesheet('pilgrim2', 'assets/spritesheet pilgrim cape.png', 42, 72, 8);
        game.load.spritesheet('tiles2','assets/tilesheet.png', client.tileWidth, client.tileHeight, 33);
        game.load.spritesheet('whirlwind','assets/spritesheet whirlwind.png', client.tileWidth, client.tileHeight, 4);
    }
    
    function configureClientSocket()
    {
        client.playerName = playerName;
        client.playerId = playerId;
        client.objects = game.add.sprite(0, 0);
        client.objects.scale.x = client.scaleX;
        client.objects.scale.y = client.scaleY;
        
        
        //faith score
        var text = faithScoreText();
        var style = { font: "13px Arial", fill: "#ff0044", align: "center" };

        client.scoreText = game.add.text(client.windowWidth - 100, 20, text, style);
        
        //objectives
        text = objectiveText();
        style = { font: "13px Arial", fill: "#ff0044", align: "center" };

        client.objectiveText = game.add.text(20, 20, text, style);
        
        socket.on('status', function(data) {
            //console.log(data);
            
            if (data.world !== undefined){
                updateMap(data.world.matrix);
            }
            
            if (data.players !== undefined){
                updatePlayers(data.players);
            }
            
            if (data.pilgrims !== undefined){
                updatePilgrims(data.pilgrims);
            }
        });
    }
    
    function setTileType(x, y, type){
        client.tiles[x][y].frame = type;
    }
    
    function getTileType(x, y){
        return client.tiles[x][y].frame;
    }
    
    function faithScoreText(players){
        var text = " ";
        for (var player in players){
            text += players[player].username;
            text += " - ";
            text += players[player].faithScore;
            text += "\n"
        }
        return text;
    }
    
    function objectiveText(players){
        var text = " objectif";
        return text;
    }
    
    function updatePilgrims(pilgrims){
        var id;
        var pilgrim;
        var directionx;
        var directiony;
        var x;
        var y;
        var color;
        for(var i = 0; i < pilgrims.length ; i++){
            pilgrim = pilgrims[i];
            id = "" + pilgrim.id;
            directionx = pilgrim.direction.x;
            directiony = pilgrim.direction.y;
            x = pilgrim.x;
            y = pilgrim.y;
            color = pilgrim.color;
            if (client.pilgrims[id] != null){
                //maj
                var sprite = client.pilgrims[id];
                //sprite.body.velocity.x = directionx * 30;
                //sprite.body.velocity.y = directiony * 30;
                
                if (pilgrim.life == 0){
                    if (sprite.copain != null){
                        sprite.copain.destroy(true);
                        sprite.copain = null;
                    }
                    sprite.destroy(true);
                    delete(client.pilgrims[id]);
                } else {
                
                    switch(getDirection(directionx, directiony)){
                        case "right" : sprite.animations.play('moveRight'); break;
                        case "left" : sprite.animations.play('moveLeft'); break;
                        case "down" : sprite.animations.play('moveDown'); break;
                        case "up" : sprite.animations.play('moveUp'); break;
                    }

                    sprite.x = x;
                    sprite.y = y;

                    if (sprite.copain != null){
                        sprite.copain.x = x;
                        sprite.copain.y = y;

                        switch(getDirection(directionx, directiony)){
                            case "right" : sprite.copain.animations.play('moveRight'); break;
                            case "left" : sprite.copain.animations.play('moveLeft'); break;
                            case "down" : sprite.copain.animations.play('moveDown'); break;
                            case "up" : sprite.copain.animations.play('moveUp'); break;
                        }
                    }
                }
                
            } else {
                
                //creation
                
                var sprite2 = game.add.sprite(x, y, 'pilgrim2');
                sprite2.anchor.x = 0.5;
                sprite2.anchor.y = 0.9;
                sprite2.animations.add('moveUp', [0,1], 3, true, true);
                sprite2.animations.add('moveDown', [4,5], 3, true, true);
                sprite2.animations.add('moveRight', [2,3], 3, true, true);
                sprite2.animations.add('moveLeft', [6,7], 3, true, true);
                switch(getDirection(directionx, directiony)){
                    case "right" : sprite2.animations.play('moveRight'); break;
                    case "left" : sprite2.animations.play('moveLeft'); break;
                    case "down" : sprite2.animations.play('moveDown'); break;
                    case "up" : sprite2.animations.play('moveUp'); break;
                }
                
                sprite2.tint = client.colors[Object.keys(client.colors)[color]];
                
                
                var sprite1 = game.add.sprite(x, y, 'pilgrim1');
                sprite1.anchor.x = 0.5;
                sprite1.anchor.y = 0.9;
                sprite1.animations.add('moveUp', [0,1], 3, true, true);
                sprite1.animations.add('moveDown', [4,5], 3, true, true);
                sprite1.animations.add('moveRight', [2,3], 3, true, true);
                sprite1.animations.add('moveLeft', [6,7], 3, true, true);
                switch(getDirection(directionx, directiony)){
                    case "right" : sprite1.animations.play('moveRight'); break;
                    case "left" : sprite1.animations.play('moveLeft'); break;
                    case "down" : sprite1.animations.play('moveDown'); break;
                    case "up" : sprite1.animations.play('moveUp'); break;
                }
                
                client.objects.addChild(sprite2);
                client.objects.addChild(sprite1);
                
                sprite1.copain = sprite2;
                client.pilgrims[id] = sprite1;
            }
        }
        
        
    }
    
    function updateMap(map){
        //console.log(map);
        if (client.tiles[0] == null){
            for (var i = 0 ; i < client.mapWidth ; i++){
                client.tiles[i] = [];
                for (var j = 0 ; j < client.mapHeight ; j++){
                    var tile = game.add.sprite(i * 64, j * 64, 'tiles2');
                    client.objects.addChild(tile);
                    client.tiles[i][j] = tile;
                    setTileType(i, j, map[i][j].tileCode);
                }
            }
        } else {
            for (var i = 0 ; i < client.mapWidth ; i++){
                for (var j = 0 ; j < client.mapHeight ; j++){
                    setTileType(i, j, map[i][j].tileCode);
                    
                    //tornades
                    if (map[i][j].whirlwind == 1){
                        if (client.tiles[i][j].whirlwind == null){
                            client.tiles[i][j].whirlwind = game.add.sprite(i * 64, j * 64, 'whirlwind');
                            client.tiles[i][j].whirlwind.animations.add('anim', [0,1,2,3], 10, true, true);
                            client.tiles[i][j].whirlwind.animations.play('anim');
                            client.objects.addChild(client.tiles[i][j].whirlwind);
                        }
                    } else if (map[i][j].whirlwind == -1){
                        if (client.tiles[i][j].whirlwind == null){
                            client.tiles[i][j].whirlwind = game.add.sprite(i * 64, j * 64, 'whirlwind');
                            client.tiles[i][j].whirlwind.animations.add('anim', [3,2,1,0], 10, true, true);
                            client.tiles[i][j].whirlwind.animations.play('anim');
                            client.objects.addChild(client.tiles[i][j].whirlwind);
                        }
                    } else {
                        if (client.tiles[i][j].whirlwind != null){
                            client.tiles[i][j].whirlwind.destroy(true);
                            client.tiles[i][j].whirlwind = null;
                        }
                    }
                            
                }
            }
        }
    }
    
    function updatePlayers(players){
        //console.log(players);
        client.players = players;
        client.scoreText.text = faithScoreText(players);
        
    }
    
    function getDirection(x, y){
        if (x > 0) return "right";
        if (y > 0) return "up";
        if (x < 0) return "left";
        if (y < 0) return "down";
    }

    function create () {

        configureClientSocket();
        
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
    
    function update () {
        
        var cameraMinX = - client.tileWidth * client.scaleX * client.mapWidth + client.windowWidth;
        var cameraMaxX = 0;
        var cameraMinY = - client.tileHeight * client.scaleY * client.mapHeight + client.windowHeight;
        var cameraMaxY = 0;
        
        
        if (client.cameraMoveRight){
            client.objects.x -= 4;
            if (client.objects.x < cameraMinX) client.objects.x = cameraMinX;
        }
        
        if (client.cameraMoveLeft){
            client.objects.x += 4;
            if (client.objects.x > cameraMaxX) client.objects.x = cameraMaxX;
        }
        
        if (client.cameraMoveDown){
            client.objects.y -= 4;
            if (client.objects.y < cameraMinY) client.objects.y = cameraMinY;
        }
        
        if (client.cameraMoveUp){
            client.objects.y += 4;
            if (client.objects.y > cameraMaxY) client.objects.y = cameraMaxY;
        }
        
        //todo opti
        //var x = Math.floor((evt.positionDown.x - client.objects.x) / (client.tileWidth * client.scaleX));
        //var y = Math.floor((evt.positionDown.y - client.objects.y) / (client.tileWidth * client.scaleY));
        
    }

    function exitApplication () {
        win.close();
        gui.App.quit();
    }
    
    function reset () {
        
        var win = gui.Window.get();
        win.reloadDev();
    }
    
    function skill1 () {
        client.currentPower = 0;
        console.log("skill1");
    }
    
    function skill2 () {
        client.currentPower = 1;
        console.log("skill2");
    }
    
    function skill3 () {
        client.currentPower = 2;
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
        var x = Math.floor((evt.positionDown.x - client.objects.x) / (client.tileWidth * client.scaleX));
        var y = Math.floor((evt.positionDown.y - client.objects.y) / (client.tileWidth * client.scaleY));
        var command;
        switch(client.currentPower){
            case 0: command = 'AddElevationCommand'; break;
            case 1: command = 'AddHumidityCommand'; break;
            case 2: command = 'AddWhirlwindCommand'; break;
        }
        
        console.log("left" + x + " / " + y);
        var data = { command: command, x: x, y: y };
        console.log(data);
        socket.emit('update',data );
    }
    
    function mouseRight(evt){
        var x = Math.floor((evt.positionDown.x - client.objects.x) / (client.tileWidth * client.scaleX));
        var y = Math.floor((evt.positionDown.y - client.objects.y) / (client.tileWidth * client.scaleY));
        var command;
        switch(client.currentPower){
            case 0: command = 'RemoveElevationCommand'; break;
            case 1: command = 'RemoveHumidityCommand'; break;
            case 2: command = 'RemoveWhirlwindCommand'; break;
        }
        
        var data = { command: command, x: x, y: y };
        console.log(data);
        socket.emit('update',data );
    }
    
    function mouseMove(evt){
        client.cameraMoveLeft = evt.layerX < 50;
        client.cameraMoveRight = evt.layerX > client.windowWidth - 50;
        client.cameraMoveUp = evt.layerY < 50;
        client.cameraMoveDown = evt.layerY > client.windowHeight - 50;
        
    }

};
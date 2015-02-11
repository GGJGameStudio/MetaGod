var gui = require('nw.gui');
var win = gui.Window.get(); 


function exitApplication () {
    win.close();
    gui.App.quit();
}

var client = {
    playerName : "",
    playerId : "",
    color : "",
    temples: [],
    windowWidth : 1280,
    windowHeight : 900,
    mapWidth : 40,
    mapHeight : 40,
    tileWidth : 64,
    tileHeight : 64,
    tileMargin : 0,
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
    colors : { red: '0xff4444', yellow:'0xffd800', blue:'0x1b1bc7 ', green: '0x11910b', orange: '0xe3810d', magenta: '0xDF98DF', cyan: '0x00bff3', purple: '0x92278f' },
    borderColorMap : [
        '#E3D13A',
        '#E3D13A',
        '#E3D13A',
        '#E3D13A',
        '#E3D13A',
        '#E3D13A',
        '#83AC54',
        '#83AC54',
        '#83AC54',
        '#83AC54',
        '#83AC54',
        '#696208',
        '#696208',
        '#696208',
        '#696208',
        '#696208',
        '#E3D13A',
        '#E3D13A',
        '#E3D13A',
        '#E3D13A',
        '#83AC54',
        '#2F3E56',
        '#2F3E56',
        '#2F3E56',
        '#2F3E56',
        '#696208',
        '#696208',
        '#696208',
        '#696208',
        '#83AC54',
        '#83AC54',
        '#83AC54',
        '#83AC54',
        '#6B4520',
        '#6B4520',
        '#6B4520',
        '#6B4520',
        '#6B4520',
        '#BBD1DD'
    ]
};

var game;
var playerId;
var playerName;
var socket;
var serverip;

 
window.onload = function() {
    
    game = new Phaser.Game(client.windowWidth, client.windowHeight, Phaser.WEBGL, '', { 
        preload: preload, 
        create: create, 
        update: update
    });
    
    function preload () {
        game.load.spritesheet('pilgrim1', 'assets/spritesheet pilgrim.png', 42, 72, 8);
        game.load.spritesheet('pilgrim2', 'assets/spritesheet pilgrim cape.png', 42, 72, 8);
        game.load.spritesheet('tiles2','assets/tilesheet.png', client.tileWidth, client.tileHeight, 43);
        game.load.spritesheet('whirlwind','assets/spritesheet whirlwind.png', client.tileWidth, client.tileHeight, 4);
        game.load.image('ihm','assets/interface/interface.png', 192, 64);
        game.load.spritesheet('ihm1','assets/interface/interface01.png', 64, 64);
        game.load.spritesheet('ihm2','assets/interface/interface02.png', 64, 64);
        game.load.spritesheet('ihm3','assets/interface/interface03.png', 64, 64);
        game.load.audio('music', 'assets/Ingame.ogg');
        game.load.image('templeblanc', 'assets/temple blanc.png', 64, 64);
        game.load.image('templedalle', 'assets/temple dalle.png', 64, 64);
        game.load.image('templepyr', 'assets/temple pyramide.png', 64, 64);
        
        game.load.image('title', 'assets/pilgrims title.png', 1280, 900);
    }
    
    function create () {
        
        initSocket();
        
        initClient();

        initIhm();
        
        initInput();
    }
    
    function update () {
        
        var cameraMinX = - (client.tileWidth + client.tileMargin) * client.scaleX * client.mapWidth + client.windowWidth - client.tileMargin * client.scaleX;
        var cameraMaxX = 0;
        var cameraMinY = - (client.tileHeight + client.tileMargin) * client.scaleY * client.mapHeight + client.windowHeight - client.tileMargin * client.scaleY;
        var cameraMaxY = 0;
        
        
        if (client.cameraMoveRight){
            client.entities.position.x -= 4;
            client.ground.position.x -= 4;
            if (client.ground.position.x < cameraMinX) {
                client.ground.position.x = cameraMinX;
                client.entities.position.x = cameraMinX;
            }
        }
        
        if (client.cameraMoveLeft){
            client.entities.position.x += 4;
            client.ground.position.x += 4;
            if (client.ground.position.x > cameraMaxX) {
                client.ground.position.x = cameraMaxX;
                client.entities.position.x = cameraMaxX;
            }
        }
        
        if (client.cameraMoveDown){
            client.entities.position.y -= 4;
            client.ground.position.y -= 4;
            if (client.ground.position.y < cameraMinY) {
                client.ground.position.y = cameraMinY;
                client.entities.position.y = cameraMinY;
            }
        }
        
        if (client.cameraMoveUp){
            client.entities.position.y += 4;
            client.ground.position.y += 4;
            if (client.ground.position.y > cameraMaxY) {
                client.ground.position.y = cameraMaxY;
                client.entities.position.y = cameraMaxY;
            }
        }
        
        // opti
        /*var screenx = Math.floor((client.windowWidth / 2 - client.objects.x) / (client.tileWidth + client.tileMargin) * client.scaleX));
        var screeny = Math.floor((client.windowHeight / 2 - client.objects.y) / (client.tileWidth + client.tileMargin) * client.scaleY));
        
        var nbTileWidthVisible = client.windowWidth / ((client.tileWidth + client.tileMargin) * client.scaleX);
        var nbTileHeightVisible = client.windowHeight / ((client.tileHeight + client.tileMargin) * client.scaleY);
        
        if (client.tiles[0] != null){
            for (var i = 0 ; i < client.mapWidth ; i++){
                for (var j = 0 ; j < client.mapHeight ; j++){
                    if (i < screenx - nbTileWidthVisible /2 || 
                        i > screenx + nbTileWidthVisible /2 || 
                        j > screeny + nbTileHeightVisible /2 || 
                        j < screeny - nbTileHeightVisible /2)
                       {
                           client.tiles[i][j].visible = false;

                    } else {
                        client.tiles[i][j].visible = true;
                    }
                }
            }
        }*/
    }
};


function initClient(){
    client.playerName = playerName;
    client.playerId = playerId;

    music = game.add.audio('music', 1, true);

    music.play('',0,1,true);

    client.title = game.add.sprite(0, 0, 'title');

    //groups
    client.ground = game.add.group();
    client.entities = game.add.group();
    client.ihmGroup = game.add.group();

    client.ground.scale.x = client.scaleX;
    client.ground.scale.y = client.scaleY;

    client.entities.scale.x = client.scaleX;
    client.entities.scale.y = client.scaleY;   
}

function initSocket() {
    
    
    serverip = window.prompt('Server ip');
    //serverip = "192.168.13.31";
    //serverip = "localhost";
    if (serverip != null && serverip.length == 0) {
        exitApplication();
    }

    playerName = window.prompt('Player name');
    if (playerName != null && playerName.length == 0) {
        exitApplication();
    }

    socket = io('http://'+ serverip +':1337');
    
    socket.on('status', function(data) {
        if (client.init) {
            //console.log(data);
            if (data.players !== undefined){
                updatePlayers(data.players);
            }

            if (data.tiles !== undefined && data.tiles[0] != null){
                updateMap(data.tiles);
            }


            if (data.pilgrims !== undefined){
                updatePilgrims(data.pilgrims);
            }
        }
    });


    socket.on('init', function(data) {
        //console.log(data);
        initPlayers(data.players);

        initMap(data.tiles);

        initPilgrims(data.pilgrims);

        client.init = true;
    });
    
    
    socket.on('acquittal', function(data) {
        playerId = data;

        var data = {
            command : 'LoginCommand',
            login : playerName
        }
        socket.emit('update', data );
    });
}
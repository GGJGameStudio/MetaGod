function initPilgrims(pilgrims){
    for(var i = 0; i < pilgrims.length ; i++){
        createPilgrim(pilgrims[i]);
    }
}

function updatePilgrims(pilgrims){

    for(var i = 0; i < pilgrims.length ; i++){
        pilgrim = pilgrims[i];

        if (client.pilgrims[pilgrim.id] != null){
            updatePilgrim(pilgrims[i]);

        } else if (pilgrim.life != 0){
            createPilgrim(pilgrims[i]);
        }
    }
}

function createPilgrim(pilgrim){
    var id = "" + pilgrim.id;
    var directionx = pilgrim.direction.x;
    var directiony = pilgrim.direction.y;
    var x = pilgrim.coordinate.x * (1 + client.tileMargin / client.tileWidth);
    var y = pilgrim.coordinate.y * (1 + client.tileMargin / client.tileHeight);
    var speedx = pilgrim.speed * (1 + client.tileMargin / client.tileWidth);
    var speedy = pilgrim.speed * (1 + client.tileMargin / client.tileHeight);
    var color = pilgrim.color;

    var sprite2 = game.add.sprite(x, y, 'pilgrim2');
    sprite2.anchor.x = 0.5;
    sprite2.anchor.y = 0.9;
    sprite2.animations.add('moveUp', [0,1], 2, true, true);
    sprite2.animations.add('moveDown', [4,5], 2, true, true);
    sprite2.animations.add('moveRight', [2,3], 2, true, true);
    sprite2.animations.add('moveLeft', [6,7], 2, true, true);
    switch(getDirection(directionx, directiony)){
        case "right" : sprite2.animations.play('moveRight'); break;
        case "left" : sprite2.animations.play('moveLeft'); break;
        case "down" : sprite2.animations.play('moveDown'); break;
        case "up" : sprite2.animations.play('moveUp'); break;
    }

    sprite2.tint = client.colors[Object.keys(client.colors)[color]];
    game.physics.enable(sprite2);
    sprite2.body.velocity.x = directionx * speedx * 1000;
    sprite2.body.velocity.y = directiony * speedy * 1000;


    var sprite1 = game.add.sprite(x, y, 'pilgrim1');
    sprite1.anchor.x = 0.5;
    sprite1.anchor.y = 0.9;
    sprite1.animations.add('moveUp', [0,1], 2, true, true);
    sprite1.animations.add('moveDown', [4,5], 2, true, true);
    sprite1.animations.add('moveRight', [2,3], 2, true, true);
    sprite1.animations.add('moveLeft', [6,7], 2, true, true);
    switch(getDirection(directionx, directiony)){
        case "right" : sprite1.animations.play('moveRight'); break;
        case "left" : sprite1.animations.play('moveLeft'); break;
        case "down" : sprite1.animations.play('moveDown'); break;
        case "up" : sprite1.animations.play('moveUp'); break;
    }
    game.physics.enable(sprite1);
    sprite1.body.velocity.x = directionx * speedx * 1000;
    sprite1.body.velocity.y = directiony * speedy * 1000;

    sprite1.copain = sprite2;
    client.pilgrims[id] = sprite1;


    client.entities.add(sprite2);
    client.entities.add(sprite1);
}

function updatePilgrim(pilgrim){
    var id = "" + pilgrim.id;
    var directionx = pilgrim.direction.x;
    var directiony = pilgrim.direction.y;
    var x = pilgrim.coordinate.x * (1 + client.tileMargin / client.tileWidth);
    var y = pilgrim.coordinate.y * (1 + client.tileMargin / client.tileHeight);
    var speedx = pilgrim.speed * (1 + client.tileMargin / client.tileWidth);
    var speedy = pilgrim.speed * (1 + client.tileMargin / client.tileHeight);
    var color = pilgrim.color;
    //maj
    var sprite = client.pilgrims[id];

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
        sprite.body.velocity.x = directionx * speedx * 1000;
        sprite.body.velocity.y = directiony * speedy * 1000;

        if (sprite.copain != null){
            sprite.copain.x = x;
            sprite.copain.y = y;
            sprite.copain.body.velocity.x = directionx * speedx * 1000;
            sprite.copain.body.velocity.y = directiony * speedy * 1000;

            switch(getDirection(directionx, directiony)){
                case "right" : sprite.copain.animations.play('moveRight'); break;
                case "left" : sprite.copain.animations.play('moveLeft'); break;
                case "down" : sprite.copain.animations.play('moveDown'); break;
                case "up" : sprite.copain.animations.play('moveUp'); break;
            }
        }
    }
}


function getDirection(x, y){
    if (x > 0) return "right";
    if (y > 0) return "up";
    if (x < 0) return "left";
    if (y < 0) return "down";
}
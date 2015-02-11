function setTileType(x, y, type){
    client.tiles[x][y].frame = type;
}

function getTileType(x, y){
    return client.tiles[x][y].frame;
}

function initMap(tiles){

    for (var i = 0 ; i < client.mapWidth ; i++){
        client.tiles[i] = [client.mapHeight];
        client.borders[i] = [client.mapHeight];
    }

    var i,j,tile;
    for (var t = 0 ; t < tiles.length ; t++){
        i = tiles[t].coordinate.x;
        j = tiles[t].coordinate.y;
        tile = game.add.sprite(client.tileMargin + i * (client.tileWidth + client.tileMargin), client.tileMargin + j * (client.tileHeight + client.tileMargin), 'tiles2');
        client.tiles[i][j] = tile;
        setTileType(i, j, tiles[t].tileCode);
        client.ground.add(tile);

        if (tiles[t].color !== undefined){
            var t1 = game.add.sprite(client.tileMargin + i * (client.tileWidth  + client.tileMargin), client.tileMargin + j * (client.tileHeight  + client.tileMargin), 'templedalle');
            var colortile = game.add.sprite(client.tileMargin + i * (client.tileWidth  + client.tileMargin), client.tileMargin + j * (client.tileHeight  + client.tileMargin), 'templeblanc');
            var t2 = game.add.sprite(client.tileMargin + i * (client.tileWidth  + client.tileMargin), client.tileMargin + j * (client.tileHeight + client.tileMargin), 'templepyr');

            if (tiles[t].color == client.color){
                colortile.tint = client.colors[Object.keys(client.colors)[tiles[t].color]];
            }

            client.ground.add(t1);
            client.ground.add(colortile);
            client.ground.add(t2);
        }
    }
    
    if (client.tileMargin != 0){
        for (var i = 0 ; i < client.mapWidth ; i++){
            for (var j = 0 ; j < client.mapHeight ; j++){
                client.borders[i][j] = [3];
                drawBorders(i, j);
            }
        }
    }

    client.title.visible = false;

}

function updateMap(tiles){

    var i,j,tile;
    for (var t = 0 ; t < tiles.length ; t++){
        i = tiles[t].coordinate.x;
        j = tiles[t].coordinate.y;
        setTileType(i, j, tiles[t].tileCode);

        //whirlwind
        if (tiles[t].whirlwind == 1){
            if (client.tiles[i][j].whirlwind == null){
                client.tiles[i][j].whirlwind = game.add.sprite(client.tileMargin + i * (client.tileWidth  + client.tileMargin), client.tileMargin + j * (client.tileHeight  + client.tileMargin), 'whirlwind');
                client.tiles[i][j].whirlwind.animations.add('anim', [0,1,2,3], 4, true, true);
                client.tiles[i][j].whirlwind.animations.play('anim');
                client.entities.add(client.tiles[i][j].whirlwind);
            }
        } else if (tiles[t].whirlwind == -1){
            if (client.tiles[i][j].whirlwind == null){
                client.tiles[i][j].whirlwind = game.add.sprite(client.tileMargin + i * (client.tileWidth  + client.tileMargin), client.tileMargin + j * (client.tileHeight  + client.tileMargin), 'whirlwind');
                client.tiles[i][j].whirlwind.animations.add('anim', [3,2,1,0], 4, true, true);
                client.tiles[i][j].whirlwind.animations.play('anim');
                client.entities.add(client.tiles[i][j].whirlwind);
            }
        } else {
            if (client.tiles[i][j].whirlwind != null){
                client.tiles[i][j].whirlwind.destroy(true);
                client.tiles[i][j].whirlwind = null;
            }
        }
    }

    if (client.tileMargin != 0){
        var w = client.mapWidth;
        var h = client.mapHeight;
        for (var t = 0 ; t < tiles.length ; t++){
            i = tiles[t].coordinate.x;
            j = tiles[t].coordinate.y;


            drawBorders(i, j);
            drawBorders((((i + 1)%w)+w)%w, j);
            drawBorders(i, (((j + 1)%h)+h)%h);
            drawBorders((((i - 1)%w)+w)%w, j);
            drawBorders(i, (((j - 1)%h)+h)%h);
        }
    }
}


function drawBorders(i, j){
    var bmd, grd, border;

    //horizontal
    if (i < client.mapWidth - 1){
        bmd = game.add.bitmapData(client.tileMargin, client.tileHeight);
        grd = bmd.context.createLinearGradient(0, 0, client.tileMargin, 0);
        grd.addColorStop(0, client.borderColorMap[getTileType(i,j)]);
        grd.addColorStop(1, client.borderColorMap[getTileType(i + 1,j)]);


        bmd.rect(0, 0, client.tileMargin, client.tileHeight, grd);

        border = game.add.sprite((client.tileWidth + client.tileMargin) * (i + 1), client.tileMargin + (client.tileHeight + client.tileMargin) * j, bmd);
        client.ground.add(border);
        client.borders[i][j][0] = border;
    }

    //vertical
    if (j < client.mapHeight - 1){
        bmd = game.add.bitmapData(client.tileWidth, client.tileMargin);
        grd = bmd.context.createLinearGradient(0, 0, 0, client.tileMargin);
        grd.addColorStop(0, client.borderColorMap[getTileType(i,j)]);
        grd.addColorStop(1, client.borderColorMap[getTileType(i,j + 1)]);

        bmd.rect(0, 0, client.tileWidth, client.tileMargin, grd);

        border = game.add.sprite(client.tileMargin + (client.tileWidth + client.tileMargin) * i, (client.tileHeight + client.tileMargin) * (j + 1), bmd);
        client.ground.add(border);
        client.borders[i][j][1] = border;
    }

    //center
    if (j < client.mapHeight - 1 && i < client.mapWidth - 1){

        bmd = game.add.bitmapData(client.tileMargin, client.tileMargin);

        var color1 = Phaser.Color.hexToColor(client.borderColorMap[getTileType(i, j)]);
        var color2 = Phaser.Color.hexToColor(client.borderColorMap[getTileType(i + 1, j)]);
        var color3 = Phaser.Color.hexToColor(client.borderColorMap[getTileType(i, j + 1)]);
        var color4 = Phaser.Color.hexToColor(client.borderColorMap[getTileType(i + 1, j + 1)]);
        var r,g,b;
        var w = bmd.width - 1;
        var h = bmd.height - 1;
        for (var x = 0 ; x <= w ; x++){
            for (var y = 0 ; y <= h; y++){
                r = 0.0;
                r += color1.r * (w - x) * (h - y) / (w * h);
                r += color2.r * x * (h - y) / (w * h);
                r += color3.r * (w - x) * y / (w * h);
                r += color4.r * x * y / (w * h);
                r = Math.round(r);

                g = 0.0;
                g += color1.g * (w - x) * (h - y) / (w * h);
                g += color2.g * x * (h - y) / (w * h);
                g += color3.g * (w - x) * y / (w * h);
                g += color4.g * x * y / (w * h);
                g = Math.round(g);

                b = 0.0;
                b += color1.b * (w - x) * (h - y) / (w * h);
                b += color2.b * x * (h - y) / (w * h);
                b += color3.b * (w - x) * y / (w * h);
                b += color4.b * x * y / (w * h);
                b = Math.round(b);

                bmd.rect(x, y, 1, 1, 'rgba('+r+', '+g+', '+b+', 1)');
            }
        }

        border = game.add.sprite((client.tileWidth + client.tileMargin) * (i + 1), (client.tileHeight + client.tileMargin) * (j + 1), bmd);
        client.ground.add(border);
        client.borders[i][j][2] = border;
    }
}
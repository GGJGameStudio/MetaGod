import M = require('../Utils/Matrix');
import Pla = require('./Player');
import Pil = require('./Pilgrim');
import T = require('./Tiles');
import V = require('../Utils/Variables');
import D = require('../Utils/Dictionary');

export class World {

    private static instance: World = null;

    private world: M.Matrix<T.ITile>;

    updatedTiles: Array<T.ITile>;
    pilgrims: Array<Pil.Pilgrim>;
    players: D.Dictionary<string, Pla.Player>;
    temples: Array<T.TempleTile>;

    public static get Instance(): World {

        if (World.instance == null)
            World.instance = new World(V.Variables.worldWidth, V.Variables.worldHeight);
        return World.instance;
    }

    constructor(public width: number, public height: number) {

        this.world = new M.Matrix<T.ITile>(width, height);
        this.temples = new Array<T.TempleTile>();

        this.updatedTiles = new Array<T.ITile>();

        var width = V.Variables.worldWidth;

        var arrayMap = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 38, 38, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 38, 38, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 37, 39, 39, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 37, 37, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];

        var y = 0;
        var x = 0;
        

        for (var i = 0; i < arrayMap.length; i++) {
            var value = arrayMap[i];

            var tile: T.ITile = null;

            switch (value) {
                case 37:
                    tile = new T.IndestructibleTile(x, y);
                    break;
                case 39:
                    tile = new T.TempleTile(x, y);
                    break;
                case 38:
                    tile = new T.SpawnerTile(x, y);
                    break;
                default:
                    tile = new T.EnvironmentTile(x, y);
                    break;
            }

            this.world.setItem(x, y, tile);

            x++;

            if (x == width) {
                x = 0;
                y++;
            }
        }

        // Colorize Temples
        var colorIndex = 0;
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var tile = this.world.getItem(i, j);

                if (tile.indestructibleType == T.IndestructibleType.Temple && (<T.TempleTile>tile).color == null) {

                    this.setTempleColor(i, j, colorIndex);
                    this.setTempleColor(i+1, j, colorIndex);
                    this.setTempleColor(i, j+1, colorIndex);
                    this.setTempleColor(i+1, j+1, colorIndex);

                    colorIndex++;
                }
            }
        }

        this.pilgrims = new Array();
        this.players = new D.Dictionary<string,Pla.Player>();
    }

    setTempleColor(i: number, j: number, color: number) {
        var tile = this.world.getItem(i, j);

        if (tile.indestructibleType == T.IndestructibleType.Temple) {
            var temple = <T.TempleTile>tile;

            temple.color = color;
            this.temples.push(<T.TempleTile>tile);
        }
    }

    Update(elapsed: number) {

        // Update players
        var nbPlayer = this.players.length();
        for (var i = 0; i < nbPlayer; i++) {
            var player = this.players.getByIndex(i);

            player.update(elapsed);
        }

        // Update tiles
        for (var i = 0; i < V.Variables.worldWidth; i++) {
            for (var j = 0; j < V.Variables.worldHeight; j++) {
                this.world.getItem(i, j).update(elapsed);
            }
        }

        var pilgrimToDelete = new Array<Pil.Pilgrim>();

        // Update pilgrims
        for (var i = 0; i < this.pilgrims.length; i++) {
            var pilgrim = this.pilgrims[i];

            pilgrim.update(elapsed);
            if (pilgrim.isDead()) {
                pilgrimToDelete.push(pilgrim);
            }

        }
        // Delete dead pilgrim
        for (var i = 0; i < pilgrimToDelete.length; i++) {
            var pilgrim = pilgrimToDelete[i];

            var index = this.pilgrims.indexOf(pilgrim);

            this.pilgrims.splice(index, 1);
        }
    }

    getTile(x: number, y: number) {
        return this.world.getItem(x, y);
    }

    addPlayer(playerId: string) {
        var color = -1;
        var player = new Pla.Player(playerId);

        for (var i = 0; i < this.temples.length; i++) {
            var temple = this.temples[i];

            if (temple.player == null && color == -1) {
                color = temple.color;
                temple.player = player;
                player.color = color;
            } else if (temple.color == color) {
                temple.player = player;
            }
        }

        this.players.add(playerId, player);
    }

    getPlayer(idPlayer: string) {
        return this.players.getByKey(idPlayer);
    }

    removePlayer(idPlayer: string) {
        for (var i = 0; i < this.temples.length; i++) {
            var temple = this.temples[i];

            if (temple.player != null && temple.player.id == idPlayer) {
                temple.player = null;
            }
        }

        this.players.remove(idPlayer);
    }

    addUpdatedTile(tile: T.ITile) {
        var alreadyUpdated = false;

        for (var i = 0; i < this.updatedTiles.length; i++) {
            var currentTile = this.updatedTiles[i];
            alreadyUpdated = currentTile == tile;

            if (alreadyUpdated) {
                break;
            }
        }

        if (!alreadyUpdated) {
            this.updatedTiles.push(tile);
        }
    }

    resetUpdatedTile() {
        this.updatedTiles = new Array<T.ITile>();
    }
}
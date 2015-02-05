import Pla = require('./Player');
import Pil = require('./Pilgrim');
import T = require('./Tiles');
import W = require('./World');
import V = require('../Utils/Vector');

export class WorldDto {

    players: Array<PlayerDto>;
    tiles: Array<TileDto>;
    pilgrims: Array<PilgrimDto>;

    constructor(world: W.World, refreshAll: boolean = false) {
        this.players = new Array<PlayerDto>();
        for (var i = 0; i < world.players.length(); i++) {
            this.players.push(new PlayerDto(world.players.getByIndex(i)));
        }

        var pilgrims = new Array<PilgrimDto>();
        world.pilgrims.forEach(function (pilgrim) {
            pilgrims.push(new PilgrimDto(pilgrim));
        });
        this.pilgrims = pilgrims;

        var tiles = new Array<TileDto>();
        if (refreshAll) {
            for (var i = 0; i < world.width; i++) {
                for (var j = 0; j < world.height; j++) {
                    tiles.push(new TileDto(world.getTile(i, j)));
                }
            }
        } else {
            world.updatedTiles.forEach(function (tile) {
                tiles.push(new TileDto(tile));
            });
        }
        this.tiles = tiles;
    }
}

export class PlayerDto {

    faithScore: number;
    color: number;
    username: string;
    id: string;

    constructor(player: Pla.Player) {
        this.faithScore = player.faithScore;
        this.color = player.color;
        this.username = player.username;
        this.id = player.id;
    }
}

export class TileDto {

    coordinate: V.Vector;
    tileCode: number;
    whirlwind: number;
    color: number;

    constructor(tile: T.ITile) {
        this.coordinate = new V.Vector(tile.x_matrix, tile.y_matrix);
        this.tileCode = tile.tileCode;
        this.whirlwind = tile.whirlwind;

        if(tile instanceof T.TempleTile) {
            this.color = (<T.TempleTile>tile).color;
        }
    }
}

export class PilgrimDto {

    id: number;
    speed: number;
    direction: V.Vector;
    coordinate: V.Vector
    color: number;
    life: number;

    constructor(pilgrim: Pil.Pilgrim) {
        this.id = pilgrim.id;
        this.speed = pilgrim.lastTile.speed;
        this.direction = pilgrim.direction;
        this.coordinate = new V.Vector(pilgrim.x, pilgrim.y);
        this.color = pilgrim.color;
        this.life = pilgrim.life;
    }
}
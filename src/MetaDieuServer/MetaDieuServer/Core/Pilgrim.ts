import P = require('./Player');
import W = require('./World');
import T = require('./Tiles');
import Var = require('../Utils/Variables');
import Vec = require('../Utils/Vector');

export class Pilgrim {

    private static pilgrimIdentity = 1;

    id: number;
    life: number;
    direction: Vec.Vector;
    x_matrix() { get: { return Math.floor(this.x / Var.Variables.tileSize); } }
    y_matrix() { get: { return Math.floor(this.y / Var.Variables.tileSize); } }
    lastLakeDamage: number;
    lastTile: T.ITile;
    readyToDelete: number;

    deltaActionPixels: number;
    deltaXPosition: number;
    deltaYPosition: number;

    constructor(public x: number, public y: number, x_direction: number, y_direction: number, public color: number) {
        this.life = Var.Variables.pilgrimLife;
        this.id = Pilgrim.pilgrimIdentity;
        this.direction = new Vec.Vector(x_direction, y_direction);
        this.lastLakeDamage = 0;
        this.lastTile = null;
        this.readyToDelete = 0;
        this.deltaActionPixels = 0;
        this.deltaXPosition = 0;
        this.deltaYPosition = 0;

        Pilgrim.pilgrimIdentity++;
    }

    update(elapsed: number) {
        if (this.life > 0) {
            if (this.x_matrix() >= Var.Variables.worldWidth)
                this.x = 0;

            if (this.y_matrix() >= Var.Variables.worldHeight)
                this.y = 0;

            if (this.x_matrix() < 0)
                this.x = Var.Variables.worldWidth * Var.Variables.tileSize - 1;

            if (this.y_matrix() < 0)
                this.y = Var.Variables.worldHeight * Var.Variables.tileSize - 1;

            var currentTile = W.World.Instance.getTile(this.x_matrix(), this.y_matrix());

            currentTile.udatePilgrimState(elapsed, this, currentTile == this.lastTile);

            this.lastTile = currentTile;
        } else {
            this.readyToDelete += elapsed;
        }
    }

    isDead() {
        return this.life == 0 && this.readyToDelete >= Var.Variables.timeBeforeKill;
    }

}
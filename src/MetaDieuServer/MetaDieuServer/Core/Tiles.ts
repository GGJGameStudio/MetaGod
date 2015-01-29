import P = require('./Pilgrim');
import Pla = require('./Player');
import W = require('./World');
import R = require('../Utils/Randomisator');
import Var = require('../Utils/Variables');
import Vec = require('../Utils/Vector');

export interface ITile {

    elevation: number;
    humidity: number;
    whirlwind: number;
    speed: number;
    x_matrix: number;
    y_matrix: number;
    mountainType: MountainType;
    indestructibleType: IndestructibleType;
    tileCode: number;
    randomTileNumber: number;

    udatePilgrimState(elapsed: number, pilgrim: P.Pilgrim, alreadyThere: boolean);

    calculateNewCode();

    update(elapsed: number);
}

export class BaseTile implements ITile {

    elevation: number;
    humidity: number;
    whirlwind: number;
    get speed() {
        var defaultSpeed = Var.Variables.defaultSpeed;

        if (this.elevation == -1 && this.humidity == 1) {
            return 0;
        } else if (this.humidity == 1 && this.elevation != -1 || this.humidity == -1 && this.elevation == 1) {
            return defaultSpeed / 2;
        }

        return defaultSpeed;
    }
    x_matrix: number;
    y_matrix: number;
    mountainType: MountainType;
    indestructibleType: IndestructibleType;
    tileCode: number;
    randomTileNumber: number;

    constructor(x: number, y: number) {
        this.x_matrix = x;
        this.y_matrix = y;
        this.elevation = 0;
        this.humidity = 0;
        this.whirlwind = 0;
        this.mountainType = MountainType.None;
        this.indestructibleType = IndestructibleType.None;
        this.calculateNewCode();
    }

    udatePilgrimState(elapsed: number, pilgrim: P.Pilgrim, alreadyThere: boolean) {

        // Change direction
        if (!alreadyThere) {
            pilgrim.lastLakeDamage = 0;
            pilgrim.deltaActionPixels = R.generateDeltaPosition();
            pilgrim.deltaXPosition = pilgrim.x;
            pilgrim.deltaYPosition = pilgrim.y;
        } else {
            var deltaPixel = 0;
            if (pilgrim.direction.x != 0)
                deltaPixel = Math.abs(pilgrim.x - pilgrim.deltaXPosition);
            else {
                deltaPixel = Math.abs(pilgrim.y - pilgrim.deltaYPosition);
            }

            if (deltaPixel > pilgrim.deltaActionPixels) {
                pilgrim.deltaActionPixels = Var.Variables.tileSize * 2;

                if (this.mountainType != MountainType.None && this.humidity >= 0) {
                    //Mountain direction change
                    switch (this.mountainType) {
                        case MountainType.Full:
                            pilgrim.direction.x = -pilgrim.direction.x;
                            pilgrim.direction.y = -pilgrim.direction.y;
                            break;
                        case MountainType.BottomLeft:
                            if (pilgrim.direction.x == 1) {
                                pilgrim.direction.x = 0;
                                pilgrim.direction.y = 1;
                            }
                            else if (pilgrim.direction.y == -1) {
                                pilgrim.direction.y = 0;
                                pilgrim.direction.x = -1;
                            } else {
                                pilgrim.direction.x = -pilgrim.direction.x;
                                pilgrim.direction.y = -pilgrim.direction.y;
                            }
                            break;
                        case MountainType.BottomRight:
                            if (pilgrim.direction.x == -1) {
                                pilgrim.direction.x = 0;
                                pilgrim.direction.y = 1;
                            }
                            else if (pilgrim.direction.y == -1) {
                                pilgrim.direction.y = 0;
                                pilgrim.direction.x = 1;
                            } else {
                                pilgrim.direction.x = -pilgrim.direction.x;
                                pilgrim.direction.y = -pilgrim.direction.y;
                            }
                            break;
                        case MountainType.TopLeft:
                            if (pilgrim.direction.x == 1) {
                                pilgrim.direction.x = 0;
                                pilgrim.direction.y = -1;
                            }
                            else if (pilgrim.direction.y == 1) {
                                pilgrim.direction.y = 0;
                                pilgrim.direction.x = -1;
                            } else {
                                pilgrim.direction.x = -pilgrim.direction.x;
                                pilgrim.direction.y = -pilgrim.direction.y;
                            }
                            break;
                        case MountainType.TopRight:
                            if (pilgrim.direction.x == -1) {
                                pilgrim.direction.x = 0;
                                pilgrim.direction.y = -1;
                            }
                            else if (pilgrim.direction.y == 1) {
                                pilgrim.direction.y = 0;
                                pilgrim.direction.x = 1;
                            } else {
                                pilgrim.direction.x = -pilgrim.direction.x;
                                pilgrim.direction.y = -pilgrim.direction.y;
                            }
                            break;
                    }
                } else if (this.whirlwind != 0) {
                    if (pilgrim.direction.x != 0) {
                        pilgrim.direction.y = -pilgrim.direction.x * this.whirlwind;
                        pilgrim.direction.x = 0;
                    } else {
                        pilgrim.direction.x = pilgrim.direction.y * this.whirlwind;
                        pilgrim.direction.y = 0;
                    }
                }

                if (this.humidity == -1) {
                    pilgrim.life -= Var.Variables.desertDamage;
                }

                if (this.elevation == -1 && this.humidity != 1) {
                    pilgrim.life = 0;
                }

            }

            if (this.humidity == 1 && this.elevation == -1) {
                pilgrim.lastLakeDamage += elapsed;
                if (pilgrim.lastLakeDamage >= Var.Variables.lakeDPS) {
                    pilgrim.lastLakeDamage = 0;
                    pilgrim.life--;
                }
            }

        }

        if (this.humidity == 1 && this.elevation == -1) {
            if (pilgrim.deltaActionPixels < Var.Variables.tileSize) {

                pilgrim.x += pilgrim.direction.x * Var.Variables.defaultSpeed * elapsed;
                pilgrim.y += pilgrim.direction.y * Var.Variables.defaultSpeed * elapsed;
            } else {
                pilgrim.x += pilgrim.direction.x * this.speed * elapsed;
                pilgrim.y += pilgrim.direction.y * this.speed * elapsed;
            }
        } else {
            pilgrim.x += pilgrim.direction.x * this.speed * elapsed;
            pilgrim.y += pilgrim.direction.y * this.speed * elapsed;
        }
    }



    calculateNewCode() {
        this.randomTileNumber = R.Random(0, 3);
        //Full calculus here
        var indexStart = 0;
        var indexOffset = this.randomTileNumber;
        if (this.elevation == 1) {
            //Mountains/Dunes
            switch (this.mountainType) {
                case MountainType.BottomLeft:
                    indexOffset = 0;
                    break;
                case MountainType.BottomRight:
                    indexOffset = 1;
                    break;
                case MountainType.Full:
                    indexOffset = 2;
                    break;
                case MountainType.TopLeft:
                    indexOffset = 3;
                    break;
                case MountainType.TopRight:
                    indexOffset = 4;
                    break;
                default:
                    break;
            }
            switch (this.humidity) {
                case -1:
                    indexStart = 0;
                    break;
                case 0:
                    indexStart = 6;
                    break;
                case 1:
                    indexStart = 11;
                    break;
            }
        } else if (this.elevation == 0) {
            //Plains/Swamp/Desert
            switch (this.humidity) {
                case -1:
                    indexStart = 16;
                    break;
                case 0:
                    indexStart = 29;
                    //For the moment, indestructible tiles will all have the same sprite.
                    switch (this.indestructibleType) {
                        case IndestructibleType.Basic:
                            indexStart = 33;
                            break;
                        case IndestructibleType.Spawn:
                            indexStart = 37;
                            indexOffset = 0;
                            break;
                        case IndestructibleType.Temple:
                            indexStart = 38;
                            indexOffset = 0;
                            break;
                    }
                    break;
                case 1:
                    indexStart = 25;
                    break;
            }

        } else if (this.elevation == -1) {

            //Hole/Lake
            switch (this.humidity) {
                case -1:
                    indexStart = 5;
                    indexOffset = 0;
                    break;
                case 0:
                    indexStart = 20;
                    indexOffset = 0;
                    break;
                case 1:
                    indexStart = 21;
                    break;
            }
        }

        this.tileCode = indexStart + indexOffset;
    }

    update(elapsed: number) {
        //this.elevation = 0;
        //this.humidity = 0;
        //this.whirlwind = 0;
        //this.mountainType = MountainType.None;
    }
}

export class EnvironmentTile extends BaseTile {

    constructor(x: number, y: number) {
        super(x, y);
    }

    update(elapsed: number) { }

}

export enum IndestructibleType {
    None,
    Basic,
    Spawn,
    Temple
}

export enum MountainType {
    None,
    Full,
    BottomLeft,
    BottomRight,
    TopLeft,
    TopRight
}

export class IndestructibleTile extends BaseTile {

    constructor(x: number, y: number) {
        super(x, y);
        this.indestructibleType = IndestructibleType.Basic;
        this.calculateNewCode();
    }

    update(elapsed: number) {
        this.elevation = 0;
        this.humidity = 0;
        this.whirlwind = 0;
        this.mountainType = MountainType.None;
    }

}

export class TempleTile extends IndestructibleTile {

    color: number;
    player: Pla.Player;

    constructor(x: number, y: number) {
        super(x, y);
        this.indestructibleType = IndestructibleType.Temple;

        this.calculateNewCode();
    }

    udatePilgrimState(elapsed: number, pilgrim: P.Pilgrim, alreadyThere: boolean) {
        if (this.player != null) {
            if (pilgrim.color == this.color) {
                this.player.faithScore += 20;
            } else {
                this.player.faithScore += 2;
            }
        }
        pilgrim.life = 0;
    }
}

export class SpawnerTile extends IndestructibleTile {

    lastSpawn: number;
    frequence: number;

    constructor(x: number, y: number) {
        super(x, y);
        this.indestructibleType = IndestructibleType.Spawn;
        this.lastSpawn = 0;
        this.frequence = this.determineFrequence();

        this.calculateNewCode();
    }

    private determineFrequence() {
        var min = Var.Variables.spawnPeriodMinInMillisecond;
        var max = Var.Variables.spawnPeriodMaxInMillisecond;

        return (2 + Math.random() * 4) * 1000;
    }

    private generatePilgrim() {
        var maxPilgrim = Var.Variables.maxPilgrimSpawn;
        var currentPilgrim = W.World.Instance.pilgrims.length;

        if (currentPilgrim < maxPilgrim && this.lastSpawn > this.frequence) {
            var tileSize = Var.Variables.tileSize;

            var randomX = R.generateDeltaPosition();
            var randomY = R.generateDeltaPosition();

            var isXdirection = R.headOrTails();
            var direction = R.headOrTails() ? 1 : -1;

            var pilgrim = new P.Pilgrim(
                this.x_matrix * tileSize + randomX,
                this.y_matrix * tileSize + randomY,
                isXdirection ? direction : 0,
                isXdirection ? 0 : direction,
                Math.floor(Math.random() * Var.Variables.nbPlayerMax)
                );

            W.World.Instance.pilgrims.push(pilgrim);

            this.lastSpawn -= this.frequence;

            this.frequence = this.determineFrequence();
        } else if (currentPilgrim > maxPilgrim) {
            console.log('Maximum simultaneous pilgrims reached');
        }
    }

    update(elapsed: number) {
        this.lastSpawn += elapsed;

        this.generatePilgrim();

        this.elevation = 0;
        this.humidity = 0;
        this.whirlwind = 0;
        this.mountainType = MountainType.None;
    }

}
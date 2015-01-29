import Var = require('../Utils/Variables');
export class Player {

    faithScore: number;
    isMeta: boolean;
    color: number;

    humidityLastUseTime: number;
    elevationLastUseTime: number;
    whirlwindLastUseTime: number;

    canUseHumidity() { get: { return this.humidityLastUseTime > Var.Variables.humidityCoolDown; } }
    canUseElevation() { get: { return this.elevationLastUseTime > Var.Variables.elevationCoolDown; } }
    canUseWhirlwind() { get: { return this.whirlwindLastUseTime > Var.Variables.whirlwindCoolDown; } }

    constructor(id: string, public username: string) {
        this.faithScore = Var.Variables.defaultFaith;
        this.isMeta = false;
        this.humidityLastUseTime = 0;
        this.elevationLastUseTime = 0;
        this.whirlwindLastUseTime = 0;
        this.color = -1;
    }

    update(elapsed: number) {

        this.humidityLastUseTime += elapsed;
        this.elevationLastUseTime += elapsed;
        this.whirlwindLastUseTime += elapsed;

    }
}
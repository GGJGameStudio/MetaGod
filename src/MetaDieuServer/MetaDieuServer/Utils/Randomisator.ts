import V = require('./Variables');

export function generateDeltaPosition() {

    var tileSize = V.Variables.tileSize;

    return tileSize / 4 + Math.random() * tileSize / 2;
}

export function headOrTails() {

    return Math.random() > 0.5;
}

//high is inclusive
export function Random(low: number, high: number) {
    if (high < low)
        return 0;
    return Math.floor(Math.random() * (high - low + 1 ) + low);
}
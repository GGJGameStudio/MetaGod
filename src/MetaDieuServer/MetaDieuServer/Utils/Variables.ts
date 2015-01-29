export class Variables {
    public static get tileSize(): number { return 64; }
    public static get defaultSpeed(): number { return 0.05; }
    public static get worldHeight(): number { return 40; }
    public static get worldWidth(): number { return 40; }
    public static get spawnPeriodMinInMillisecond(): number { return 20; } // 2
    public static get spawnPeriodMaxInMillisecond(): number { return 60; } // 6
    public static get updateRate(): number { return 40; } // 40
    public static get humidityBrushSize(): number { return 2; }
    public static get elevationBrushSize(): number { return 1; }
    public static get whirlwindBrushSize(): number { return 0; }
    public static get pilgrimLife(): number { return 4; }
    public static get lakeDPS(): number { return 1000; }
    public static get desertDamage(): number { return 1; }
    public static get nbPlayerMax(): number { return 8; }
    public static get humidityCost(): number { return 0; }
    public static get elevationCost(): number { return 0; }
    public static get whirlwindCost(): number { return 0; }
    public static get humidityCoolDown(): number { return 1000; }
    public static get elevationCoolDown(): number { return 1000; }
    public static get whirlwindCoolDown(): number { return 1000; }
    public static get defaultFaith(): number { return 0; } 
    public static get timeBeforeKill(): number { return 1000; }
    public static get maxPilgrimSpawn(): number { return 80; }
}
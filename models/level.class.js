class Level {
    enemies;
    clouds;
    backgroundObjects;
    saloons;
    coins;
    bottles;
    level_end_x = 3980;

    constructor(enemies, clouds, backgroundObjects, saloons, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.saloons = saloons;
        this.coins = coins;
        this.bottles = bottles;
    };
}
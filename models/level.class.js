class Level {
    enemies;
    clouds;
    backgroundObjects;
    saloons;
    coins;
    bottles;
    level_end_x = 3980;

    /**
     * Creates a new game level with all objects and enemies
     * @constructor
     * @param {Array} enemies - Array of enemy objects
     * @param {Array} clouds - Array of cloud objects
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} saloons - Array of saloon objects
     * @param {Array} coins - Array of coin objects
     * @param {Array} bottles - Array of bottle objects
     */
    constructor(enemies, clouds, backgroundObjects, saloons, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.saloons = saloons;
        this.coins = coins;
        this.bottles = bottles;
    };
}
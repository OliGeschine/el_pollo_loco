let level1;

/**
 * Initializes Level 1 with all enemies, collectables, and background objects
 * Creates chickens, small chickens, bottles, coins, clouds and backgrounds
 * Called when starting a new game or restarting
 * @function
 * @returns {void}
 */
function initLevel() {
    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new smallChicken(),
            new smallChicken(),
            new smallChicken(),
            new smallChicken(),
            new smallChicken(),
            new smallChicken(),
            new smallChicken(),
        ],
        [
            new Clouds('img/5_background/layers/4_clouds/1.png', 300),
            new Clouds('img/5_background/layers/4_clouds/2.png', 700),
            new Clouds('img/5_background/layers/4_clouds/1.png', 1200),
            new Clouds('img/5_background/layers/4_clouds/2.png', 1600),
            new Clouds('img/5_background/layers/4_clouds/1.png', 2100),
            new Clouds('img/5_background/layers/4_clouds/2.png', 2500),
            new Clouds('img/5_background/layers/4_clouds/1.png', 2900),
            new Clouds('img/5_background/layers/4_clouds/2.png', 3400),
            new Clouds('img/5_background/layers/4_clouds/2.png', 3700),
            new Clouds('img/5_background/layers/4_clouds/2.png', 4100),
        ],
        [
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/air.png', 720),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/air.png', 1440),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 1440),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 1440),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 1440),
            new BackgroundObject('img/5_background/layers/air.png', 2160),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 2160),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 2160),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 2160),
            new BackgroundObject('img/5_background/layers/air.png', 2880),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 2880),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 2880),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 2880),
            new BackgroundObject('img/5_background/layers/air.png', 3600),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 3600),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 3600),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 3600),
            new BackgroundObject('img/5_background/layers/air.png', 4320),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 4320),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 4320),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 4320),

        ],
        [
            new Coin(700),
            new Coin(1100),
            new Coin(1700),
            new Coin(2400),
            new Coin(3100),
        ],
        [
            new Bottle(300),
            new Bottle(600),
            new Bottle(900),
            new Bottle(1200),
            new Bottle(1500),
            new Bottle(1800),
            new Bottle(2100),
            new Bottle(2300),
            new Bottle(2500),
            new Bottle(2800),
        ],
    );
}

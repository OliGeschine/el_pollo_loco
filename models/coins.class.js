/**
 * Collectable coin object that animates and can be picked up
 * Spawns at random heights and animates between two states
 * @class
 * @extends CollectableObject
 */
class Coin extends CollectableObject {
    width = 90;
    height = 90;
    IMAGES_MOVING = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png',
    ];
    offset = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
    };


    constructor(x) {
        super().loadImage(this.IMAGES_MOVING[0]);
        this.loadImages(this.IMAGES_MOVING);
        this.x = x;
        this.y = 200 + Math.random() * 150;
        this.animate();
        this.collected = false;
    }

    /**
 * Starts the coin's animation loop
 * Alternates between two coin images every 500ms
 * @function
 * @returns {void}
 */
    animate() {
        startInterval(() => {
            this.animateIcons(this.IMAGES_MOVING);
        }, 500);
    }
}
/**
 * Collectable bottle object that animates on the ground
 * Can be collected by player for throwing at enemies
 * @class
 * @extends CollectableObject
 */
class Bottle extends CollectableObject {
    width = 65;
    height = 65;
    offset = {
        top: 15,
        bottom: 10,
        left: 25,
        right: 25
    };

    IMAGES_MOVING = ['img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',];

    IMAGES_THROWING = ['img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',];

    /**
     * Creates a new collectible bottle object
     * @constructor
     * @param {number} x - X-coordinate position for the bottle
     */
    constructor(x) {
        super().loadImage(this.IMAGES_MOVING[0]);
        this.loadImages(this.IMAGES_THROWING);
        this.loadImages(this.IMAGES_MOVING);
        this.x = x
        this.y = 360;
        this.animate();
        this.collected = false;
    }

    /**
 * Starts the bottle's ground animation loop
 * Animates between different bottle images to show movement
 * @function
 * @returns {void}
 */
    animate() {
        startInterval(() => {
            this.animateIcons(this.IMAGES_MOVING);
        }, 500);
    }

}
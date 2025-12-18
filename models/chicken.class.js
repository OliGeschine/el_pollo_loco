/**
 * Regular chicken enemy that walks left across the level
 * Can be defeated by jumping on it or throwing bottles
 * @class
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    height = 70;
    width = 70;
    y = 355;
    energy = 2;
    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ]

    /**
     * Creates a new chicken enemy with AI behavior and animations
     * @constructor
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 600 + Math.random() * 3000;
        this.speed = 0.3;
        this.animate();
    }

    /**
     * Starts chicken animation and movement loops
     * Handles walking animation and left movement
     * @function
     * @returns {void}
     */
    animate() {
        this.walkInterval = startInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60)
        startInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                return this.isDead();
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }
}
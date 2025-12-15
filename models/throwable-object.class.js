/**
 * Throwable bottle projectile that flies in an arc and splashes on impact
 * Can hit enemies or ground, plays rotation animation while flying
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    throwBottle = new Audio('audio/throw_bottle.mp3');
    offset = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };
    throwDirection;

    IMAGES_THROWING = ['img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'];

    IMAGES_SPLASHING = ['img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'];

    constructor(x, y) {
        super().loadImage(this.IMAGES_THROWING[0]);
        this.loadImages(this.IMAGES_THROWING);
        this.loadImages(this.IMAGES_SPLASHING);
        sounds.push(this.throwBottle);
        this.x = x;
        this.y = y;
        this.splashed = false;
        this.world = 0;
        this.height = 70;
        this.width = 60;
        this.throw();
    }

    /**
 * Sets the throw direction for the bottle
 * Called immediately after construction
 * @function
 * @param {boolean} direction - True for left, false for right
 * @returns {void}
 */
    setThrowDirection(direction) {
        this.throwDirection = direction;
    }

    /**
     * Initiates the bottle throwing physics and animation
     * Sets upward velocity, applies gravity, plays sound, and starts movement loop
     * @method
     * @returns {void}
     */
    throw() {
        this.speedY = 15;
        this.applyGravity();
        if (isMuted === false) {
            this.throwBottle.play();
        };
        this.getThrowInterval(this.throwInterval);
    }

    getThrowInterval(throwInterval) {
        this.throwInterval = startInterval(() => {
            if (this.throwDirection !== undefined) {
                this.playAnimation(this.IMAGES_THROWING);
                if (this.throwDirection) {
                    this.x -= 10;
                } else {
                    this.x += 10;
                }
                if (this.y >= 355) {
                    this.hitGround();
                    if (!isMuted) {
                        this.world.bottleBreaking.play();
                    }
                }
            }
        }, 25);
    }

    /**
    * Handles bottle collision with ground
    * Stops bottle movement and triggers splash animation
    * @function
    * @returns {void}
    */
    hitGround() {
        if (this.splashed) return;
        this.y = 380;
        this.splash();
    }

    /**
    * Plays bottle splash animation and removes bottle from world
    * Shows splash effects for 600ms then removes bottle from game
    * @function
    * @returns {void}
    */
    splash() {
        if (this.splashed) return;
        this.splashed = true;
        this.speedY = 0;
        this.acceleration = 0;
        clearInterval(this.throwInterval);
        this.splashingIntervall = startInterval(() => {
            this.playAnimation(this.IMAGES_SPLASHING);
        }, 100);
        setTimeout(() => {
            clearInterval(this.splashingIntervall);
            const index = this.world?.throwableObjects.indexOf(this);
            if (index > -1) {
                this.world.throwableObjects.splice(index, 1);
            }
        }, 600);
    }

    /**
 * Cleans up throwable object intervals
 * @function
 * @returns {void}
 */
    cleanup() {
        if (this.throwInterval) {
            clearInterval(this.throwInterval);
            this.throwInterval = null;
        }
        if (this.splashingInterval) {
            clearInterval(this.splashingInterval);
            this.splashingInterval = null;
        }
    }

}
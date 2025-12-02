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
        this.getThrowDirection();
    }

    /**
     * Determines throwing direction based on character orientation
     * Starts continuous movement loop checking both left and right directions
     * @method
     * @returns {void}
     */
    getThrowDirection() {
        this.throwIntervall = startInterval(() => {
            this.throwRight();
            this.throwLeft();
        }, 25);
    }

    /**
     * Moves bottle to the right when character faces right
     * Animates bottle rotation and checks for ground collision
     * @method
     * @returns {void}
     */
    throwRight() {
        if (!this.splashed && !this.world.character.otherDirection) {
            this.playAnimation(this.IMAGES_THROWING);
            this.x += 10;
            if (this.y >= 355) {
                this.hitGround();
                this.world.bottleBreaking.play();
            }
        }
    }

    /**
     * Moves bottle to the left when character faces left
     * Animates bottle rotation and checks for ground collision
     * @method
     * @returns {void}
     */
    throwLeft() {
        if (!this.splashed && this.world.character.otherDirection) {
            this.playAnimation(this.IMAGES_THROWING);
            this.x -= 10;
            if (this.y >= 355) {
                this.hitGround();
                this.world.bottleBreaking.play();
            }
        }
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
        clearInterval(this.throwIntervall);
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

}
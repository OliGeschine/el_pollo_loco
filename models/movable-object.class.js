/**
 * Base class for all objects that can move and interact
 * Provides physics, collision detection, damage, and animation methods
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    lastHit = 0;
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
      * Applies gravity physics to the object
      * Makes object fall when above ground
      * @function
      * @returns {void}
      */
    applyGravity() {
        startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
 * Determines if object is above ground level
 * Different behavior for ThrowableObjects vs other objects
 * @function
 * @returns {boolean} True if object is above ground
 */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 190;
        }
    }

    /**
 * Checks if this object is colliding with another object
 * Uses offset values for precise collision boxes
 * @function
 * @param {MovableObject} mo - Object to check collision with
 * @returns {boolean} True if objects are colliding
 */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
 * Checks if character is stomping on an enemy from above
 * Used for jump attacks on enemies
 * @function
 * @param {MovableObject} mo - Object being stomped
 * @returns {boolean} True if stomping attack is valid
 */
    isStomping(mo) {
        if (this.justStomped) return false;
        let isColliding = this.isColliding(mo);
        let characterBottom = (this.y + this.offset.top) + (this.height - this.offset.top - this.offset.bottom);
        let enemyTop = mo.y + mo.offset.top;
        let enemyStompZone = enemyTop + ((mo.height - mo.offset.top - mo.offset.bottom) * 0.5);

        let fromAbove = characterBottom >= enemyTop && characterBottom <= enemyStompZone;
        let fallingDown = this.speedY <= 0;

        return isColliding && fromAbove && fallingDown;
    }

    /**
 * Applies weak damage with 1-second cooldown
 * Used for regular enemy attacks and bottle hits
 * @function
 * @returns {void}
 */
    hitWeak() {
        const now = new Date().getTime();
        const timeSinceLastHit = now - this.lastHit;

        if (timeSinceLastHit > 1000) {
            this.energy -= 2;
            if (this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = now;
        }
    }

    /**
 * Applies strong damage with 0.5-second cooldown
 * Used for endboss attacks
 * @function
 * @returns {void}
 */
    hitStrong() {
        const now = new Date().getTime();
        const timeSinceLastHit = now - this.lastHit;

        if (timeSinceLastHit > 500) {
            this.energy -= 10;
            if (this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = now;
        }
    }

    /**
 * Applies bottle damage to endboss with 0.5-second cooldown
 * Specific damage type for bottle projectiles vs endboss
 * @function
 * @returns {void}
 */
    bottleHitEndboss() {
        const now = new Date().getTime();
        const timeSinceLastHit = now - this.lastHit;

        if (timeSinceLastHit > 500) {
            this.energy -= 2;
            if (this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = now;
        }
    }

    /**
 * Checks if object is dead (energy = 0)
 * @function
 * @returns {boolean} True if object has no energy left
 */
    isDead() {
        return this.energy == 0;
    }

    /**
 * Checks if object is in hurt state (recently damaged)
 * Returns true for 1 second after taking damage
 * @function
 * @returns {boolean} True if object was recently hurt
 */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
 * Moves object to the right
 * @function
 * @returns {void}
 */
    moveRight() {
        this.x += this.speed;
    }

    /**
 * Moves object to the left
 * @function
 * @returns {void}
 */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
 * Plays animation by cycling through image array
 * @function
 * @param {string[]} images - Array of image paths for animation
 * @returns {void}
 */
    playAnimation(images) {
        let i = this.currentImage % images.length; // let i = 0 % 6; => 0, Rest 0
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
 * Animates UI icons (coins, bottles) by cycling through images
 * @function
 * @param {string[]} images - Array of image paths for animation
 * @returns {void}
 */
    animateIcons(images) {
        let i = this.currentImage % this.IMAGES_MOVING.length; // let i = 0 % 6; => 0, Rest 0
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
 * Makes object jump by setting upward velocity
 * @function
 * @returns {void}
 */
    jump() {
        this.speedY = 25;
    }
}
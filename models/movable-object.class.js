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


    applyGravity() {
        startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 190;
        }
    }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

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

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; // let i = 0 % 6; => 0, Rest 0
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    animateIcons(images) {
        let i = this.currentImage % this.IMAGES_MOVING.length; // let i = 0 % 6; => 0, Rest 0
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        this.speedY = 25;
    }
}
class MovableObject extends DrawableObjcet {
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

    // isColliding(mo) {
    //     return this.x + this.width > mo.x &&
    //         this.x < mo.x + mo.width &&
    //         this.y + this.height > mo.y &&
    //         this.y < mo.y + mo.height;
    // }

    // isStomping(mo) {
    //     return this.isColliding(mo) &&
    //         this.y + this.height <= mo.y + mo.height / 2 &&
    //         this.speedY < 0
    // }

    isStomping(mo) {
        if (this.justStomped) return false;
        let isColliding = this.isColliding(mo);
        let fromAbove = this.y + this.height >= mo.y && this.y + this.height <= mo.y + mo.height * 0.7; // vorher * 0.3
        let fallingDown = this.speedY <= 0; // vorher this.speedY < 0

        return isColliding && fromAbove && fallingDown;
    }


    // hit() {
    //     this.energy -= 2;
    //     if (this.energy < 0) {
    //         this.energy = 0;
    //     } else {
    //         this.lastHit = new Date().getTime();
    //     }
    // }

    hit() {
        const now = new Date().getTime();
        const timeSinceLastHit = now - this.lastHit;

        if (timeSinceLastHit > 500) {
            this.energy -= 2;
            if (this.energy < 0) {
                this.energy = 0;
            } else {
                this.lastHit = now;
            }
        }
    }


    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Differenz in Millisekunden
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    moveRight() {
        // movement right
        this.x += this.speed;
    }

    moveLeft() {
        // movement left
        this.x -= this.speed;
    }

    playAnimation(images) {
        // walk animation
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
class smallChicken extends MovableObject {
    height = 50;
    width = 50;
    y = 375;
    energy = 2;
    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };
    nextJumpTime = 0;
    groundLevel = 375;


    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ]

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 600 + Math.random() * 3000;
        this.speed = 0.7;
        this.scheduleNextJump();
        this.smallChickenGravity();
        this.animate();
    }

    animate() {
        this.walkInterval = startInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
                this.checkForJump();
                this.stayOnGround();
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

    scheduleNextJump() {
        const randomDelay = 2000 + Math.random() * 3000;
        this.nextJumpTime = Date.now() + randomDelay;
    }

    checkForJump() {
        const currentTime = Date.now();
        if (currentTime >= this.nextJumpTime && !this.smallChickenIsAboveGround()) {
            this.smallChickenJump();
            this.scheduleNextJump();
        }
    }

    smallChickenJump() {
        if (!this.smallChickenIsAboveGround()) {
            this.speedY = 15;
        }
    }

    stayOnGround() {
        if (this.y > this.groundLevel) {
            this.y = this.groundLevel;
            this.speedY = 0;
        }
    }

    smallChickenIsAboveGround() {
        return this.y < this.groundLevel;
    }

    smallChickenGravity() {
        startInterval(() => {
            if (this.smallChickenIsAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

}
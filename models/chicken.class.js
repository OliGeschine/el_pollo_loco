class Chicken extends MovableObject {
    height = 60;
    width = 60;
    y = 365;
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

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 600 + Math.random() * 3000;
        this.speed = 0.3;
        this.animate();
    }

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
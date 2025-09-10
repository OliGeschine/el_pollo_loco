class ThrowableObject extends MovableObject {
    throwBottle = new Audio('audio/throw_bottle.mp3');

    IMAGES_THROWING = ['img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'];

    constructor(x, y) {
        super().loadImage(this.IMAGES_THROWING[0]);
        this.loadImages(this.IMAGES_THROWING);
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 60;
        this.throw();
    }

    throw() {
        this.speedY = 15;
        this.applyGravity();
        this.throwBottle.play();
        setInterval(() => {
            this.playAnimation(this.IMAGES_THROWING);
            this.x += 10;
        }, 25);
    }

}


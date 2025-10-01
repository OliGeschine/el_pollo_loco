class Bottle extends CollectableObject {
    width = 70;
    height = 70;
    IMAGES_MOVING = ['img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',];

    IMAGES_THROWING = ['img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',];

    constructor(x) {
        super().loadImage(this.IMAGES_MOVING[0]);
        this.loadImages(this.IMAGES_THROWING);
        this.loadImages(this.IMAGES_MOVING);
        this.x = x
        this.y = 355;
        this.animate();
    }

    animate() {
        startInterval(() => {
            this.animateIcons(this.IMAGES_MOVING);
        }, 500);
    }

}
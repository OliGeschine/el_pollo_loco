class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;
    hadFirstContact = false;
    energy = 10;
    offset = {
        top: 100,
        bottom: 20,
        left: 60,
        right: 30
    };

    IMAGES_ANGRY = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_ATTACKING = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];


    constructor() {
        super().loadImage(this.IMAGES_ANGRY[0]);
        this.loadImages(this.IMAGES_ANGRY);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 3800;
        this.speed = 0.9;
        this.animate();
    }


    animate() {
        this.walkInterval = startInterval(() => {
            let playerX = this.world.character.x;
            if (playerX >= 3500) {
                this.hadFirstContact = true
            }
            if (!this.isDead() && this.hadFirstContact == true) {
                this.moveLeft();
            }
        }, 1000 / 60);

        startInterval(() => {
            if (!this.world || !world.character.x) return;
            let playerX = this.world.character.x;
            let endbossX = this.world.endboss.x;
            let distance = endbossX - playerX;

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                return;
            }
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                return;
            }
            if (distance <= 250) {
                this.playAnimation(this.IMAGES_ATTACKING);
            } else if (this.hadFirstContact) {
                this.playAnimation(this.IMAGES_WALKING);
            }
            else {
                this.playAnimation(this.IMAGES_ANGRY);
            }
        }, 200);
    }


}
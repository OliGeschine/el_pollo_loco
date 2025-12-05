/**
 * Main playable character class representing Pepe
 * Extends MovableObject to inherit physics and collision detection
 * @class Character
 * @extends MovableObject
 */
class Character extends MovableObject {
    height = 230;
    width = 100;
    x = 50;
    y = 200;
    offset = {
        top: 100,
        bottom: 10,
        left: 15,
        right: 30,
    };
    speed = 8;
    world;
    coins = 0;
    energy = 50;
    justStomped = false;
    walking = new Audio('audio/walking.mp3');

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        sounds.push(this.walking);
        this.applyGravity();
        this.animate();
        this.lastHit = 0;
    }

    /**
 * Main animation controller for character
 * Starts both movement and visual animation loops
 * @function
 * @returns {void}
 */
    animate() {
        this.moveCharacter();
        this.animateCharacter();
    }

    /**
 * Handles character movement based on keyboard input
 * Controls left/right movement, jumping, and camera following
 * @function
 * @returns {void}
 */
    moveCharacter() {
        this.movingInterval = startInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 50) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }
            this.world.cameraX = -this.x + 50;
        }, 1000 / 60);
    }

    /**
   * Handles character visual animations based on current state
   * Manages idle, walking, jumping, hurt, and death animations
   * @function
   * @returns {void}
   */
    animateCharacter() {
        startInterval(() => {
            if (this.isDead()) {
                clearInterval(this.movingInterval);
                this.playAnimation(this.IMAGES_DEAD);
                this.world.characterIsDead = true;
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.getMoveTime();
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.getMoveTime();
                this.playAnimation(this.IMAGES_WALKING);
                if (isMuted === false && this.walking.paused) {
                    this.walking.play();
                }
            } else if (this.getSleepTime()) {
                this.playAnimation(this.IMAGES_SLEEPING)
            } else {
                this.walking.pause();
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 100);
    }

    /**
 * Records the current time as last movement time
 * Used for sleep animation timing
 * @function
 * @returns {void}
 */
    getMoveTime() {
        let currentTime = new Date().getTime();
        this.lastMove = currentTime;
    }

    /**
 * Determines if character should show sleep animation
 * Returns true if no movement for more than 5 seconds
 * @function
 * @returns {boolean} True if character should sleep
 */
    getSleepTime() {
        let lastTimeMoved = new Date().getTime() - this.lastMove;
        return lastTimeMoved > 5000;
    }
}
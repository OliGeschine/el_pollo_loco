/**
 * Main playable character class representing Pepe
 * Extends MovableObject to inherit physics and collision detection
 * @class Character
 * @extends MovableObject
 */
class Character extends MovableObject {
    height = 230;
    width = 100;
    x = 200;
    y = 200;
    offset = {
        top: 100,
        bottom: 10,
        left: 15,
        right: 20,
    };
    speed = 4;
    world;
    coins = 0;
    energy = 50;
    justStomped = false;
    groundLevel = 200;
    jumpAnimationIndex = 0;
    isJumping = false;

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
            if (!this.world || !this.world.keyboard || !this.world.level || this.world === null) {
                return;
            }
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 35) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }
            this.stayOnGround();
            this.world.cameraX = -this.x + 200;
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
            if (!this.world || !this.world.keyboard) {
                return;
            }
            if (this.isDead()) {
                clearInterval(this.movingInterval);
                this.playAnimation(this.IMAGES_DEAD);
                if (this.world) {
                    this.world.characterIsDead = true;
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.getMoveTime();
            } else if (this.isAboveGround()) {
                this.getMoveTime();
                this.playJumpAnimation();
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.getMoveTime();
                this.playAnimation(this.IMAGES_WALKING);
                if (isMuted === false && this.world.walking.paused) {
                    this.world.walking.play();
                }
            } else if (this.getSleepTime()) {
                this.playAnimation(this.IMAGES_SLEEPING)
            } else {
                if (this.world && this.world.walking) {
                    this.world.walking.pause();
                }
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 100);
    }

    /**
 * Ensures character stays on ground level
 * @function
 * @returns {void}
 */
    stayOnGround() {
        if (this.y > this.groundLevel) {
            this.y = this.groundLevel;
            this.speedY = 0;
            this.isJumping = false;
        }
    }

    /**
 * Checks if character is above ground level
 * @function
 * @returns {boolean}
 */
    isAboveGround() {
        return this.y < this.groundLevel;
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
    * Returns true if no movement for more than 8 seconds
    * @function
    * @returns {boolean} True if character should sleep
    */
    getSleepTime() {
        let lastTimeMoved = new Date().getTime() - this.lastMove;
        return lastTimeMoved > 8000;
    }

    /**
     * Makes character jump and initializes controlled jump animation
     * Resets jump animation to start from first frame
     * @function
     * @returns {void}
     */
    jump() {
        this.speedY = 22;
        this.jumpAnimationIndex = 0;
        this.isJumping = true;
    }

    /**
     * Plays controlled jump animation from first to last frame
     * Each jump cycle shows complete animation sequence
     * @function
     * @returns {void}
     */
    playJumpAnimation() {
        if (this.isJumping && this.jumpAnimationIndex < this.IMAGES_JUMPING.length) {
            let path = this.IMAGES_JUMPING[this.jumpAnimationIndex];
            this.img = this.imageCache[path];
            this.jumpAnimationIndex++;
            if (this.jumpAnimationIndex >= this.IMAGES_JUMPING.length || !this.isAboveGround()) {
                this.isJumping = false;
                this.jumpAnimationIndex = 0;
            }
        }
    }

    /**
    * Cleans up character intervals when character is destroyed
    * @function
    * @returns {void}
    */
    cleanup() {
        if (this.movingInterval) {
            clearInterval(this.movingInterval);
            this.movingInterval = null;
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
}
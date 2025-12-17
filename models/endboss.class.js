/**
 * Final boss enemy with multiple states and powerful attacks
 * Requires multiple hits to defeat and triggers victory condition
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;
    hadFirstContact = false;
    energy = 10;
    baseSpeed = 2.2;
    currentSpeed = 2.2;
    speedChangeTimer = 0;
    speedChangeDuration = 2000;
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


    /**
     * Creates the final boss enemy with all animations and AI behaviors
     * @constructor
     */
    constructor() {
        super().loadImage(this.IMAGES_ANGRY[0]);
        this.loadImages(this.IMAGES_ANGRY);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 3800;
        this.speed = this.baseSpeed;
        this.currentSpeed = this.baseSpeed;
        this.animate();
    }

    /**
     * Starts all endboss animation and behavior loops
     * Handles walking, alert state, attack, and hurt animations
     * @function
     * @returns {void}
     */
    animate() {
        this.walkInterval = startInterval(() => {
            if (!this.world || !this.world.character || this.world === null) {
                return;
            }
            this.handleEndbossMovement();
        }, 1000 / 60);
        this.createSpeedIntervals();
        this.endbossMovingIntervall();
    }

    /**
     * Handles endboss movement logic and player tracking
     * Controls direction changes, first contact detection, and movement decisions
     * @function
     * @returns {void}
     */
    handleEndbossMovement() {
        this.updateSpeed();
        let playerX = this.world.character.x;
        let endbossX = this.x;
        let distance = playerX - endbossX;
        let deadzone = 10;
        if (playerX >= 3500) {
            this.hadFirstContact = true;
        }
        if (!this.isDead() && this.hadFirstContact) {
            if (distance < -deadzone) {
                this.moveLeft();
                this.otherDirection = false;
            } else if (distance > deadzone) {
                this.moveRight();
                this.otherDirection = true;
            }
        }
    }

    /**
     * Handles endboss animation states based on distance to player and current state
     * Switches between angry, walking, attacking, hurt, and dead animations
     * @function
     * @returns {void}
     */
    endbossMovingIntervall() {
        this.animationInterval = startInterval(() => {
            if (!this.world || !this.world.character) return;
            this.determineEndbossAnimation();
        }, 200);
    }

    /**
     * Determines which animation to play based on endboss state and player distance
     * Handles priority states (dead, hurt) and proximity-based animations
     * @function
     * @returns {void}
     */
    determineEndbossAnimation() {
        let playerX = this.world.character.x;
        let endbossX = this.x;
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
        } else {
            this.playAnimation(this.IMAGES_ANGRY);
        }
    }

    /**
     * Erstellt die Speed-Intervalle einmalig
     * @function
     * @returns {void}
     */
    createSpeedIntervals() {
        this.speedInterval = startInterval(() => {
            this.updateHealthBasedSpeed();
        }, 500);
        this.speedRandomInterval = startInterval(() => {
            this.updateRandomSpeedVariation();
        }, 1500);
    }

    /**
     * Hauptfunktion zur Aktualisierung der Endboss-Geschwindigkeit
     * @function
     * @returns {void}
     */
    updateSpeed() {
        this.speed = this.currentSpeed;
    }

    /**
     * Passt Geschwindigkeit basierend auf Gesundheit an
     * @function
     * @returns {void}
     */
    updateHealthBasedSpeed() {
        if (this.energy <= 3) {
            this.currentSpeed = this.baseSpeed * 1.2;
        } else if (this.energy <= 6) {
            this.currentSpeed = this.baseSpeed * 0.8;
        } else {
            this.currentSpeed = this.baseSpeed;
        }
    }

    /**
     * Fügt zufällige Geschwindigkeitsvariationen hinzu
     * @function
     * @returns {void}
     */
    updateRandomSpeedVariation() {
        const now = new Date().getTime();
        if (now - this.speedChangeTimer > this.speedChangeDuration) {
            const speedVariation = Math.random() * 0.8 + 1.0;
            this.currentSpeed *= speedVariation;
            this.speedChangeTimer = now;
        }
    }

    /**
     * Cleans up endboss intervals when endboss is destroyed
     * @function
     * @returns {void}
     */
    cleanup() {
        if (this.walkInterval) {
            clearInterval(this.walkInterval,);
            this.walkInterval = null;
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.speedRandomInterval) {
            clearInterval(this.speedRandomInterval);
            this.speedRandomInterval = null;
        }
        if (this.speedInterval) {
            clearInterval(this.speedInterval);
            this.speedInterval = null;
        }
    }

}
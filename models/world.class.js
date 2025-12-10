/**
 * Main World class that manages the entire game state and logic
 * Handles rendering, collision detection, audio, and game object interactions
 * @class World
 */
class World {
    character = new Character();
    endboss = new Endboss();
    level = level1;
    canvas;
    ctx;
    keyboard;
    collision;
    cameraX = 0;
    endbossHealthBar = new EndbossHealth();
    statusBar = new Statusbar();
    coinBar = new Coinbar();
    bottleBar = new Bottlebar();
    chickenHouse = new chickenHouse();
    // saloon = new Saloon();
    throwableObjects = [];
    stompedEnemies = [];
    currentBottleCount = 0;
    endbossIsDead = false;
    characterIsDead = false;
    lastThrowTime = 0;
    deathTimeouts = [];
    endbossDeathHandled = false;
    characterDeathHandled = false;
    animatonId = null;
    isDestroyed = false;

    characterDies = new Audio('audio/character_fainting.mp3');
    killedEndboss = new Audio('audio/endboss_fainting.mp3');
    killedChicken = new Audio('audio/chicken_fainting.mp3');
    killedSmallChicken = new Audio('audio/small_chicken_fainting.mp3');
    getHurt = new Audio('audio/get_hurt.mp3');
    collectCoin = new Audio('audio/collect_coin.mp3');
    collectBottle = new Audio('audio/collect_bottle.mp3');
    bottleBreaking = new Audio('audio/bottle_breaking.mp3');
    victorySound = new Audio('audio/victory.mp3');
    loseSound = new Audio('audio/game_over.mp3');
    walking = new Audio('audio/walking.mp3');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.collision = new Collision(this);
        if (sounds.length === 0) {
            sounds.push(this.characterDies,
                this.killedEndboss,
                this.killedChicken,
                this.killedSmallChicken,
                this.getHurt,
                this.collectCoin,
                this.collectBottle,
                this.bottleBreaking,
                this.victorySound,
                this.loseSound,
                this.walking);
            this.animationId = 0;
            this.draw();
            this.setWorld();
            this.run();
            this.collision.collisions();
        }
    }

    /**
     * Sets world reference for character, endboss, and enemies
     * Allows game objects to access world methods and properties
     * @function
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
        this.level.enemies.forEach(e => e.world = this);
    }

    /**
     * Starts the main game loop for throwing objects and collectables
     * Runs collision checks and updates at 200ms intervals
     * @function
     * @returns {void}
     */
    run() {
        startInterval(() => {
            this.checkThrowObjects();
            this.collision.checkCollectableCollisions();
        }, 200);
    }

    /**
 * Checks and handles character and endboss death states
 * Triggers appropriate death animations and screen transitions
 * @method
 * @returns {void}
 */
    checkDeath() {
        this.handleEndbossIsDeadAnimation();
        this.handleCharacterIsDeadAnimation();
    }

    /**
     * Handles endboss death animation and victory sequence
     * Plays death sound and triggers winning screen
     * @function
     * @returns {void}
     */
    handleEndbossIsDeadAnimation() {
        if (this.endboss.energy <= 0 && !this.endbossDeathHandled) {
            this.endbossDeathHandled = true;
            if (!isMuted) {
                this.killedEndboss.play();
            }
            const timeoutId = setTimeout(() => {
                if (this && !this.characterIsDead) {
                    this.endbossIsDead = true;
                    toggleEndScreen(this.endbossIsDead, this.characterIsDead);
                }
            }, 2000);
            this.deathTimeouts.push(timeoutId);
        }
    }

    /**
     * Handles character death animation and game over sequence
     * Plays death sound and triggers losing screen
     * @function
     * @returns {void}
     */
    handleCharacterIsDeadAnimation() {
        if (this.character.energy <= 0 && !this.characterDeathHandled) {
            this.characterDeathHandled = true;
            this.getHurt.muted = true;
            if (!isMuted) {
                this.characterDies.play();
            }
            const timeoutId = setTimeout(() => {
                if (this && !this.endbossIsDead) {
                    this.characterIsDead = true;
                    toggleEndScreen(this.endbossIsDead, this.characterIsDead);
                }
            }, 3000);
            this.deathTimeouts.push(timeoutId);
        }
    }

    /**
 * Cleans up all pending timeouts and resets death states
 * Called before destroying world instance
 * @function
 * @returns {void}
 */
    cleanup() {
        this.isDestroyed = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.deathTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        this.deathTimeouts = [];
        this.endbossDeathHandled = false;
        this.characterDeathHandled = false;
        if (this.character && typeof this.character.cleanup === 'function') {
            this.character.cleanup();
        }
        if (this.endboss && typeof this.endboss.cleanup === 'function') {
            this.endboss.cleanup();
        }
        if (this.collision && typeof this.collision.cleanup === 'function') {
            this.collision.cleanup();
        }
        this.throwableObjects.forEach(bottle => {
            if (bottle && typeof bottle.cleanup === 'function') {
                bottle.cleanup();
            }
        });
    }

    /**
     * Handles throwing bottle objects when space key is pressed
     * Checks cooldown, bottle count, and character state
     * @function
     * @returns {void}
     */
    checkThrowObjects() {
        let currentThrowTime = new Date().getTime();
        if (this.keyboard.SPACE && this.currentBottleCount > 0 && currentThrowTime - this.lastThrowTime >= 750 && !this.character.isDead()) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100);
            bottle.world = this;
            bottle.setThrowDirection(this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.currentBottleCount--;
            this.bottleBar.setPercentageBottle(this.currentBottleCount);
            this.lastThrowTime = currentThrowTime;
        }
    }

    /**
     * Main rendering function that draws all game objects
     * Handles camera movement and layer ordering
     * @function
     * @returns {void}
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.cameraX, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.saloons);

        this.ctx.translate(-this.cameraX, 0); // Back
        // ----- space for fixed objects ----- //
        this.addToMap(this.coinBar);
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleBar);
        this.addEndbossBarToMap();
        this.ctx.translate(this.cameraX, 0); // Forwards

        this.addToMap(this.character);
        this.addEndbossToMap();
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.chickenHouse);
        this.ctx.translate(-this.cameraX, 0);

        if (this.animationId !== null) {
            let self = this;
            this.animationId = requestAnimationFrame(function () {
                if (self && self.animationId !== null && !self.isDestroyed) {
                    self.draw();
                }
            });
        }
    }

    /**
     * Conditionally renders the endboss if alive
     * @function
     * @returns {void}
     */
    addEndbossToMap() {
        if (this.endboss && !this.endbossIsDead) {
            this.addToMap(this.endboss);
        }
    }

    /**
     * Shows endboss health bar when character approaches
     * @function
     * @returns {void}
     */
    addEndbossBarToMap() {
        if (this.character.x >= 3300) {
            this.endbossHealthBar.hadFirstContact = true;
        }
        if (this.endbossHealthBar.hadFirstContact == true) {
            this.addToMap(this.endbossHealthBar);
        }
    }

    /**
     * Renders an array of game objects to the canvas
     * @function
     * @param {Object[]} objects - Array of drawable objects
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Renders a single movable object with direction handling
     * @function
     * @param {MovableObject} mo - The movable object to render
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips image horizontally for objects facing left
     * @function
     * @param {MovableObject} mo - Object to flip
     * @returns {void}
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores normal image orientation after flipping
     * @function
     * @param {MovableObject} mo - Object to restore
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}
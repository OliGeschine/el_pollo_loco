/**
 * Main World class that manages the entire game state and logic
 * Handles rendering, collision detection, audio, and game object interactions
 * @class World
 */
class World {
    character = new Character();
    endboss = new Endboss();
    level = level1;
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;
    canvas;
    ctx; // kurzform für context
    keyboard;
    collision;
    cameraX = 0;
    endbossHealthBar = new EndbossHealth();
    statusBar = new Statusbar();
    coinBar = new Coinbar();
    bottleBar = new Bottlebar();
    chickenHouse = new chickenHouse();
    throwableObjects = [];
    collectedCoins = [];
    collectedBottles = [];
    stompedEnemies = [];
    maxBottles = 5;
    currentBottleCount = 0;
    endbossIsDead = false;
    characterIsDead = false;
    lastThrowTime = 0;

    characterDies = new Audio('audio/character_fainting.mp3');
    killedEndboss = new Audio('audio/endboss_fainting.mp3');
    killedChicken = new Audio('audio/chicken_fainting.mp3');
    killedSmallChicken = new Audio('audio/small_chicken_fainting.mp3');
    getHurt = new Audio('audio/get_hurt.mp3');
    collectCoin = new Audio('audio/collect_coin.mp3');
    collectBottle = new Audio('audio/collect_bottle.mp3');
    bottleBreaking = new Audio('audio/bottle_breaking.mp3');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.collision = new Collision(this);
        sounds.push(this.characterDies);
        sounds.push(this.killedEndboss);
        sounds.push(this.killedChicken);
        sounds.push(this.killedSmallChicken);
        sounds.push(this.getHurt);
        sounds.push(this.collectCoin);
        sounds.push(this.collectBottle);
        sounds.push(this.bottleBreaking);
        this.draw();
        this.setWorld();
        this.run();
        this.collision.collisions();
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
        setTimeout(() => {
            if (this.endboss.energy <= 0) {
                if (!isMuted) {
                    this.killedEndboss.play();
                }
                setTimeout(() => {

                }, 3000);
                setTimeout(() => {
                    this.endbossIsDead = true;
                    console.log('test', this.endbossIsDead);

                    toggleEndScreen(this.endbossIsDead, this.characterIsDead);
                }, 3000);
            }
        })
    }

    /**
     * Handles character death animation and game over sequence
     * Plays death sound and triggers losing screen
     * @function
     * @returns {void}
     */
    handleCharacterIsDeadAnimation() {
        setTimeout(() => {
            if (this.character.energy <= 0) {
                this.getHurt.muted = true;
                if (!isMuted) {
                    this.characterDies.play();
                }
                setTimeout(() => {
                    this.characterIsDead = true;
                    toggleEndScreen(this.endbossIsDead, this.characterIsDead);
                }, 3000);
            }
        })
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
        this.addObjectsToMap(this.collectedCoins);
        this.addObjectsToMap(this.collectedBottles);
        this.addToMap(this.chickenHouse);
        this.ctx.translate(-this.cameraX, 0);

        let self = this
        requestAnimationFrame(function () {
            self.draw();
        });
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
        mo.drawFrame(this.ctx);

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
/**
 * Handles all collision detection and responses in the game
 * Manages character-enemy collisions, projectile hits, and damage systems
 * @class Collision
 */
class Collision {

    /**
     * Creates a new collision detection system for the game world
     * @constructor
     * @param {World} world - Reference to the main game world object
     */
    constructor(world) {
        this.world = world;
    }

    /**
 * Starts collision detection loop for all interactive objects
 * Runs at 10ms intervals for precise collision detection
 * @function
 * @returns {void}
 */
    collisions() {
        startInterval(() => {
            this.checkBottleHitsEnemies();
            this.checkBottleHitsEndboss();
            this.checkCharacterEnemyInteractions();
            this.checkCharacterEndbossInteractions();
        }, 10);
    }

    /**
     * Checks all character interactions with regular enemies
     * Delegates to stomp and damage collision functions
     * @function
     * @returns {void}
     */
    checkCharacterEnemyInteractions() {
        let hasStomped = this.checkStompCollisions();
        if (!hasStomped) {
            this.checkDamageCollisions();
        }
    }

    /**
     * Checks for character stomping on enemies
     * Handles multiple enemy stomps and returns success status
     * @function
     * @returns {boolean} True if any enemies were stomped
     */
    checkStompCollisions() {
        let canStomp = this.world.character.speedY <= 0 && !this.world.character.justStomped;
        if (!canStomp) return false;
        let enemiesInStompRange = this.findEnemiesInStompRange();
        if (enemiesInStompRange.length > 0) {
            this.handleMultipleEnemyStomps(enemiesInStompRange);
            return true;
        }
        return false;
    }

    /**
     * Finds all enemies that can be stomped by the character
     * Returns array of enemies with their indices
     * @function
     * @returns {Array} Array of objects containing enemy and index
     */
    findEnemiesInStompRange() {
        let enemiesInRange = [];
        for (let i = 0; i < this.world.level.enemies.length; i++) {
            const enemy = this.world.level.enemies[i];
            if (!enemy.isDead() && this.world.character.isStomping(enemy, i)) {
                enemiesInRange.push({ enemy: enemy, index: i });
            }
        }
        return enemiesInRange;
    }

    /**
     * Checks for character damage collisions with enemies
     * Only runs if character hasn't recently stomped
     * @function
     * @returns {void}
     */
    checkDamageCollisions() {
        if (this.world.character.justStomped) return;
        for (let i = 0; i < this.world.level.enemies.length; i++) {
            const enemy = this.world.level.enemies[i];
            if (!enemy.isDead()) {
                this.checkEnemyCollisions(enemy);
            }
        }
    }

    /**
     * Handles stomping multiple enemies at once
     * Damages all enemies in stomp range and triggers effects
     * @function
     * @param {Array} enemiesInRange - Array of enemies and their indices
     * @returns {void}
     */
    handleMultipleEnemyStomps(enemiesInRange) {
        this.world.character.justStomped = true;
        enemiesInRange.forEach(({ enemy, index }) => {
            this.damageStompedEnemy(enemy);
        });
        this.world.character.jump();
        setTimeout(() => (this.world.character.justStomped = false), 300);
    }

    /**
     * Damages a single stomped enemy and handles cleanup
     * Plays sound effects and schedules enemy removal
     * @function
     * @param {MovableObject} enemy - The enemy being stomped
     * @returns {void}
     */
    damageStompedEnemy(enemy) {
        enemy.hitWeak();
        this.world.stompedEnemies.push(enemy);
        if (!isMuted) {
            this.world.killedChicken.play();
        }
        setTimeout(() => {
            if (enemy.energy <= 0) {
                const currentIndex = this.world.level.enemies.indexOf(enemy);
                if (currentIndex !== -1) {
                    this.world.level.enemies.splice(currentIndex, 1);
                }
            }
        }, 500);
    }

    /**
     * Checks character interactions specifically with the endboss
     * Handles jumping attacks and collision damage with endboss
     * @function
     * @returns {void}
     */
    checkCharacterEndbossInteractions() {
        if (!this.world.endboss.isDead()) {
            this.checkEndbossCollisions(this.world.endboss);
        }
    }

    /**
     * Handles character jumping on enemies (stomp attacks)
     * Damages enemy, plays sound, and removes dead enemies
     * @function
     * @param {MovableObject} enemy - The enemy being stomped
     * @param {number} enemyIndex - Index of enemy in enemies array
     * @returns {void}
     */
    checkJumpCollisions(enemy, enemyIndex) {
        if (this.world.character.isStomping(enemy, enemyIndex)) {
            enemy.hitWeak();
            this.world.stompedEnemies.push(enemy);
            if (!isMuted) {
                this.world.killedChicken.play();
            }
            setTimeout(() => {
                if (enemy.energy <= 0) {
                    this.world.level.enemies.splice(enemyIndex, 1);
                }
            }, 500)
            this.world.character.jump();
            this.world.character.justStomped = true;
            setTimeout(() => (this.world.character.justStomped = false), 100);
        }
    }

    /**
     * Handles character collision damage from regular enemies
     * Reduces character health and plays hurt sound
     * @function
     * @param {MovableObject} enemy - The enemy causing damage
     * @returns {void}
     */
    checkEnemyCollisions(enemy) {
        if (!this.world.character.justStomped && this.world.character.isColliding(enemy)) {
            this.world.character.hitWeak();
            if (!isMuted) {
                this.world.getHurt.play();
            }
            this.world.statusBar.setPercentageHealth(this.world.character.energy);
        }
        this.world.checkDeath();
    }

    /**
     * Handles character collision damage from endboss
     * Causes stronger damage than regular enemies
     * @function
     * @returns {void}
     */
    checkEndbossCollisions() {
        if (!this.world.character.justStomped && this.world.character.isColliding(this.world.endboss)) {
            this.world.character.hitStrong();
            if (!isMuted) {
                this.world.getHurt.play();
            }
            this.world.statusBar.setPercentageHealth(this.world.character.energy);
        }
        this.world.checkDeath();
    }

    /**
     * Checks if thrown bottles hit any enemies
     * Triggers bottle splash animation and enemy damage
     * @function
     * @returns {void}
     */
    checkBottleHitsEnemies() {
        this.world.throwableObjects.forEach((bottle, bottleIndex) => {
            if (bottle.splashed) return;
            this.processBottleEnemyCollisions(bottle);
        });
    }

    /**
     * Processes collisions between a specific bottle and all enemies
     * Handles damage, sounds, and enemy removal after bottle impact
     * @function
     * @param {ThrowableObject} bottle - The bottle to check collisions for
     * @returns {void}
     */
    processBottleEnemyCollisions(bottle) {
        this.world.level.enemies.forEach((enemy, enemyIndex) => {
            if (!enemy.isDead() && bottle.isColliding(enemy)) {
                bottle.splash();
                if (!isMuted) {
                    this.world.bottleBreaking.play();
                }
                enemy.hitWeak();
                if (!isMuted) {
                    this.world.killedChicken.play();
                }
                setTimeout(() => {
                    if (enemy.energy <= 0) {
                        this.world.level.enemies.splice(enemyIndex, 1);
                    }
                }, 200);
            }
        });
    }

    /**
     * Checks if thrown bottles hit the endboss
     * Triggers bottle splash and endboss damage
     * @function
     * @returns {void}
     */
    checkBottleHitsEndboss() {
        this.world.throwableObjects.forEach((bottle, bottleIndex) => {
            if (bottle.splashed) return;
            this.processBottleEndbossCollision(bottle);
        });
    }

    /**
     * Processes collision between bottle and endboss
     * Handles damage, health bar update, sounds, and death check
     * @function
     * @param {ThrowableObject} bottle - The bottle to check collision for
     * @returns {void}
     */
    processBottleEndbossCollision(bottle) {
        if (!this.world.endboss.isDead() && bottle.isColliding(this.world.endboss) && !bottle.splashed) {
            bottle.splash();
            if (!isMuted) {
                this.world.bottleBreaking.play();
            }
            this.world.endboss.bottleHitEndboss();
            this.world.endbossHealthBar.setPercentageHealthEndboss(this.world.endboss.energy);
            if (!isMuted) {
                this.world.killedChicken.play();
            }
            this.world.checkDeath();
        }
    }

    /**
    * Runs all collectable object collision checks
    * Handles coins and bottles collection
    * @function
    * @returns {void}
    */
    checkCollectableCollisions() {
        setTimeout(() => {
            this.checkCollectedCoins();
            this.checkCollectedBottles();
        }, 10);
    }

    /**
     * Checks collection of bottle collectables
     * Updates bottle count and removes collected bottles
     * @function
     * @returns {void}
     */
    checkCollectedBottles() {
        this.world.level.bottles.forEach((bottle, index) => {
            if (!bottle.collected && this.world.character.isColliding(bottle)) {
                bottle.collected = true;
                if (!isMuted) {
                    this.world.collectBottle.play();
                }
                this.world.level.bottles.splice(index, 1);
                this.world.currentBottleCount++;
                this.world.bottleBar.setPercentageBottle(this.world.currentBottleCount);
            }
        });
    }

    /**
     * Checks collection of coin collectables
     * Updates coin count and removes collected coins
     * @function
     * @returns {void}
     */
    checkCollectedCoins() {
        this.world.level.coins.forEach((coin, index) => {
            if (!coin.collected && this.world.character.isColliding(coin)) {
                coin.collected = true;
                if (!isMuted) {
                    this.world.collectCoin.play();
                }
                this.world.character.coins++;
                this.world.coinBar.setPercentageCoin(this.world.character.coins);
                this.world.level.coins.splice(index, 1);
            }
        });
    }

    /**
     * Cleans up collision intervals when collision system is destroyed
     * @function
     * @returns {void}
     */
    cleanup() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
    }
}
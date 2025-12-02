/**
 * Handles all collision detection and responses in the game
 * Manages character-enemy collisions, projectile hits, and damage systems
 * @class Collision
 */
class Collision {

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
        * Handles jumping on enemies and collision damage
        * @function
        * @returns {void}
        */
    checkCharacterEnemyInteractions() {
        for (let i = 0; i < this.world.level.enemies.length; i++) {
            const enemy = this.world.level.enemies[i];
            if (enemy.isDead()) continue;
            this.checkJumpCollisions(enemy, i);
            this.checkEnemyCollisions(enemy);
        }
    }

    /**
     * Checks character interactions specifically with the endboss
     * Handles jumping attacks and collision damage with endboss
     * @function
     * @returns {void}
     */
    checkCharacterEndbossInteractions() {
        if (!this.world.endboss.isDead()) {
            this.checkJumpEndbossCollision(this.world.endboss);
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
            this.world.character.speedY = 15;
            this.world.character.justStomped = true;
            setTimeout(() => (this.world.character.justStomped = false), 500);
        }
    }

    /**
     * Handles character jumping on the endboss
     * Damages endboss, updates health bar, and triggers death sequence
     * @function
     * @returns {void}
     */
    checkJumpEndbossCollision() {
        if (this.world.character.isStomping(this.world.endboss)) {
            this.world.endboss.hitWeak();
            this.world.endbossHealthBar.setPercentageHealthEndboss(this.world.endboss.energy);
            if (!isMuted) {
                this.world.killedChicken.play();
            }
            setTimeout(() => {
                if (this.world.endboss.energy <= 0) {
                    if (!isMuted) {
                        this.world.killedEndboss.play();
                    }
                    setTimeout(() => {
                        this.world.endbossIsDead = true;
                    }, 3000);
                }
            })
            this.world.character.speedY = 15;
            this.world.character.justStomped = true;
            setTimeout(() => (this.world.character.justStomped = false), 500);
        }
        this.world.handleEndbossIsDeadAnimation();
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
                this.getHurt.play();
            }
            this.world.statusBar.setPercentageHealth(this.world.character.energy);
            console.log('energy:', this.world.character.energy);

        }
        this.world.handleCharacterIsDeadAnimation();
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
            console.log('energy:', this.world.character.energy);
        }
        this.world.handleCharacterIsDeadAnimation();
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
                    }, 200)
                }
            });
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
                this.world.handleEndbossIsDeadAnimation();
            }
        })
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
                    this.collectBottle.play();
                }
                this.world.level.bottles.splice(index, 1);
                this.world.currentBottleCount++;
                this.world.bottleBar.setPercentageBottle(this.world.currentBottleCount);
            }
        });
    }

    /**
     * Runs all collectable object collision checks
     * Handles coins and bottles collection
     * @function
     * @returns {void}
     */
    checkCollectableCollisions() {
        this.checkCollectedCoins();
        this.checkCollectedBottles();
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


}
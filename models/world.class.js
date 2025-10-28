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
    cameraX = 0;
    endbossHealthBar = new EndbossHealth();
    statusBar = new Statusbar();
    coinBar = new Coinbar();
    bottleBar = new Bottlebar();
    throwableObjects = [];
    // collectableObjects = [];
    collectedCoins = [];
    collectedBottles = [];
    stompedEnemies = [];
    maxBottles = 5;
    currentBottleCount = 0;
    endbossIsDead = false;
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
        this.collisions();
    }

    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
        this.level.enemies.forEach(e => e.world = this);
        // this.setCollectableObjects();
    }

    run() {
        startInterval(() => {
            // this.checkEnemyCollisions();
            this.checkThrowObjects();
            this.checkCollectableCollisions();
        }, 200);
    }

    // collisions() {
    //     setInterval(() => {
    //         this.checkBottleHitsEnemies();
    //         this.checkJumpCollisions();
    //         this.checkEnemyCollisions();
    //     }, 10);
    // }

    collisions() {
        startInterval(() => {
            this.checkBottleHitsEnemies();
            this.checkBottleHitsEndboss();
            this.checkCharacterEnemyInteractions();
            this.checkCharacterEndbossInteractions();
        }, 10);
    }

    checkCharacterEnemyInteractions() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            if (enemy.isDead()) continue;
            this.checkJumpCollisions(enemy, i);
            this.checkEnemyCollisions(enemy);
        }
    }

    checkCharacterEndbossInteractions() {
        if (!this.endboss.isDead()) {
            this.checkJumpEndbossCollision(this.endboss);
            this.checkEndbossCollisions(this.endboss);
        }
    }

    checkJumpCollisions(enemy, enemyIndex) {
        if (this.character.isStomping(enemy, enemyIndex)) {
            enemy.hit();
            this.stompedEnemies.push(enemy);
            this.killedChicken.play();
            setTimeout(() => {
                if (enemy.energy <= 0) {
                    this.level.enemies.splice(enemyIndex, 1);
                }
            }, 500)
            this.character.speedY = 15;
            this.character.justStomped = true;
            setTimeout(() => (this.character.justStomped = false), 500);
        }
    }

    checkJumpEndbossCollision() {
        if (this.character.isStomping(this.endboss)) {
            this.endboss.hit();
            this.endbossHealthBar.setPercentageHealth(this.endboss.energy);
            this.killedChicken.play();
            setTimeout(() => {
                if (this.endboss.energy <= 0) {
                    this.killedEndboss.play();
                    setTimeout(() => {
                        this.endbossIsDead = true;
                    }, 3000);
                }
            })
            this.character.speedY = 15;
            this.character.justStomped = true;
            setTimeout(() => (this.character.justStomped = false), 500);
        }
        this.handleEndbossIsDeadAnimation();
    }

    checkEnemyCollisions(enemy) {
        if (!this.character.justStomped && this.character.isColliding(enemy)) {
            this.character.hit();
            this.getHurt.play();
            this.statusBar.setPercentageHealth(this.character.energy);
        }
        this.handleCharacterIsDeadAnimation();
    }

    checkEndbossCollisions() {
        if (!this.character.justStomped && this.character.isColliding(this.endboss)) {
            this.character.hit();
            this.getHurt.play();
            this.statusBar.setPercentageHealth(this.character.energy);
        }
        this.handleCharacterIsDeadAnimation();
    }


    // checkCharacterEnemyInteractions() {
    //     this.level.enemies.forEach((enemy, enemyIndex) => {
    //         if (!enemy.isDead() && this.character.isStomping(enemy)) {
    //             enemy.hit();
    //             this.character.speedY = 15;
    //             setTimeout(() => {
    //                 this.level.enemies.splice(enemyIndex, 1);
    //             }, 250);
    //         } else if (!enemy.isDead() && this.character.isColliding(enemy)) {
    //             this.character.hit();
    //             this.statusBar.setPercentageHealth(this.character.energy);
    //         }
    //     });
    // }

    checkBottleHitsEnemies() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            if (bottle.splashed) return;
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (!enemy.isDead() && bottle.isColliding(enemy)) {
                    bottle.splashed = true;
                    bottle.splash();
                    this.bottleBreaking.play();
                    enemy.hit();
                    this.killedChicken.play();
                    setTimeout(() => {
                        if (enemy.energy <= 0) {
                            this.level.enemies.splice(enemyIndex, 1);
                        }
                    }, 200)
                }
            });
        });
    }

    checkBottleHitsEndboss() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            if (bottle.splashed) return;
            if (!this.endboss.isDead() && bottle.isColliding(this.endboss) && !bottle.splashed) {
                bottle.splashed = true;
                bottle.splash();
                this.bottleBreaking.play();
                this.endboss.hit();
                this.endbossHealthBar.setPercentageHealth(this.endboss.energy);
                this.killedChicken.play();
                this.handleEndbossIsDeadAnimation();
            }
        })
    }

    handleEndbossIsDeadAnimation() {
        setTimeout(() => {
            if (this.endboss.energy <= 0) {
                this.killedEndboss.play();
                setTimeout(() => {
                    this.endbossIsDead = true;
                }, 3000);
                setTimeout(() => {
                    showWinningScreen();
                }, 3000);
            }
        })
    }

    handleCharacterIsDeadAnimation() {
        setTimeout(() => {
            if (this.character.energy <= 0) {
                this.getHurt.muted = true;
                this.characterDies.play();
                setTimeout(() => {
                }, 3000);
                setTimeout(() => {
                    showLosingScreen();
                }, 3000);
            }
        })
    }


    // setCollectableObjects() {
    //     // this.setCoins();
    //     // this.setBottles();
    // };

    // setCoins() {
    //     for (let i = 0; i < 5; i++) {
    //         let coins = new Coin();
    //         this.collectedCoins.push(coins);
    //     }
    // }

    // varainte 1

    // setBottles() {
    //     for (let i = 0; i < 5; i++) {
    //         let bottle = new Bottle();
    //         this.collectedBottles.push(bottle);
    //     }
    // }


    //variante 2

    // setBottles() {
    //     this.setNextBottle();
    // }

    // setNextBottle() {
    //     if (this.currentBottleCount < this.maxBottles) {
    //         let bottle = new Bottle();
    //         this.collectedBottles.push(bottle);
    //     }
    // }

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

    checkCollectedBottles() {
        this.level.bottles.forEach((bottle, index) => {
            if (!bottle.collected && this.character.isColliding(bottle)) {
                bottle.collected = true;
                this.collectBottle.play();
                this.level.bottles.splice(index, 1);
                this.currentBottleCount++;
                this.bottleBar.setPercentageBottle(this.currentBottleCount);
                console.log('Collected Bottle! Total:', this.currentBottleCount);
            }
        });
    }

    checkCollectableCollisions() {
        this.checkCollectedCoins();
        this.checkCollectedBottles();
    }

    checkCollectedCoins() {
        this.level.coins.forEach((coin, index) => {
            if (!coin.collected && this.character.isColliding(coin)) {
                coin.collected = true;
                this.collectCoin.play();
                this.character.coins++;
                this.coinBar.setPercentageCoin(this.character.coins);
                this.level.coins.splice(index, 1);
                console.log('Collected Coin! Total:', this.character.coins);
            }
        });
    }

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
        this.ctx.translate(-this.cameraX, 0);


        let self = this // muss so gehandhabt werden, da "this" innerhalb der Funktion nicht erkannt wird
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addEndbossToMap() {
        if (this.endboss && !this.endbossIsDead) {
            this.addToMap(this.endboss);
        }
    }

    addEndbossBarToMap() {
        if (this.character.x >= 2160) {
            this.endbossHealthBar.hadFirstContact = true;
        }
        if (this.endbossHealthBar.hadFirstContact == true) {
            this.addToMap(this.endbossHealthBar);
        }
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

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

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}
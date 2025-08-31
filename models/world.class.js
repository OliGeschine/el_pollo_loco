class World {
    character = new Character();
    level = level1;
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;
    canvas;
    ctx; // kurzform für context
    keyboard;
    cameraX = 0;
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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.collisions();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(e => e.world = this);
        this.setCollectableObjects();
    }

    run() {
        setInterval(() => {
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
        setInterval(() => {
            this.checkBottleHitsEnemies();
            this.checkCharacterEnemyInteractions();
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

    checkJumpCollisions(enemy, i) {
        if (this.character.isStomping(enemy)) {
            enemy.hit();
            this.stompedEnemies.push(enemy);
            // console.log('hit enemy count:', this.stompedEnemies);
            this.level.enemies.splice(i, 1);
            this.character.speedY = 15;
            this.character.justStomped = true;
            setTimeout(() => (this.character.justStomped = false), 200);
        }
    }

    checkEnemyCollisions(enemy) {
        if (!this.character.justStomped && this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBar.setPercentageHealth(this.character.energy);
        }
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
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (!enemy.isDead() && bottle.isColliding(enemy)) {
                    console.log('Kollision!', bottle.x, bottle.y, enemy.x, enemy.y);
                    enemy.hit();
                    this.throwableObjects.splice(bottleIndex, 1);
                    setTimeout(() => {
                        if (enemy.energy <= 0) {
                            if (enemy instanceof Endboss) {
                                setTimeout(() => {
                                    this.level.enemies.splice(enemyIndex, 1)
                                }, 3000)
                            } else
                                this.level.enemies.splice(enemyIndex, 1);
                        }
                    }, 300)
                }
            });
        });
    }


    setCollectableObjects() {
        this.setCoins();
        this.setBottles();
    };

    setCoins() {
        for (let i = 0; i < 5; i++) {
            let coins = new Coin();
            this.collectedCoins.push(coins);
        }
    }

    // varainte 1

    // setBottles() {
    //     for (let i = 0; i < 5; i++) {
    //         let bottle = new Bottle();
    //         this.collectedBottles.push(bottle);
    //     }
    // }


    //variante 2

    setBottles() {
        this.setNextBottle();
    }

    setNextBottle() {
        if (this.currentBottleCount < this.maxBottles) {
            let bottle = new Bottle();
            this.collectedBottles.push(bottle);
        }
    }

    // varainte 3

    // setBottles() {
    //     let bottleCounter = 0;
    //     let maxBottles = 5;

    //     let intervallId = setInterval(() => {

    //         let bottle = new Bottle();
    //         this.collectedBottles.push(bottle);
    //         bottleCounter++;

    //         if (bottleCounter >= maxBottles) {
    //             clearInterval(intervallId);
    //             console.log('Finished setting Bottles.');
    //         }
    //     }, 2000);

    // }

    checkThrowObjects() {
        if (this.keyboard.SPACE && this.currentBottleCount > 0) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.currentBottleCount--;
            this.bottleBar.setPercentageBottle(this.currentBottleCount);
            this.setNextBottle();
        }
    }

    checkCollectableCollisions() {
        this.checkCollectedCoins();
        this.checkCollectedBottles();
    }

    checkCollectedCoins() {
        this.collectedCoins.forEach((mo, index) => {
            if (this.character.isColliding(mo)) {
                mo.collectCoin(this.character);
                this.coinBar.setPercentageCoin(this.character.coins);
                this.collectedCoins.splice(index, 1);
                // console.log('Collected coin! Total:', this.character.coins);
            }
        });
    }

    checkCollectedBottles() {
        this.collectedBottles.forEach((mo, index) => {
            if (this.character.isColliding(mo)) {
                mo.collectBottle(this);
                this.bottleBar.setPercentageBottle(this.currentBottleCount); // optional
                this.collectedBottles.splice(index, 1);
                console.log('Collected Bottles! Total:', this.currentBottleCount);
                this.setNextBottle();
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
        this.ctx.translate(this.cameraX, 0); // Forwards

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.collectedCoins);
        this.addObjectsToMap(this.collectedBottles);
        this.ctx.translate(-this.cameraX, 0);


        let self = this // muss so gehandhabt werden, da "this" innerhalb der Funktion nicht erkannt wird
        requestAnimationFrame(function () {
            self.draw();
        });
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
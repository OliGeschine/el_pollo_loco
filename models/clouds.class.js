/**
 * Background cloud object that moves slowly across the screen
 * Provides visual atmosphere and depth to the game world
 * @class
 * @extends MovableObject
 */
class Clouds extends MovableObject {
    height = 300;
    width = 400;
    y = 10;
    startX;
    movingRight = false;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.startX = this.x;
        this.speed = 0.3;
        this.animate();
    }

    /**
     * Starts the cloud's oscillating movement
     * Moves cloud 500px left, then 500px right in continuous cycle
     * @function
     * @returns {void}
     */
    animate() {
        this.movingInterval = startInterval(() => {
            if (!this.movingRight) {
                this.moveLeft();
                if (this.x <= this.startX - 200) {
                    this.movingRight = true;
                }
            } else {
                this.moveRight();
                if (this.x >= this.startX) {
                    this.movingRight = false;
                }
            }
        }, 1000 / 60);
    }

    /**
 * Cleans up cloud intervals when cloud is destroyed
 * @function
 * @returns {void}
 */
    cleanup() {
        if (this.movingInterval) {
            clearInterval(this.movingInterval);
            this.movingInterval = null;
        }
    }
}
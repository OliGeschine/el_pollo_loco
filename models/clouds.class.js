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

    constructor(imagePath) {
        super().loadImage(imagePath);

        this.x = Math.random() * 600;
        this.animate();
    }

    /**
     * Starts the cloud's continuous leftward movement
     * Moves cloud left to create scrolling sky effect
     * @function
     * @returns {void}
     */
    animate() {
        this.moveLeft();
    };
}
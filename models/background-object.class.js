class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    /**
     * Creates a new background object for level scenery
     * @constructor
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X-coordinate position for the background
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
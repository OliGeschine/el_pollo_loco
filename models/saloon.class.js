class Saloon extends MovableObject {
    height = 500;
    width = 300;
    y = -60;

    /**
     * Creates a new saloon background object
     * @constructor
     * @param {string} imagePath - Path to the saloon image
     * @param {number} x - X-coordinate position for the saloon
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
    }
}
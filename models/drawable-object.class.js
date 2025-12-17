/**
 * Base class for all drawable objects in the game
 * Handles image loading, caching, and basic positioning
 * @class
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Loads a single image and sets it as the object's image
     * @function
     * @param {string} path - Path to the image file
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path;
    }

    /**
 * Draws the object on the provided canvas context
 * @function
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        // this.drawFrame(ctx);
    }

    /**
 * Draws collision frame around object for debugging
 * @function
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @returns {void}
 */
    // drawFrame(ctx) {
    //     if (this instanceof Character || this instanceof Coin || this instanceof Bottle) {
    //         ctx.beginPath();
    //         ctx.lineWidth = '1';
    //         ctx.strokeStyle = 'red';
    //         ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right - this.offset.left, this.height - this.offset.top - this.offset.bottom);
    //         ctx.stroke();
    //     }
    // }

    /**
 * Loads multiple images and stores them in image cache
 * @function
 * @param {string[]} arr - Array of image file paths
 * @returns {void}
 */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}

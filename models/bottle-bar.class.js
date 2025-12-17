/**
 * UI status bar showing collected bottle count
 * Updates visual representation based on bottles collected
 * @class
 * @extends DrawableObject
 */
class Bottlebar extends DrawableObject {
    IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ];

    percentageBottle = 0;

    /**
     * Creates a new bottle status bar for displaying collected bottles
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLE);
        this.x = 10;
        this.y = 90;
        this.height = 60;
        this.width = 200;
        this.setPercentageBottle(0);
    }

    /**
     * Updates bottle bar display based on collected bottles
     * @function
     * @returns {void}
     */
    setPercentageBottle(percentageBottle) {
        this.percentageBottle = percentageBottle;
        let path = this.IMAGES_BOTTLE[this.addCollectedBottle()];
        this.img = this.imageCache[path];
    }

    /**
 * Determines which bottle bar image to display
 * Maps bottle count to appropriate visual representation
 * @function
 * @returns {number} Index of image to display from IMAGES_BOTTLE array
 */
    addCollectedBottle() {
        if (this.percentageBottle == 10) {
            return 5;
        } else if (this.percentageBottle >= 8) {
            return 4;
        } else if (this.percentageBottle >= 6) {
            return 3;
        } else if (this.percentageBottle >= 3) {
            return 2;
        } else if (this.percentageBottle > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}
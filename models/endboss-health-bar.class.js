/**
 * UI status bar showing endboss health with color-coded states
 * Changes color from blue (full) to red (empty) based on health
 * @class
 * @extends DrawableObject
 */
class EndbossHealth extends DrawableObject {
    IMAGES_ENDBOSSHEALTH = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ];

    percentageHealthEndboss = 10;

    /**
     * Creates a new endboss health status bar
     * @constructor
     */    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSSHEALTH);
        this.x = 500;
        this.y = -10;
        this.height = 60;
        this.width = 200;
        this.setPercentageHealthEndboss(10);
    }

    /**
     * Updates the endboss health bar display based on current health
     * Changes the visual bar image and color to reflect health level
     * @function
     * @param {number} percentageHealthEndboss - Current endboss health value
     * @returns {void}
     */
    setPercentageHealthEndboss(percentageHealthEndboss) {
        this.percentageHealthEndboss = percentageHealthEndboss;
        let path = this.IMAGES_ENDBOSSHEALTH[this.resolveEndbossHealthImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which health bar image to display based on health value
     * Maps health ranges to appropriate color-coded visual representation
     * @function
     * @returns {number} Index of image to display from IMAGES_ENDBOSSHEALTH array
     */
    resolveEndbossHealthImageIndex() {
        if (this.percentageHealthEndboss == 10) {
            return 5;
        } else if (this.percentageHealthEndboss >= 8) {
            return 4;
        } else if (this.percentageHealthEndboss >= 6) {
            return 3;
        } else if (this.percentageHealthEndboss >= 4) {
            return 2;
        } else if (this.percentageHealthEndboss >= 2) {
            return 1;
        } else {
            return 0;
        }
    }

}
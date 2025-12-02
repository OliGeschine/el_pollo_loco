/**
 * UI status bar showing character health with color-coded states
 * Changes color from blue (full) to red (empty) based on health
 * @class
 * @extends DrawableObject
 */
class Statusbar extends DrawableObject {
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    percentageHealth = 50;

    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 10;
        this.y = -10;
        this.height = 60;
        this.width = 200;
        this.setPercentageHealth(50);
    }

    /**
     * Updates the character health bar display based on current health
     * Changes the visual bar image and color to reflect health level
     * @function
     * @param {number} percentageHealth - Current character health value
     * @returns {void}
     */
    setPercentageHealth(percentageHealth) {
        this.percentageHealth = percentageHealth;
        let path = this.IMAGES_HEALTH[this.resolveHealthImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which health bar image to display based on health value
     * Maps health ranges to appropriate color-coded visual representation
     * @function
     * @returns {number} Index of image to display from IMAGES_HEALTH array
     */
    resolveHealthImageIndex() {
        if (this.percentageHealth == 50) {
            return 5;
        } else if (this.percentageHealth >= 40) {
            return 4;
        } else if (this.percentageHealth >= 30) {
            return 3;
        } else if (this.percentageHealth >= 20) {
            return 2;
        } else if (this.percentageHealth >= 1) {
            return 1;
        } else {
            return 0;
        }
    }



}
/**
 * UI status bar showing collected coin count
 * Updates visual representation based on coins collected
 * @class
 * @extends DrawableObject
 */
class Coinbar extends DrawableObject {
    IMAGES_COINS = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    percentageCoin = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES_COINS);
        this.x = 10;
        this.y = 40;
        this.height = 60;
        this.width = 200;
        this.setPercentageCoin(0);
    }

    /**
 * Updates the coin bar display based on collected coins
 * Changes the visual bar image to reflect current coin count
 * @function
 * @param {number} percentageCoin - Number of coins collected
 * @returns {void}
 */
    setPercentageCoin(percentageCoin) {
        this.percentageCoin = percentageCoin;
        let path = this.IMAGES_COINS[this.addCollectedCoin()];
        this.img = this.imageCache[path];
    }

    /**
 * Determines which coin bar image to display based on coin count
 * Maps coin count ranges to appropriate visual representation
 * @function
 * @returns {number} Index of image to display from IMAGES_COINS array
 */
    addCollectedCoin() {
        if (this.percentageCoin == 5) {
            return 5;
        } else if (this.percentageCoin > 3) {
            return 4;
        } else if (this.percentageCoin > 2) {
            return 3;
        } else if (this.percentageCoin > 1) {
            return 2;
        } else if (this.percentageCoin > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}
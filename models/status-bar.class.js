/**
 * Universal status bar class for all game UI indicators
 * Handles health, coins, bottles, and endboss health with one unified interface
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    static TYPES = {
        HEALTH: 'health',
        COINS: 'coins',
        BOTTLES: 'bottles',
        ENDBOSS_HEALTH: 'endboss_health'
    };

    IMAGE_SETS = {
        [StatusBar.TYPES.HEALTH]: [
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
        ],
        [StatusBar.TYPES.COINS]: [
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
        ],
        [StatusBar.TYPES.BOTTLES]: [
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
        ],
        [StatusBar.TYPES.ENDBOSS_HEALTH]: [
            'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
            'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
            'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
            'img/7_statusbars/2_statusbar_endboss/green/green60.png',
            'img/7_statusbars/2_statusbar_endboss/green/green80.png',
            'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
        ]
    };

    POSITIONS = {
        [StatusBar.TYPES.HEALTH]: { x: 10, y: -10 },
        [StatusBar.TYPES.COINS]: { x: 10, y: 40 },
        [StatusBar.TYPES.BOTTLES]: { x: 10, y: 90 },
        [StatusBar.TYPES.ENDBOSS_HEALTH]: { x: 500, y: -10 }
    };

    INITIAL_VALUES = {
        [StatusBar.TYPES.HEALTH]: 50,
        [StatusBar.TYPES.COINS]: 0,
        [StatusBar.TYPES.BOTTLES]: 0,
        [StatusBar.TYPES.ENDBOSS_HEALTH]: 10
    };

    MAX_VALUES = {
        [StatusBar.TYPES.HEALTH]: 50,
        [StatusBar.TYPES.COINS]: 5,
        [StatusBar.TYPES.BOTTLES]: 10,
        [StatusBar.TYPES.ENDBOSS_HEALTH]: 10
    };

    /**
     * Creates a new universal status bar of specified type
     * @constructor
     * @param {string} type - Type of status bar from StatusBar.TYPES
     */
    constructor(type) {
        super();
        if (!StatusBar.TYPES[type.toUpperCase()]) {
            throw new Error(`Invalid status bar type: ${type}`);
        }
        this.type = type;
        this.value = this.INITIAL_VALUES[type];
        this.maxValue = this.MAX_VALUES[type];
        this.initializeStatusBar();
    }

    /**
     * Initializes the status bar with appropriate settings
     * @function
     * @returns {void}
     */
    initializeStatusBar() {
        const images = this.IMAGE_SETS[this.type];
        const position = this.POSITIONS[this.type];
        this.loadImages(images);
        this.x = position.x;
        this.y = position.y;
        this.height = 60;
        this.width = 200;
        this.updateDisplay();
    }

    /**
     * Updates the current value and refreshes display
     * @function
     * @param {number} newValue - New value to set
     * @returns {void}
     */
    setValue(newValue) {
        this.value = Math.max(0, Math.min(newValue, this.maxValue));
        this.updateDisplay();
    }

    /**
     * Gets the current value
     * @function
     * @returns {number} Current value
     */
    getValue() {
        return this.value;
    }

    /**
     * Adds to the current value (useful for collectibles)
     * @function
     * @param {number} amount - Amount to add
     * @returns {void}
     */
    addValue(amount) {
        this.setValue(this.value + amount);
    }

    /**
     * Subtracts from the current value (useful for health/damage)
     * @function
     * @param {number} amount - Amount to subtract
     * @returns {void}
     */
    subtractValue(amount) {
        this.setValue(this.value - amount);
    }

    /**
     * Updates the visual display based on current value
     * @function
     * @returns {void}
     */
    updateDisplay() {
        const imageIndex = this.calculateImageIndex();
        const imagePath = this.IMAGE_SETS[this.type][imageIndex];
        this.img = this.imageCache[imagePath];
    }

    /**
     * Calculates which image index to use based on current value
     * @function
     * @returns {number} Image index from 0-5
     */
    calculateImageIndex() {
        switch (this.type) {
            case StatusBar.TYPES.HEALTH:
                return this.getHealthImageIndex();
            case StatusBar.TYPES.COINS:
                return this.getCoinImageIndex();
            case StatusBar.TYPES.BOTTLES:
                return this.getBottleImageIndex();
            case StatusBar.TYPES.ENDBOSS_HEALTH:
                return this.getEndbossHealthImageIndex();
            default:
                return 0;
        }
    }

    /**
     * Determines health bar image index based on health value
     * @function
     * @returns {number} Image index for health display
     */
    getHealthImageIndex() {
        if (this.value === 50) return 5;
        if (this.value >= 40) return 4;
        if (this.value >= 30) return 3;
        if (this.value >= 20) return 2;
        if (this.value >= 1) return 1;
        return 0;
    }

    /**
     * Determines coin bar image index based on coin count
     * @function
     * @returns {number} Image index for coin display
     */
    getCoinImageIndex() {
        if (this.value === 5) return 5;
        if (this.value > 3) return 4;
        if (this.value > 2) return 3;
        if (this.value > 1) return 2;
        if (this.value > 0) return 1;
        return 0;
    }

    /**
     * Determines bottle bar image index based on bottle count
     * @function
     * @returns {number} Image index for bottle display
     */
    getBottleImageIndex() {
        if (this.value === 10) return 5;
        if (this.value >= 8) return 4;
        if (this.value >= 6) return 3;
        if (this.value >= 3) return 2;
        if (this.value > 0) return 1;
        return 0;
    }

    /**
     * Determines endboss health bar image index based on health value
     * @function
     * @returns {number} Image index for endboss health display
     */
    getEndbossHealthImageIndex() {
        if (this.value === 10) return 5;
        if (this.value >= 8) return 4;
        if (this.value >= 6) return 3;
        if (this.value >= 4) return 2;
        if (this.value >= 2) return 1;
        return 0;
    }

    /**
     * Checks if the status bar is at maximum value
     * @function
     * @returns {boolean} True if at maximum
     */
    isAtMaximum() {
        return this.value >= this.maxValue;
    }

    /**
     * Checks if the status bar is empty/at minimum
     * @function
     * @returns {boolean} True if empty
     */
    isEmpty() {
        return this.value <= 0;
    }

    /**
     * Gets the percentage of current value relative to maximum
     * @function
     * @returns {number} Percentage from 0 to 100
     */
    getPercentage() {
        return Math.round((this.value / this.maxValue) * 100);
    }

    /**
     * Resets the status bar to its initial value
     * @function
     * @returns {void}
     */
    reset() {
        this.setValue(this.INITIAL_VALUES[this.type]);
    }

    /**
     * Creates a health status bar instance
     * @static
     * @returns {StatusBar} Health status bar
     */
    static createHealthBar() {
        return new StatusBar(StatusBar.TYPES.HEALTH);
    }

    /**
     * Creates a coin status bar instance
     * @static
     * @returns {StatusBar} Coin status bar
     */
    static createCoinBar() {
        return new StatusBar(StatusBar.TYPES.COINS);
    }

    /**
     * Creates a bottle status bar instance
     * @static
     * @returns {StatusBar} Bottle status bar
     */
    static createBottleBar() {
        return new StatusBar(StatusBar.TYPES.BOTTLES);
    }

    /**
     * Creates an endboss health status bar instance
     * @static
     * @returns {StatusBar} Endboss health status bar
     */
    static createEndbossHealthBar() {
        return new StatusBar(StatusBar.TYPES.ENDBOSS_HEALTH);
    }
}

class Statusbar extends StatusBar {
    constructor() {
        super(StatusBar.TYPES.HEALTH);
    }
    setPercentageHealth(value) {
        this.setValue(value);
    }
}

class Coinbar extends StatusBar {
    constructor() {
        super(StatusBar.TYPES.COINS);
    }
    setPercentageCoin(value) {
        this.setValue(value);
    }
}

class Bottlebar extends StatusBar {
    constructor() {
        super(StatusBar.TYPES.BOTTLES);
    }
    setPercentageBottle(value) {
        this.setValue(value);
    }
}

class EndbossHealth extends StatusBar {
    constructor() {
        super(StatusBar.TYPES.ENDBOSS_HEALTH);
    }
    setPercentageHealthEndboss(value) {
        this.setValue(value);
    }
}
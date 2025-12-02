/**
 * Base class for objects that can be collected by the player
 * Handles collection state and provides collection methods for different types
 * @class
 * @extends MovableObject
 */
class CollectableObject extends MovableObject {
    collected = false;
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    constructor() {
        super();

    }

    /**
 * Collects a coin and increments character's coin count
 * Prevents double collection by checking collected state
 * @function
 * @param {Character} character - The character collecting the coin
 * @returns {void}
 */
    collectCoin(character) {
        if (!this.collected) {
            this.collected = true;
            character.coins++;
        }
    }

    /**
 * Collects a bottle and updates world bottle count and UI
 * Prevents double collection and updates bottle status bar
 * @function
 * @param {World} world - The world instance containing bottle data
 * @returns {void}
 */
    collectBottle(world) {
        if (!this.collected) {
            this.collected = true;
            world.currentBottleCount++;
            world.bottleBar.setPercentageBottle(world.currentBottleCount);
        }
        console.log('number of Bottles=', world.currentBottleCount);
    }

}
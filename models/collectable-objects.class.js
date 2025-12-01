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

    collectCoin(character) {
        if (!this.collected) {
            this.collected = true;
            character.coins++;
        }
    }

    collectBottle(world) {
        if (!this.collected) {
            this.collected = true;
            world.currentBottleCount++;
            world.bottleBar.setPercentageBottle(world.currentBottleCount);
        }
        console.log('number of Bottles=', world.currentBottleCount);
    }

}
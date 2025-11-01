class chickenHouse extends DrawableObject {
    height = 450;
    width = 450;
    y = 50;
    otherDirection = true;

    constructor() {
        super().loadImage('img/icons/chicken_house.png');
        this.x = 4000;
    }


}
class Saloon extends MovableObject {
    height = 500;
    width = 300;
    y = -60;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
    }
}
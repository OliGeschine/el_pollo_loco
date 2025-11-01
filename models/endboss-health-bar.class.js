class EndbossHealth extends DrawableObject {
    IMAGES_ENDBOSSHEALTH = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ];

    percentageHealth = 10;

    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSSHEALTH);
        this.x = 500;
        this.y = -10;
        this.height = 60;
        this.width = 200;
        this.setPercentageHealth(10);
    }

    setPercentageHealth(percentageHealth) {
        this.percentageHealth = percentageHealth;
        let path = this.IMAGES_ENDBOSSHEALTH[this.resolveHealthImageIndex()];
        this.img = this.imageCache[path];
    }


    resolveHealthImageIndex() {
        if (this.percentageHealth == 10) {
            return 5;
        } else if (this.percentageHealth >= 8) {
            return 4;
        } else if (this.percentageHealth >= 6) {
            return 3;
        } else if (this.percentageHealth >= 4) {
            return 2;
        } else if (this.percentageHealth >= 2) {
            return 1;
        } else {
            return 0;
        }
    }



}
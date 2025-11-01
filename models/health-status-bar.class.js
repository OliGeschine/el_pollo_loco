class Statusbar extends DrawableObject {
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    percentageHealth = 20;

    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 10;
        this.y = -10;
        this.height = 60;
        this.width = 200;
        this.setPercentageHealth(20);
    }

    setPercentageHealth(percentageHealth) {
        this.percentageHealth = percentageHealth;
        let path = this.IMAGES_HEALTH[this.resolveHealthImageIndex()];
        this.img = this.imageCache[path];
    }


    resolveHealthImageIndex() {
        if (this.percentageHealth == 20) {
            return 5;
        } else if (this.percentageHealth >= 16) {
            return 4;
        } else if (this.percentageHealth >= 12) {
            return 3;
        } else if (this.percentageHealth >= 8) {
            return 2;
        } else if (this.percentageHealth >= 4) {
            return 1;
        } else {
            return 0;
        }
    }



}
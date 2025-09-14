class EndbossHealth extends DrawableObjcet {
    IMAGES_ENDBOSSHEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    percentageHealth = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSSHEALTH);
        this.x = 500;
        this.y = -10;
        this.height = 60;
        this.width = 200;
        this.setPercentageHealth(100);
    }

    setPercentageHealth(percentageHealth) {
        this.percentageHealth = percentageHealth;
        let path = this.IMAGES_ENDBOSSHEALTH[this.resolveHealthImageIndex()];
        this.img = this.imageCache[path];
    }


    resolveHealthImageIndex() {
        if (this.percentageHealth == 100) {
            return 5;
        } else if (this.percentageHealth > 80) {
            return 4;
        } else if (this.percentageHealth > 60) {
            return 3;
        } else if (this.percentageHealth > 40) {
            return 2;
        } else if (this.percentageHealth > 20) {
            return 1;
        } else {
            return 0;
        }
    }



}
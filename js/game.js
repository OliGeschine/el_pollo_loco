let canvas;
let world;
let keyboard = new Keyboard();
let sounds = [];
let isMuted = false;

backgroundSound = new Audio('audio/background_music.mp3');
backgroundSound.loop = true;
victorySound = new Audio('audio/victory.mp3');
loseSound = new Audio('audio/game_over.mp3');

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    this.backgroundSound.play();
    sounds.push(backgroundSound);
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
});
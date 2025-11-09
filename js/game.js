let canvas;
let world;
let keyboard = new Keyboard();
let sounds = [];
let isMuted = localStorage.getItem('isMuted') === 'true';

backgroundSound = new Audio('audio/background_music.mp3');
backgroundSound.loop = true;
victorySound = new Audio('audio/victory.mp3');
loseSound = new Audio('audio/game_over.mp3');

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    if (isMuted) {
        backgroundSound.muted = true;
    } else {
        backgroundSound.play();
    }
    sounds.push(backgroundSound);
    updateSoundUI();
}

function updateSoundUI() {
    const soundOnIcon = document.getElementById('soundOn');
    const soundOffIcon = document.getElementById('soundOff');

    if (isMuted) {
        soundOnIcon?.classList.add('dNone');
        soundOffIcon?.classList.remove('dNone');
    } else {
        soundOnIcon?.classList.remove('dNone');
        soundOffIcon?.classList.add('dNone');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateSoundUI();
});

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
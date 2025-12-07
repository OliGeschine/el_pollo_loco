let canvas;
let world;
let keyboard = new Keyboard();
let sounds = [];
let isMuted = localStorage.getItem('isMuted') === 'true';

backgroundSound = new Audio('audio/background_music.mp3');
backgroundSound.loop = true;

/**
 * Initializes the game by setting up canvas, world, and audio
 * Called when the game starts
 * @function
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    setTimeout(() => {
        if (isMuted) {
            backgroundSound.muted = true;
        } else {
            backgroundSound.play().catch(console.error);
        }
    }, 100);
    sounds.push(backgroundSound);
    updateSoundUI();
}

/**
 * Updates the sound UI icons based on current mute state
 * Shows/hides sound-on and sound-off icons accordingly
 * @function
 * @returns {void}
 */
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

/**
 * Event listener for DOM content loaded
 * Initializes sound UI when page is fully loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    updateSoundUI();
});

/**
 * Handles keyboard input for player movement
 * @param {KeyboardEvent} e - The keyboard event object
 */
function handleKeyDown(e) {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
}

/**
 * Handles keyboard input release
 * @param {KeyboardEvent} e - The keyboard event object  
 */
function handleKeyUp(e) {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
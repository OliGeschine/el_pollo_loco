let canvas;
let world;
let keyboard = new Keyboard();
let sounds = [];
let isMuted = localStorage.getItem('isMuted') === 'true';

/**
 * Global audio cache for reusing audio instances
 * Prevents recreating audio objects on every game restart
 */
window.audioCache = window.audioCache || {};

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
            world.backgroundSound.muted = true;
        } else {
            world.backgroundSound.play();
            world.backgroundSound.loop = true;
        }
    }, 10);
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

/**
 * Gets cached audio instance or creates new one
 * Reuses existing audio objects for better performance
 * @function
 * @param {string} src - Audio file path
 * @returns {Audio} Cached or new audio instance
 */
function getCachedAudio(src) {
    if (!window.audioCache[src]) {
        window.audioCache[src] = new Audio(src);
        // Preload für bessere Performance
        window.audioCache[src].preload = 'auto';
    }
    return window.audioCache[src];
}

/**
 * Preloads all game audio files into cache
 * Call this on page load for better performance
 * @function
 * @returns {void}
 */
function preloadGameAudio() {
    const audioFiles = [
        'audio/background_music.mp3',
        'audio/character_fainting.mp3',
        'audio/endboss_fainting.mp3',
        'audio/chicken_fainting.mp3',
        'audio/small_chicken_fainting.mp3',
        'audio/get_hurt.mp3',
        'audio/collect_coin.mp3',
        'audio/collect_bottle.mp3',
        'audio/bottle_breaking.mp3',
        'audio/victory.mp3',
        'audio/game_over.mp3',
        'audio/walking.mp3'
    ];

    audioFiles.forEach(src => getCachedAudio(src));
}

// Audio beim Laden der Seite vorladen
document.addEventListener('DOMContentLoaded', preloadGameAudio);
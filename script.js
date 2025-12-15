let intervalIds = [];
let mobileControlsSetup = false;
let mobileEventListeners = [];

/**
 * Starts the game by hiding overlay and initializing game components
 * Shows canvas and icon bar, initializes level and world, sets up mobile controls if needed
 * @function
 * @returns {void}
 */
function startGame() {
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('canvas').classList.remove('dNone');
    document.getElementById('iconBar').classList.remove('dNone');
    initLevel();
    init();
    setTimeout(() => {
        if (window.innerWidth <= 1024 && window.innerHeight <= window.innerWidth) {
            // document.getElementById('mobile-controls')?.classList.remove('dNone');
            setupMobileControls();
        }
    }, 100);
}

function backToStartScreen() {
    document.getElementById('overlay').classList.remove('dNone');
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('iconBar').classList.add('dNone');
    document.getElementById('winning_overlay').classList.add('dNone');
    document.getElementById('winningScreenIconBar').classList.add('dNone');
    document.getElementById('losing_overlay').classList.add('dNone');
    document.getElementById('losingScreenIconBar').classList.add('dNone');
    clearAllIntervals();
    world = null;
    resetSounds();
}

/**
 * Restarts the game by resetting all game state and reinitializing
 * Clears intervals, resets audio, destroys current world, and starts fresh game
 * @function
 * @returns {void}
 */
function restartGame() {
    resetMobileControls();
    resetSounds();
    if (world && typeof world.cleanup === 'function') {
        world.cleanup();
    }
    clearAllIntervals();
    world = null;
    initResetGame();
}

function initResetGame() {
    setTimeout(() => {
        initLevel();
        init();
        setTimeout(() => {
            if (window.innerWidth <= 1024 && window.innerHeight <= window.innerWidth) {
                // document.getElementById('mobile-controls')?.classList.remove('dNone');
                setupMobileControls();
            }
        }, 50);
    }, 10);
}

/**
 * Restarts the game from end screen after winning
 * Clears intervals, stops all sounds, hides overlays, and reinitializes game
 * @function
 * @returns {void}
 */
function restartWinGame() {
    resetMobileControls();
    if (world && world.victorySound) {
        world.victorySound.pause();
        world.victorySound.currentTime = 0;
    }
    resetSounds();
    if (world && typeof world.cleanup === 'function') {
        world.cleanup();
    }
    world = null;
    initFromWinGame();
}

function initFromWinGame() {
    setTimeout(() => {
        initLevel();
        init();
        resetFromWinningScreen();
        setTimeout(() => {
            if (window.innerWidth <= 1024 && window.innerHeight <= window.innerWidth) {
                // document.getElementById('mobile-controls')?.classList.remove('dNone');
                setupMobileControls();
            }
        }, 50);
    }, 10);
}

/**
 * Restarts the game from losing screen after defeat
 * Clears intervals, stops all sounds, hides losing overlay, and reinitializes game
 * @function
 * @returns {void}
 */
function restartLoseGame() {
    resetMobileControls();
    if (world && world.loseSound) {
        world.loseSound.pause();
        world.loseSound.currentTime = 0;
    }
    resetSounds();
    if (world && typeof world.cleanup === 'function') {
        world.cleanup();
    }
    world = null;
    initFromLoseGame();
}

function initFromLoseGame() {
    setTimeout(() => {
        initLevel();
        init();
        resetFromLosingScreen();
        setTimeout(() => {
            if (window.innerWidth <= 1024 && window.innerHeight <= window.innerWidth) {
                // document.getElementById('mobile-controls')?.classList.remove('dNone');
                setupMobileControls();
            }
        }, 50);
    }, 10);
}

/**
 * Resets UI elements after winning the game
 * Shows canvas and icon bar, hides winning overlay and related elements
 * @function
 * @returns {void}
 */
function resetFromWinningScreen() {
    document.getElementById('canvas').classList.remove('dNone');
    document.getElementById('iconBar').classList.remove('dNone');
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('winning_overlay').classList.add('dNone');
    document.getElementById('winningScreenIconBar').classList.add('dNone');
}

/**
 * Resets UI elements after losing the game
 * Shows canvas and icon bar, hides losing overlay and related elements
 * @function
 * @returns {void}
 */
function resetFromLosingScreen() {
    document.getElementById('canvas').classList.remove('dNone');
    document.getElementById('iconBar').classList.remove('dNone');
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('losing_overlay').classList.add('dNone');
    document.getElementById('losingScreenIconBar').classList.add('dNone');
}

/**
 * Toggles between winning and losing screens based on game outcome
 * Shows appropriate overlay, plays victory/defeat sound, and updates UI
 * @function
 * @param {boolean} endbossIsDead - Whether the endboss has been defeated
 * @param {boolean} characterIsDead - Whether the character has died
 * @returns {void}
 */
function toggleEndScreen(endbossIsDead, characterIsDead) {
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('iconBar').classList.add('dNone');
    if (world.backgroundSound) {
        world.backgroundSound.pause();
        world.backgroundSound.currentTime = 0;
    }
    getEndbossIsDeadLogic(endbossIsDead);
    getCharacterIsDeadLogic(characterIsDead);
}

function getEndbossIsDeadLogic(endbossIsDead) {
    if (endbossIsDead) {
        document.getElementById('winning_overlay').classList.remove('dNone');
        document.getElementById('winningScreenIconBar').classList.remove('dNone');
        let winScreen = document.getElementById('winningScreenImg');
        winScreen.src = 'img/You won, you lost/You won A.png';
        if (!isMuted && world && world.victorySound) {
            world.victorySound.play();
        }
        clearAllIntervals();
    }
}

function getCharacterIsDeadLogic(characterIsDead) {
    if (characterIsDead) {
        document.getElementById('losing_overlay').classList.remove('dNone');
        document.getElementById('losingScreenIconBar').classList.remove('dNone');
        let loseScreen = document.getElementById('losingScreenImg');
        loseScreen.src = 'img/You won, you lost/You lost.png';
        if (!isMuted && world && world.loseSound) {
            world.loseSound.play();
        }
        clearAllIntervals();
    }
}

function resetSounds() {
    sounds.forEach(sound => {
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    });
    sounds.length = 0;
}

/**
 * Creates a new interval and tracks it for cleanup
 * Wrapper around setInterval that automatically adds the ID to tracking array
 * @function
 * @param {Function} callback - Function to execute repeatedly
 * @param {number} delay - Time in milliseconds between executions
 * @returns {number} The interval ID
 */
function startInterval(callback, delay) {
    if (typeof callback !== 'function') {
        console.error('startInterval: callback must be a function');
        return null;
    }
    let id = setInterval(() => {
        try {
            callback();
        } catch (error) {
            console.error('Interval error:', error);
            clearInterval(id);
        }
    }, delay);
    intervalIds.push(id);
    return id;
}

/**
 * Clears all active intervals and resets the tracking array
 * Used for cleanup when restarting game or changing screens
 * @function
 * @returns {void}
 */
function clearAllIntervals() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
}

/**
 * Mutes all game audio and saves mute state to localStorage
 * Updates UI icons, pauses background music, and mutes all tracked sounds
 * @function
 * @returns {void}
 */
function turnOffMusic() {
    isMuted = true;
    localStorage.setItem('isMuted', 'true');
    document.getElementById('soundOn')?.classList.add('dNone');
    document.getElementById('soundOff')?.classList.remove('dNone');
    world.backgroundSound.pause();
    sounds.forEach(sound => {
        if (sound) {
            sound.muted = true;
        }
    });
}

/**
 * Unmutes all game audio and saves state to localStorage
 * Updates UI icons, unmutes all tracked sounds, and resumes background music if game is active
 * @function
 * @returns {void}
 */
function turnOnMusic() {
    isMuted = false;
    localStorage.setItem('isMuted', 'false');
    document.getElementById('soundOn')?.classList.remove('dNone');
    document.getElementById('soundOff')?.classList.add('dNone');
    sounds.forEach(sound => {
        if (sound) {
            sound.muted = false;
        }
    });
    if (!document.getElementById('canvas').classList.contains('dNone')) {
        world.backgroundSound.play();
    }
}

/**
 * Initializes mobile touch controls if device width indicates mobile/tablet
 * Checks screen width and keyboard availability before setting up controls
 * @function
 * @returns {void}
 */
function initMobileControls() {
    if (window.innerWidth <= 1024 && typeof keyboard !== 'undefined') {
        if (window.innerHeight <= window.innerWidth) {
            // document.getElementById('mobile-controls')?.classList.remove('dNone');
        }
        setupMobileControls();
    }
}

/**
 * Sets up event listeners for mobile touch control buttons
 * Handles touch and mouse events for left, right, jump, and throw buttons
 * Waits for keyboard to be defined before proceeding
 * @function
 * @returns {void}
 */
function setupMobileControls() {
    if (typeof keyboard === 'undefined' || mobileControlsSetup) {
        return;
    }
    mobileControlsSetup = true;
    getButtonLeft();
    getButtonRight();
    getButtonJump();
    getButtonThrow();
}

function getButtonLeft() {
    const btnLeft = document.getElementById('btn-left');
    if (btnLeft) {
        const handlers = {
            touchstart: (e) => { e.preventDefault(); keyboard.LEFT = true; },
            touchend: (e) => { e.preventDefault(); keyboard.LEFT = false; },
            mousedown: (e) => { e.preventDefault(); keyboard.LEFT = true; },
            mouseup: (e) => { e.preventDefault(); keyboard.LEFT = false; }
        };
        Object.entries(handlers).forEach(([event, handler]) => {
            btnLeft.addEventListener(event, handler);
            mobileEventListeners.push({ element: btnLeft, event, handler });
        });
    }
}

function getButtonRight() {
    const btnRight = document.getElementById('btn-right');
    if (btnRight) {
        const handlers = {
            touchstart: (e) => { e.preventDefault(); keyboard.RIGHT = true; },
            touchend: (e) => { e.preventDefault(); keyboard.RIGHT = false; },
            mousedown: (e) => { e.preventDefault(); keyboard.RIGHT = true; },
            mouseup: (e) => { e.preventDefault(); keyboard.RIGHT = false; }
        };
        Object.entries(handlers).forEach(([event, handler]) => {
            btnRight.addEventListener(event, handler);
            mobileEventListeners.push({ element: btnRight, event, handler });
        });
    }
}

function getButtonJump() {
    const btnJump = document.getElementById('btn-jump');
    if (btnJump) {
        const handlers = {
            touchstart: (e) => { e.preventDefault(); keyboard.UP = true; },
            touchend: (e) => { e.preventDefault(); keyboard.UP = false; },
            mousedown: (e) => { e.preventDefault(); keyboard.UP = true; },
            mouseup: (e) => { e.preventDefault(); keyboard.UP = false; }
        };
        Object.entries(handlers).forEach(([event, handler]) => {
            btnJump.addEventListener(event, handler);
            mobileEventListeners.push({ element: btnJump, event, handler });
        });
    }
}

function getButtonThrow() {
    const btnThrow = document.getElementById('btn-throw');
    if (btnThrow) {
        const handlers = {
            touchstart: (e) => { e.preventDefault(); keyboard.SPACE = true; },
            touchend: (e) => { e.preventDefault(); keyboard.SPACE = false; },
            mousedown: (e) => { e.preventDefault(); keyboard.SPACE = true; },
            mouseup: (e) => { e.preventDefault(); keyboard.SPACE = false; }
        };
        Object.entries(handlers).forEach(([event, handler]) => {
            btnThrow.addEventListener(event, handler);
            mobileEventListeners.push({ element: btnThrow, event, handler });
        });
    }
}

/**
 * Removes all mobile control event listeners and resets setup state
 * Called when restarting game or cleaning up mobile controls
 * Prevents duplicate event listeners on multiple setups
 * @function
 * @returns {void}
 */
function resetMobileControls() {
    mobileEventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    mobileEventListeners = [];
    mobileControlsSetup = false;
}

/**
 * Checks device orientation and adjusts UI accordingly
 * Shows/hides rotation overlay and mobile controls based on orientation and screen size
 * Initializes mobile controls when switching to landscape on mobile devices
 * @function
 * @returns {void}
 */
function checkOrientation() {
    const rotateOverlay = document.getElementById('rotate-device-overlay');
    const mobileControls = document.getElementById('mobile-controls');

    if (window.innerWidth <= 1024) {
        if (window.innerHeight > window.innerWidth) {
            // rotateOverlay?.classList.remove('dNone');
            mobileControls?.classList.add('dNone');
        } else {
            // rotateOverlay?.classList.add('dNone');
            // mobileControls?.classList.remove('dNone');
            setupMobileControls();
        }
    } else {
        // rotateOverlay?.classList.add('dNone');
        mobileControls?.classList.add('dNone');
    }
}

// Orientation Change Detection
window.addEventListener('orientationchange', function () {
    setTimeout(checkOrientation, 100);
});
window.addEventListener('resize', checkOrientation);

checkOrientation();
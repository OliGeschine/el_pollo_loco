let intervalIds = [];

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
        if (window.innerWidth <= 1024 && typeof keyboard !== 'undefined') {
            setupMobileControls();
        }
    }, 100);
}

/**
 * Restarts the game by resetting all game state and reinitializing
 * Clears intervals, resets audio, destroys current world, and starts fresh game
 * @function
 * @returns {void}
 */
function restartGame() {
    clearAllIntervals();
    document.getElementById('canvas').classList.remove('dNone');
    document.getElementById('iconBar').classList.remove('dNone');
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('winning_overlay').classList.add('dNone');
    document.getElementById('losing_overlay').classList.add('dNone');
    document.getElementById('winningScreenIconBar').classList.add('dNone');
    document.getElementById('losingScreenIconBar').classList.add('dNone');
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    world = null;
    initLevel();
    init();
    setTimeout(() => {
        if (window.innerWidth <= 1024 && typeof keyboard !== 'undefined') {
            setupMobileControls();
        }
    }, 100);
}

/**
 * Displays the winning screen when player completes the game
 * Hides canvas, shows victory overlay, stops all intervals and plays victory sound
 * @function
 * @returns {void}
 */
function showWinningScreen() {
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('winning_overlay').classList.remove('dNone');
    document.getElementById('iconBar').classList.add('dNone');
    document.getElementById('winningScreenIconBar').classList.remove('dNone');
    clearAllIntervals();
    backgroundSound.pause();
    if (!isMuted) {
        this.victorySound.play();
    }
}

/**
 * Displays the losing screen when player fails the game
 * Hides canvas, shows game over overlay, stops all intervals and plays lose sound
 * @function
 * @returns {void}
 */
function showLosingScreen() {
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('losing_overlay').classList.remove('dNone');
    document.getElementById('iconBar').classList.add('dNone');
    document.getElementById('losingScreenIconBar').classList.remove('dNone');
    clearAllIntervals();
    backgroundSound.pause();
    if (!isMuted) {
        this.loseSound.play();
    }
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
    let id = setInterval(callback, delay);
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
    intervalIds.forEach(clearInterval);
    intervalIds.length = 0;
}

/**
 * Toggles fullscreen mode for the game overlay
 * Requests fullscreen API on the overlay element
 * @function
 * @returns {void}
 */
function fullscreen() {
    overlay.requestFullscreen();
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
    backgroundSound.pause();
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
        backgroundSound.play().catch(() => { });
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
    if (typeof keyboard === 'undefined') {
        setTimeout(setupMobileControls, 100);
        return;
    }
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnThrow = document.getElementById('btn-throw');

    if (btnLeft) {
        btnLeft.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard.LEFT = true;
        });
        btnLeft.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard.LEFT = false;
        });
        btnLeft.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keyboard.LEFT = true;
        });
        btnLeft.addEventListener('mouseup', (e) => {
            e.preventDefault();
            keyboard.LEFT = false;
        });
    }

    if (btnRight) {
        btnRight.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard.RIGHT = true;
        });
        btnRight.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard.RIGHT = false;
        });
        btnRight.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keyboard.RIGHT = true;
        });
        btnRight.addEventListener('mouseup', (e) => {
            e.preventDefault();
            keyboard.RIGHT = false;
        });
    }

    if (btnJump) {
        btnJump.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard.UP = true;
        });
        btnJump.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard.UP = false;
        });
        btnJump.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keyboard.UP = true;
        });
        btnJump.addEventListener('mouseup', (e) => {
            e.preventDefault();
            keyboard.UP = false;
        });
    }

    if (btnThrow) {
        btnThrow.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard.SPACE = true;
        });
        btnThrow.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard.SPACE = false;
        });
        btnThrow.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keyboard.SPACE = true;
        });
        btnThrow.addEventListener('mouseup', (e) => {
            e.preventDefault();
            keyboard.SPACE = false;
        });
    }
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
            rotateOverlay?.classList.remove('dNone');
            mobileControls?.classList.add('dNone');
        } else {
            rotateOverlay?.classList.add('dNone');
            mobileControls?.classList.remove('dNone');
            initMobileControls();
        }
    } else {
        rotateOverlay?.classList.add('dNone');
        mobileControls?.classList.add('dNone');
    }
}

// Orientation Change Detection
window.addEventListener('orientationchange', function () {
    setTimeout(checkOrientation, 100);
});
window.addEventListener('resize', checkOrientation);

checkOrientation();
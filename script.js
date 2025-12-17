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
        if (window.innerWidth <= 1500 && window.innerHeight <= window.innerWidth && isTablet()) {
            document.getElementById('mobile-controls')?.classList.remove('dNone');
            setTimeout(() => setupMobileControls(), 300);
        }
    }, 200);
}

/**
 * Returns to the start screen and resets all game elements
 * Hides game UI, shows overlay and instructions, cleans up resources
 * @function
 * @returns {void}
 */
function backToStartScreen() {
    document.getElementById('overlay').classList.remove('dNone');
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('iconBar').classList.add('dNone');
    document.getElementById('winning_overlay').classList.add('dNone');
    document.getElementById('winningScreenIconBar').classList.add('dNone');
    document.getElementById('losing_overlay').classList.add('dNone');
    document.getElementById('losingScreenIconBar').classList.add('dNone');
    document.getElementById('impressum').classList.add('dNone');
    document.getElementById('instructions').classList.remove('dNone');
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

/**
 * Initializes game restart sequence with proper timing
 * Reinitializes level and world, sets up mobile controls after delay
 * @function
 * @returns {void}
 */
function initResetGame() {
    setTimeout(() => {
        initLevel();
        init();
        setTimeout(() => {
            if (window.innerWidth <= 1500 && window.innerHeight <= window.innerWidth) {
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

/**
 * Initializes game restart from winning screen
 * Reinitializes game components and resets UI elements after victory
 * @function
 * @returns {void}
 */
function initFromWinGame() {
    setTimeout(() => {
        initLevel();
        init();
        resetFromWinningScreen();
        setTimeout(() => {
            if (window.innerWidth <= 1500 && window.innerHeight <= window.innerWidth) {
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

/**
 * Initializes game restart from losing screen
 * Reinitializes game components and resets UI elements after defeat
 * @function
 * @returns {void}
 */
function initFromLoseGame() {
    setTimeout(() => {
        initLevel();
        init();
        resetFromLosingScreen();
        setTimeout(() => {
            if (window.innerWidth <= 1500 && window.innerHeight <= window.innerWidth) {
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

/**
 * Handles game logic when endboss is defeated
 * Shows victory screen, plays victory sound, and clears intervals
 * @function
 * @param {boolean} endbossIsDead - Whether the endboss has been defeated
 * @returns {void}
 */
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

/**
 * Handles game logic when character dies
 * Shows losing screen, plays game over sound, and clears intervals
 * @function
 * @param {boolean} characterIsDead - Whether the character has died
 * @returns {void}
 */
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

/**
 * Resets all game sounds to initial state
 * Pauses all active sounds, resets playback position, and clears sound array
 * @function
 * @returns {void}
 */
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
 * Shows the impressum (legal notice) page
 * Hides game elements and instructions, displays impressum content
 * @function
 * @returns {void}
 */
function showImpressum() {
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('iconBar').classList.add('dNone');
    document.getElementById('impressum').classList.remove('dNone');
    document.getElementById('instructions').classList.add('dNone');
}
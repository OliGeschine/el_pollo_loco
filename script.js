let intervalIds = [];

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

function startInterval(callback, delay) {
    let id = setInterval(callback, delay);
    intervalIds.push(id);
    return id;
}

function clearAllIntervals() {
    intervalIds.forEach(clearInterval);
    intervalIds.length = 0;
}

function fullscreen() {
    overlay.requestFullscreen();
}

function turnOffMusic() {
    isMuted = true;
    localStorage.setItem('isMuted', 'true'); // In Local Storage speichern

    // UI aktualisieren
    document.getElementById('soundOn')?.classList.add('dNone');
    document.getElementById('soundOff')?.classList.remove('dNone');

    // Alle Sounds muten
    backgroundSound.pause();
    sounds.forEach(sound => {
        if (sound) {
            sound.muted = true;
        }
    });
}

function turnOnMusic() {
    isMuted = false;
    localStorage.setItem('isMuted', 'false'); // In Local Storage speichern

    // UI aktualisieren
    document.getElementById('soundOn')?.classList.remove('dNone');
    document.getElementById('soundOff')?.classList.add('dNone');

    // Alle Sounds unmuten
    sounds.forEach(sound => {
        if (sound) {
            sound.muted = false;
        }
    });

    // Background Music nur starten wenn Spiel läuft
    if (!document.getElementById('canvas').classList.contains('dNone')) {
        backgroundSound.play().catch(() => { }); // Autoplay-Blocker ignorieren
    }
}

// Mobile Touch Controls
function initMobileControls() {
    if (window.innerWidth <= 1024 && typeof keyboard !== 'undefined') {
        setupMobileControls();
    }
}

function setupMobileControls() {
    // Warten bis keyboard definiert ist
    if (typeof keyboard === 'undefined') {
        setTimeout(setupMobileControls, 100);
        return;
    }

    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnThrow = document.getElementById('btn-throw');

    // Touch Events (funktionieren auch mit Maus)
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

// Orientation Change Detection
window.addEventListener('orientationchange', function () {
    setTimeout(checkOrientation, 100);
});

window.addEventListener('resize', checkOrientation);

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
            initMobileControls(); // HIER aufrufen
        }
    } else {
        rotateOverlay?.classList.add('dNone');
        mobileControls?.classList.add('dNone');
    }
}

// Initial Check
checkOrientation();
let intervalIds = [];

function startGame() {
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('canvas').classList.remove('dNone');
    document.getElementById('iconBar').classList.remove('dNone');
    initLevel();
    init();
}

function showWinningScreen() {
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('winning_overlay').classList.remove('dNone');
    document.getElementById('iconBar').classList.add('dNone');
    document.getElementById('winningScreenIconBar').classList.remove('dNone');
    clearAllIntervals();
    this.backgroundSound.pause();
    if (isMuted === false) {
        this.victorySound.play();
    }
}

function showLosingScreen() {
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('losing_overlay').classList.remove('dNone');
    document.getElementById('iconBar').classList.add('dNone');
    document.getElementById('losingScreenIconBar').classList.remove('dNone');
    clearAllIntervals();
    this.backgroundSound.pause();
    if (isMuted === false) {
        this.victorySound.play();
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
    // this.backgroundSound.pause();
    document.getElementById('soundOn').classList.add('dNone');
    document.getElementById('soundOff').classList.remove('dNone');
    sounds.forEach(sound => sound.muted = true);
}

function turnOnMusic() {
    isMuted = false;
    this.backgroundSound.play();
    document.getElementById('soundOn').classList.remove('dNone');
    document.getElementById('soundOff').classList.add('dNone');
    sounds.forEach(sound => sound.muted = false);
}

// function requestFullscreen(element) {
//     if (element.requestFullscreen) {
//         element.requestFullscreen();
//     } else if (element.msRequestFullscreen) {
//         element.msRequestFullscreen();
//     } else if (element.webkitRequestFullscreen) {
//         element.webkitRequestFullscreen();
//     }
// }

// function exitFullscreen() {
//     if (document.exitFullscreen) {
//         document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//         document.webkitExitFullscreen();
//     }
// }
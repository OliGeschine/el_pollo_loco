let intervalIds = [];

function startGame() {
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('canvas').classList.remove('dNone');
    initLevel();
    init();
}

function showEndScreen() {
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('end_overlay').classList.remove('dNone');
    clearAllIntervals();
    // for (let i = 1; i < 99999; i++) window.clearInterval(i);
    this.backgroundSound.pause();
    this.victorySound.play();
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
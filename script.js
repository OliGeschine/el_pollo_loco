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

function fullscreen() {
    overlay.requestFullscreen();
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
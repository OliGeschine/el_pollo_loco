// let intervalIDs = [];

function startGame() {
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('canvas').classList.remove('dNone');
    initLevel();
    init();
}

function showEndScreen() {
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('end_overlay').classList.remove('dNone');
    for (let i = 1; i < 99999; i++) window.clearInterval(i);
    this.backgroundSound.pause();
    this.victorySound.play();
}

// function setStoppableInterval(fn, time) {
//     let id = setInterval(fn, time);
//     intervalIDs.push(id);
// }

// function stopGame() {
//     intervalIDs.forEach(clearInterval);
// }
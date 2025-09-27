function startGame() {
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('canvas').classList.remove('dNone');
    initLevel();
    init();
}

function showEndScreen() {
    document.getElementById('canvas').classList.add('dNone');
    document.getElementById('end_overlay').classList.remove('dNone');
}
function startGame() {
    document.getElementById('overlay').classList.add('dNone');
    document.getElementById('canvas').classList.remove('dNone');
    initLevel();
    init();

}
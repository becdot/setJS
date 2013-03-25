// Playing the game
function startGame() {
    var tableNode, oldDifficulty;
    if ((tableNode = document.getElementById('table'))) {
        console.log('table has been previously created');
        document.body.removeChild(tableNode);
        var oldDifficulty = table.difficulty;
        table = new Table(21);
        table.setUp();
        table.difficulty = oldDifficulty;
        createDOM(table.table, table.difficulty);

    } else {
        if (table.difficulty === null) {
            alert('Please choose a difficulty.');
        } else {
        createDOM(table.table, table.difficulty);
        }
    }
}

function difficulty() {
    return function(event) {
        var buttonID = event.currentTarget.getAttribute('id');
        if (buttonID === 'hard') {
            table.difficulty = 15;
        } else if (buttonID === 'medium') {
            table.difficulty = 30;
        } else {
            table.difficulty = 45;
        }
        console.log('difficulty', table.difficulty);
    }
}

function addDifficultyClicks() {
    var buttons = document.getElementsByClassName('difficulty');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', difficulty());
    }
    var start = document.getElementById('startgame');
    start.addEventListener('click', startGame);
}

table = new Table(21);
table.setUp();
addDifficultyClicks();
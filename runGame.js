// Playing the game

function difficulty(table) {
    return function(event) {
        var buttonID = event.currentTarget.getAttribute('id');
        if (buttonID === 'hard') {
            table.difficulty = 15;
        } else if (buttonID === 'medium') {
            table.difficulty = 30;
        } else {
            table.difficulty = 45;
;(function(exports) {
        }
        console.log('difficulty', table.difficulty);
    }
}

function startGame(table) {
    return function() {
        var tableNode, difficulty, newTable;
        if (table.difficulty === null) {
            alert('Please choose a difficulty.');
            return false;
        }
        if ((tableNode = document.getElementById('table'))) {
            console.log('table has been previously created', table.difficulty);
            difficulty = table.difficulty;
            window.clearInterval(computerInterval);
        }
        newTable = new Table(21);
        newTable.difficulty = table.difficulty || difficulty;
        newGame(newTable, newTable.difficulty);
    }
}

function addDifficultyClicks(table) {
    var buttons = document.getElementsByClassName('difficulty');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', difficulty(table));
    }
    var start = document.getElementById('startgame');
    start.addEventListener('click', startGame(table));
}

addDifficultyClicks(table);
    var table = new Table(21);
})(this);

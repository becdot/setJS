// Dino game board

// Game world
var board = 
['################',
'#       ##     #',
'#   T  #       #',
'#         T    #',
'# #    ##      #',
'#     T  #     #',
'#  D        T  #',
'################'];

//// Point object
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.add = function(other) {
    return new Point(this.x + other.x, this.y + other.y);
};
//// Grid
function Grid(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
}
Grid.prototype.valueAt = function(point) {
    return this.cells[point.y * this.width + point.x];
};
Grid.prototype.setValueAt = function(point, value) {
    return this.cells[point.y * this.width + point.x] = value;
};
Grid.prototype.isInside = function(point) {
    return point.x >= 0 && point.y >= 0 &&
        point.x < this.width && point.y < this.height;
};
Grid.prototype.moveValue = function(from, to) {
    this.setValueAt(to, this.valueAt(from));
    this.setValueAt(from, undefined);
};
Grid.prototype.each = function(action) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var point = new Point(x, y);
            action(point, this.valueAt(point));
        }
    }
};

// Dino creature
function Dino() {}
Dino.prototype.character = 'D';


// Dino methods -- move, eat, reproduce, die
// Dino.prototype.move = function(dir) {
//     if (validDirection(dir))
//         updateBoard(current, new_location)
// };

// Tree object
function Tree() {
    this.energy = 10;
    this.character = 'T';
}
// World methods (plants, eating, board interaction, etc)

//// Board
var wall = {};
wall.character = '#';

function elementFromCharacter(character) {
    if (character == ' ')
        return undefined;
    else if (character == '#')
        return wall;
    else if (character == 'T')
        return new Tree();
    else if (character == 'D')
        return new Dino();
}
function characterFromElement(element) {
    if (element === undefined)
        return ' ';
    else
        return element.character;
}
//// World
function World(board) {
    var grid = new Grid(board[0].length, board.length);
    for (var y = 0; y < board.length; y++) {
        var line = board[y];
        for (var x = 0; x < line.length; x++) {
            grid.setValueAt(new Point(x, y), 
                  elementFromCharacter(line.charAt(x)));
        }
    }
    this.grid = grid;
}

World.prototype.toString = function() {
    var characters = [];
    var endOfLine = this.grid.width - 1;
    this.grid.each(function(point, value) {
        characters.push(characterFromElement(value));
        if (point.x == endOfLine)
              characters.push('\n');
    });
    return characters.join('');
};

var testWorld = new World(board);
console.log(testWorld.toString());


// Card
var cardValues = ['number', 'colour', 'shading', 'shape']
var cardValuesDic = {'number': {1: 'one', 2: 'two', 3: 'three'}, 'colour': {0: 'red', 1: 'purple', 2: 'green'},
                    'shading': {0: 'solid', 1: 'semi', 2: 'transparent'}, 'shape': {0: 'oval', 1: 'diamond', 2: 'squiggle'}};
function Card() {
    this.id = null;
    for (var i in cardValues) {
        this[cardValues[i]] = null;
    }
}
Card.prototype.setRandomValues = function() {
    this.number = randomElement([1, 2, 3]);
    for (var i = 1; i < 4; i++) {
        this[cardValues[i]] = randomElement([0, 1, 2]);
    }
};
Card.prototype.getValues = function() {
    var classes, attr;
    if (arguments.length === 0) {
        classes = [];
        for (var i = 0; i < cardValues.length; i++) {
            attr = cardValues[i];
            classes.push(cardValuesDic[attr][this[attr]]);
        }
        return classes;
    } else {
        attr = arguments[0];
        return cardValuesDic[attr][this[attr]];
    }
};

// Randomness
function randomElement(array) {
    if (array.length === 0)
        console.log('array is empty');
    var index = Math.floor(Math.random() * array.length);
    return array[index];
}

// Deck
function Deck() {
    this.deck = [];
}
Deck.prototype.shuffle = function() {
    for (var i = 0; i < this.deck.length; i++) {
        var randIndex = Math.floor(Math.random() * this.deck.length);
        var card1 = this.deck[i];
        var card2 = this.deck[randIndex];
        this.deck[i] = card2;
        this.deck[randIndex] = card1;
    }  
};
Deck.prototype.setUp = function(deckLength) {
    for (var i = 0; i < deckLength; i++) {
        // way to have this set in one shot?  (have the Card initialisation set random values at start?)
        var card = new Card();
        card.setRandomValues();
        card.id = i;
        this.deck.push(card);
    }
    this.shuffle();
};
Deck.prototype.deal = function() {
    if (this.deck)
        return this.deck.pop();
};

// Table
function Table(deckLength) {
    this.table = [];
    this.clickedCards = [];
    this.score = 0;
    this.computerScore = 0;
    this.Deck = new Deck();
    this.Deck.setUp(deckLength);
}
Table.prototype.dealCard = function() {
    var newCard;
    if ((newCard = this.Deck.deal()))
        this.table.push(newCard);
};
Table.prototype.setUp = function() {
    for (var i = 0; i < 12; i++) {
        this.dealCard();
    }  
};
Table.prototype.removeCards = function(cardList) {
    for (var i = 0; i < cardList.length; i++) {
        var cardIndex = this.table.indexOf(cardList[i]);
        if (cardIndex !== -1) {
            this.table.splice(cardIndex, 1);
        }
    }
};
Table.prototype.addThree = function() {
    for (var i = 0; i < 3; i++) {
        this.dealCard();
    }
};
Table.prototype.updateAfterSet = function(cardList, winner) {
    this.removeCards(cardList);
    this.addThree();
    if (winner === 'computer') {
        this.computerScore += 1;
    } else {
        this.score += 1;
    }
};
Table.prototype.clickCard = function(card) {
    this.clickedCards.push(card);
}
Table.prototype.unclickCard = function(card) {
    var index;
    if ((index = this.clickedCards.indexOf(card)) != -1)
        this.clickedCards.splice(index, 1);
}
Table.prototype.unclickAllCards = function() {
    this.clickedCards = [];
}

Table.prototype.iterateTable = function(state) {
    var iUpperBound = this.table.length - 3;
    var jUpperBound = this.table.length - 2;
    var kUpperBound = this.table.length - 1;
    if (state === false) {
        return { "result": false, "state": false};
    }
    if(typeof state !== "undefined") {
        var i = state.i,
            j = state.j,
            k = state.k;
        if (k === kUpperBound && j === jUpperBound && i === iUpperBound) {
            return { "result": [this.table[i], this.table[j], this.table[k]], "state": false};
        }
        if (k < kUpperBound) {
            k++;
        } else if (k === kUpperBound && j < jUpperBound) {
            j++;
            k = j + 1;
        } else if (k === kUpperBound && j === jUpperBound) {
            i++;
            j = i + 1;
            k = j + 1;
        }

    } else {
        i = 0,
        j = 1,
        k = 2;
    }
    return { "result": [this.table[i], this.table[j], this.table[k]], "state": {"i": i, "j": j, "k": k }};
};
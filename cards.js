// Card
var cardParameters = {
  'number': ['one', 'two', 'three'],
  'colour': ['red', 'purple', 'green'],
  'shading': ['solid', 'semi', 'transparent'],
  'shape': ['oval', 'diamond', 'squiggle']
};

function Card() {
    this.id = null;
    for (var i in cardParameters) {
        this[i] = null;
    }
}

var isAllowablePropertySet = function(prop1, prop2, prop3) {
    if (prop1 === prop2 && prop1 === prop3) {
        return true;
    } else if (prop1 !== prop2 && prop1 !== prop3) {
        return true;
    } else {
        return false;
    }
};

Card.isSet = function(threeCards) {
    if (threeCards.length !== 3) {
        return false;
    }

    var card1 = threeCards[0];
    var card2 = threeCards[1];
    var card3 = threeCards[2];
    for (var i in cardParameters) {
        if (!isAllowablePropertySet(card1[i], card2[i], card3[i])) {
            return false;
        }
    }
    return true;
}

Card.prototype.setRandomValues = function() {
    for (var i in cardParameters) {
        var random = randomElement(cardParameters[i]);
        this[i] = random;
    }
};
Card.prototype.getValues = function() {
    if (arguments.length === 0) {
        var classes = [];
        for (var i in cardParameters) {
            classes.push(this[i]);
        }
        return classes;
    }
};

// Randomness
function randomElement(array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
}

// Deck
function Deck(deckLength) {
    this.deck = [];
    for (var i = 0; i < deckLength; i++) {
        // way to have this set in one shot?  (have the Card initialisation set random values at start?)
        var card = new Card();
        card.setRandomValues();
        card.id = i;
        this.deck.push(card);
    }
    this.shuffle();

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
    this.deck = new Deck(deckLength);
    this.difficulty = null;
    for (var i = 0; i < 12; i++) {
        this.dealCard();
    }
};
Table.prototype.getSet = function(table) {
    var state, cards, it;
    while (state !== false) {
        it = table.iterateTable(state);
        state = it.state;
        cards = it.result;
        if (cards[0] && cards[1] && cards[2] && Card.isSet(cards)) {
            console.log('found a set at ', state.i, state.j, state.k);
            return cards;
        }
    }
    return false;
}
Table.prototype.dealCard = function() {
    var newCard = this.deck.deal();
    if (newCard !== undefined) {
        this.table.push(newCard);
    }
};
Table.prototype.removeCards = function(cardList) {
    for (var i = 0; i < cardList.length; i++) {
        // FYI: array indexOf is not supported in Internet Explorer 8 and below
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
    var index = this.clickedCards.indexOf(card);
    if (index !== -1)
        this.clickedCards.splice(index, 1);
}
Table.prototype.unclickAllCards = function() {
    this.clickedCards = [];
}

Table.prototype.iterateTable = function(state) {
    var i, j, k;
    var iUpperBound = this.table.length - 3;
    var jUpperBound = this.table.length - 2;
    var kUpperBound = this.table.length - 1;
    if (state === false) {
        return { "result": false, "state": false};
    }
    if(typeof state === "undefined") {
        i = 0;
        j = 1;
        k = 2;
    } else {
        i = state.i;
        j = state.j;
        k = state.k;
        if (k === kUpperBound && j === jUpperBound && i === iUpperBound) {
            return { "result": [this.table[i], this.table[j], this.table[k]], "state": false};
        } else if (k < kUpperBound) {
            k++;
        } else if (k === kUpperBound && j < jUpperBound) {
            j++;
            k = j + 1;
        } else if (k === kUpperBound && j === jUpperBound) {
            i++;
            j = i + 1;
            k = j + 1;
        }
    }
    return { "result": [this.table[i], this.table[j], this.table[k]], "state": {"i": i, "j": j, "k": k }};
};
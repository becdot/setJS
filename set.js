// Card
function Card() {
    this.number = null;
    this.colour = null;
    this.shading = null;
    this.shape = null;
}
Card.prototype.setRandomValues = function() {
    this.number = randomElement([1, 2, 3]);
    this.colour = randomElement([0, 1, 2]);
    this.shading = randomElement([0, 1, 2]);
    this.shape = randomElement([0, 1, 2]);
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
Deck.prototype.setUp = function() {
    for (var i = 0; i < 21; i++) {
        // way to have this set in one shot?  (have the Card initialisation set random values at start?)
        var card = new Card();
        card.setRandomValues();
        this.deck.push(card);
    }
    this.shuffle();
};
Deck.prototype.deal = function() {
    return this.deck.pop();
};

// Table
function Table() {
    this.table = [];
    this.Deck = new Deck();
    this.Deck.setUp();
}
Table.prototype.dealCard = function() {
        var newCard = this.Deck.deal();
      this.table.push(newCard);
};
Table.prototype.setUp = function() {
    for (var i = 0; i < 12; i++) {
        this.dealCard();
    }  
};
Table.prototype.removeCard = function(card) {
      var cardIndex = this.table.indexOf(card);
      var first = this.table.slice(0, cardIndex);
      var last = this.table.slice(cardIndex + 1, this.table.length);
      this.table = first.concat(last);
};
Table.prototype.maintain = function(extraRow) {
    var tableLength = this.table.length;
    if (arguments.length === 1) {
        for (var i = 0; i < 3; i++) {
            this.dealCard();
          }
    }
    else if (arguments.length < 1 && tableLength < 12) {
        for (i = 0; i < 12 - tableLength; i++) {
            this.dealCard();
          }
    }
};


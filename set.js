// Card
var cardValues = ['number', 'colour', 'shading', 'shape']
var cardValuesDic = {'number': {1: 'one', 2: 'two', 3: 'three'}, 'colour': {0: 'red', 1: 'purple', 2: 'green'},
                    'shading': {0: 'solid', 1: 'semi', 2: 'transparent'}, 'shape': {0: 'oval', 1: 'diamond', 2: 'squiggle'}};
function Card() {
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
    this.clickedCards = [];
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
    if (cardIndex !== -1) {
        this.table.splice(cardIndex, 1);
    }
};
Table.prototype.addThree = function() {
    for (var i = 0; i < 3; i++) {
        this.dealCard();
    }
};

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


// Sets
function allSame(attr, card1, card2, card3) {
    if (card1[attr] === card2[attr] && card2[attr] === card3[attr] && card3[attr] === card1[attr])
        return true;
    return false;
}
function allDifferent(attr, card1, card2, card3) {
    // console.log('all different:', (card1[attr] !== card2[attr] && card2[attr] !== card3[attr] && card3[attr] !== card1[attr]));
    if (card1[attr] !== card2[attr] && card2[attr] !== card3[attr] && card3[attr] !== card1[attr])
        return true;
    return false;
}
function isSet(card1, card2, card3) {
    for (var i = 0; i < 4; i++) {
        attr = cardValues[i];
        if (!(allSame(attr, card1, card2, card3) || allDifferent(attr, card1, card2, card3)))
            return false;
    }
    return true;
}

// Computer AI
function factorial(num) {
    if (num === 1) {
        return 1;  
    } else {
        return num * factorial(num - 1);  
    }
}
function chooseThree(num) {
    if (num < 3) {
        return 0
    } else if (num == 3) {
        return 1
    } else {
        return factorial(num) / (factorial(3)*factorial(num - 3));  
    }
}

function getSet(table) {
    var upperBound = chooseThree(table.table.length);
    var state, cards, it;
    while (state !== false) {
        it = table.iterateTable(state);
        state = it.state;
        cards = it.result;
        if (isSet(cards[0], cards[1], cards[2])) {
            return cards;
        }
    }
    return false;
}

// HTML helper functions
function dom(name, attributes, childrenList) {
    var node = document.createElement(name);
    if (attributes) {
        for (var name in attributes) {
            var value = attributes[name];
            node.setAttribute(name, value);
        }
    }
    for (var i = 0; i < childrenList.length; i++){
        var child = childrenList[i];
        if (typeof child === 'string') {
            child = document.createTextNode(child);
        }
        node.appendChild(child);
    }
    return node;
}

function getCardCSSClasses(card) {
    classes = ['card'];
    for (var i = 0; i < cardValues.length; i++) {
        var attr = cardValues[i];
        classes.push(cardValuesDic[attr][card[attr]]);
    }
    return classes;
}

function cardToNode(card, cardNum) {
    var CSSClasses = getCardCSSClasses(card).join(' ');
    var numberNode = dom('p', null, ['Number: ' + card['number']]);
    var shapeNode = dom('p', null, ['Shape: ' + cardValuesDic['shape'][card['shape']]])
    var pNodes = [numberNode, shapeNode];
    var node = dom('div', {'class': CSSClasses}, pNodes);
    return node

}

function getAttrFromCardNode(cardNode, attr) {
    var children = cardNode.children;
    for (var i = 0; i < children.length; i++) {
        var text = children[i].innerText.split(': ');
        if (text[0].toLowerCase() === attr) {
            return text[1];
        }
    }
}

function nodeToCard(cardNode) {
    var newCard = new Card();
    for (var i = 0; i < cardValues.length; i++) {
        var attr = cardValues[i];
        newCard[attr] = getAttrFromCardNode(cardNode, attr);
    }
    return newCard;
}

function highlightCard(cardNode) {
    cardNode.style['font-weight'] = 900;
}

function unhighlightAllCards(tableNode) {
    var parentNode = tableNode.parentNode;
    var table = parentNode.removeChild(tableNode);
    var cards = table.getElementsByClassName('card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].style['font-weight'] = 400;
    }
    parentNode.appendChild(table);
}

function whenCardClicked(cardNode) {
    // if card has already been clicked on, remove it from the list of clicked cards
    if (cardNode.style['font-weight'] === '900') {
        console.log('you clicked on a highlighted card');
        var index = clickedCards.indexOf(cardNode);
        console.log(index);
        clickedCards.splice(index, 1);
        cardNode.style['font-weight'] = 400;
    }
    // if the list of clicked cards < 2, add it to the list
    else if (clickedCards.length < 2) {
        highlightCard(cardNode);
        clickedCards.push(cardNode);
    }
    // if the list has two cards already, add the third card and check to see whether it is a set
    // afterwards, unlightlight all cards and clear the list of clicked cards
    else if (clickedCards.length === 2) {
        highlightCard(cardNode);
        clickedCards.push(cardNode);

        if (isSet(nodeToCard(clickedCards[0]), nodeToCard(clickedCards[1]), nodeToCard(clickedCards[2]))) {
            alert('That is a set!');
        }
        else {
            alert('That is not a set.'); 
        }
        unhighlightAllCards(cardNode.parentNode);
        clickedCards = [];
    }
}

function addCardClick(cardNode) {
    var cardNum = getAttrFromCardNode(cardNode, 'number');
    var cardShape = getAttrFromCardNode(cardNode, 'shape');
    cardNode.addEventListener('click', 
        function(){whenCardClicked(cardNode)});
}

function addCardsToDOM(parentElement, cards) {
    var node, fragment = document.createDocumentFragment();
    for (var i = 0; i < cards.length; i++) {
        cardNode = cardToNode(cards[i], i);
        addCardClick(cardNode);
        fragment.appendChild(cardNode);
    }
    parentElement.appendChild(fragment);
}

// Playing the game
var table = new Table();
table.setUp();

// Create and add table div
var tableDiv = document.createElement('div');
tableDiv.setAttribute('class', 'table');
// Create and add cards in table.table to the document body
addCardsToDOM(tableDiv, table.table);
document.body.appendChild(tableDiv);
// Clicked cards -- global variable
clickedCards = []

// Testing
function assertTrue(val) {
    if (val)
        return true;
    return false;
}
function assertFalse(val) {
      if (val)
        return false;
    return true;
}
function assertEquals(val1, val2) {
    if (typeof val1 === 'number')
        return val1 === val2;
    if (val1.length !== val2.length)
        return false;
    for (var i = 0; i < val1.length; i++){
        if (val1[i] != val2[i]) {
            return false  ;
        }
    }
    return true;
}
function assertNotEquals(val1, val2) {
      if (val1.length !== val2.length)
        return true;
    for (var i = 0; i < val1.length; i++){
        if (val1[i] != val2[i]) {
            return true;
        }
    }
    return false;
}
function isACard(card) {
    return (typeof card.shape === 'string') 
    && (typeof card.number === 'string') 
    && (typeof card.shading === 'string') 
    && (typeof card.colour === 'string');
}
function cardsEqual(card1, card2) {
    return card1.shape === card2.shape && card1.colour === card2.colour && card1.number === card2.number && card1.shading === card2.shading;
}

function decksEqual(deck1, deck2) {
    if (deck1.length != deck2.length)
        return false;
    for (var i = 0; i < deck1.length; i++) {
        if (!cardsEqual(deck1[i], deck2[i]))
            return false;
    }
    return true;
}
function runTests(testArray, typeTest) {    
    var errors = [];
    for (var i = 0; i < testArray.length; i++) {
        if (!testArray[i])
            errors.push(i);
    }
    if (errors.length > 0) {
        for (i = 0; i < errors.length; i++) {
            console.log(typeTest + ' test ' + errors[i] +' (' + (testArray.length - 1) + ') did not pass');
        }
        return false
    }
    else {
        console.log('All ' + typeTest + ' tests passed.');
        return true;
    }
}


// Testing -- Card
var cardTests = [];
var testCard = new Card();
// Card should be set with null values
cardTests.push(assertFalse(testCard.shape));
cardTests.push(assertFalse(testCard.number));
cardTests.push(assertFalse(testCard.shading));
cardTests.push(assertFalse(testCard.colour));
// After calling card.setRandomValues(), all values should be set
testCard.setRandomValues();
cardTests.push(isACard(testCard));

console.log(runTests(cardTests, 'card'));


// Testing -- Deck
var deckTests = [];
var testDeck = new Deck(21);
// Deck.deck should start as an 21-card array
deckTests.push(assertEquals(testDeck.deck.length, 21));
// Each of the cards should have values set
for (var i = 0; i < testDeck.deck.length; i++) {
    card = testDeck.deck[i];
    deckTests.push(isACard(card));
}
//// If we call shuffle on the deck, it should be different than before
//// DOES NOT WORK due to object conversion
////oldDeck = testDeck.deck;
////testDeck.shuffle();
////deckTests.push(!decksEqual(oldDeck, testDeck.deck));
//// Dealing a card should remove it from the old deck
card = testDeck.deal();
deckTests.push(assertEquals(testDeck.deck.length, 20));

console.log(runTests(deckTests, 'deck'));


// Testing -- Table
var tableTests = []
var testTable = new Table(21);
// All cards should be real cards
tableTests.push(assertEquals(testTable.table.length, 12));
for (var i = 0; i < 12; i++) {
    var card = testTable.table[i];
    tableTests.push(isACard(card));
}
// and table.deck should have 9 cards left in it (21 - 12)
tableTests.push(assertEquals(testTable.deck.deck.length, 9));
// If 3 cards are removed from table.table, addThree should return the table to 12 cards
for (var i = 0; i < 3; i++) {
    testTable.table.pop();
}
testTable.addThree();
tableTests.push(assertEquals(testTable.table.length, 12));
// If a card is removed from table.table, the resulting table should have a length of 1 less and not contain any undefined values
var randCard = testTable.table[5];
var oldLength = testTable.table.length;
testTable.removeCards([randCard]);
tableTests.push(assertEquals(testTable.table.length, oldLength - 1));
for (var i = 0; i < testTable.table.length; i++) {
    tableTests.push(isACard(testTable.table[i]));  
}
// iterating over the table should return [card1, card2, card3], [card1, card2, card4], etc...
var it = testTable.iterateTable();
var state = it['state']
for (var inc = 0; inc < 3; inc++) {
    oldK = state.k;
    var it = testTable.iterateTable(state);
    state = it['state']
    var kIncremented = (state.k > oldK);
    tableTests.push(assertTrue(kIncremented));

}
console.log(runTests(tableTests, 'table'));


// Set Testing
setTests = [];
var card1 = new Card();
var card2 = new Card();
var card3 = new Card();
var threeCards = [card1, card2, card3];
// These three cards should be a set
card1.number = 1;
card2.number = 1;
card3.number = 1;
setTests.push(Card.isSet(threeCards));
// isSet should return True if one value is different for all cards
card1.shape = 0;
card2.shape = 1;
card3.shape = 2;
setTests.push(Card.isSet(threeCards));
// isSet should return false if an attribute is the same for two cards but different for the third
card1.colour = 0;
card2.colour = 0;
card3.colour = 2;
setTests.push(!Card.isSet(threeCards));

console.log(runTests(setTests, 'set'));


// Computer AI Testing
computerAITests = [];
var setTable = new Table(21);
var card1 = new Card();
var card2 = new Card();
var card3 = new Card();
// getSet should return the first three cards that form a set
card1.number = card2.number = card3.number = 1;
card1.shape = card2.shape = card3.shape = 1;
card1.shading = card2.shading = card3.shading = 2;
card1.colour = card2.colour = card3.colour = 0;
setTable.table[0] = card1;
setTable.table[1] = card2;
setTable.table[2] = card3;
computerAITests.push(assertTrue(setTable.getSet()));
// getSet should return false if no sets exists
noSet = new Table(21);
noSet.table = [];
card1.number = 2;
noSet.table[0] = card1;
noSet.table[1] = card2;
noSet.table[2] = card3;
computerAITests.push(assertFalse(noSet.getSet()));

console.log(runTests(computerAITests, 'computer'));
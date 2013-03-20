// Playing the game
table = new Table();
table.setUp();

// Create and add table div
// var tableDiv = document.createElement('div');
// tableDiv.setAttribute('class', 'table');
// Create and add cards in table.table to the document body
addCardsToDOM(table.table);
// document.body.appendChild(tableDiv);

for (var i = 0; i < 3; i++) {
    console.log(getSet(table)[i])
}




// if clickedCards has a length of 3
// check to see whether the cards constitute a set
// if so, increment the user score, set clickedCards to [], remove those three cards from the table, and deal three new cards
// otherwise, set clickedCards to []
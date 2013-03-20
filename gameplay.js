// Sets
function allSame(attr, threeCards) {
    var card1 = threeCards[0];
    var card2 = threeCards[1];
    var card3 = threeCards[2];
    if (card1[attr] === card2[attr] && card2[attr] === card3[attr] && card3[attr] === card1[attr])
        return true;
    return false;
}
function allDifferent(attr, threeCards) {
    var card1 = threeCards[0];
    var card2 = threeCards[1];
    var card3 = threeCards[2];
    if (card1[attr] !== card2[attr] && card2[attr] !== card3[attr] && card3[attr] !== card1[attr])
        return true;
    return false;
}
function isSet(threeCards) {
    for (var i = 0; i < 4; i++) {
        attr = cardValues[i];
        if (!(allSame(attr, threeCards) || allDifferent(attr, threeCards)))
            return false;
    }
    return true;
}

// Computer AI
function getSet(table) {
    var state, cards, it;
    while (state !== false) {
        it = table.iterateTable(state);
        state = it.state;
        cards = it.result;
        if (isSet(cards)) {
            return cards;
        }
    }
    return false;
}

// // Gameplay
// function determineSet(table, score, cardList) {
//     if isSet(cardList[0], cardList[1], cardList[2]) {
//         score++;
//         for (index in cardList) {
//             table.removeCard(cardList[index]);
//         }
//     }
// }
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
function getSet(table) {
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

// // Gameplay
// function determineSet(table, score, cardList) {
//     if isSet(cardList[0], cardList[1], cardList[2]) {
//         score++;
//         for (index in cardList) {
//             table.removeCard(cardList[index]);
//         }
//     }
// }
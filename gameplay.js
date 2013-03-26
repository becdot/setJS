// Sets
function isSet(threeCards) {
    if (threeCards.length !== 3) {
        return false
    }
    var card1 = threeCards[0];
    var card2 = threeCards[1];
    var card3 = threeCards[2];
    var sum = (card1.sum + card2.sum + card3.sum).toString();
    for (var i = 0; i < sum.length; i++) {
        if (sum[i] % 3 !== 0) {
            return false;
        }
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
        if (cards[0] && cards[1] && cards[2] && isSet(cards)) {
            console.log('found a set at ', state.i, state.j, state.k);
            return cards;
        }
    }
    return false;
}
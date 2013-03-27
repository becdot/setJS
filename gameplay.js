

// Computer AI
function getSet(table) {
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

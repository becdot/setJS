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

function cardToNode(card) {
    var CSSClasses = ['card'].concat(card.getValues()).join(' ');
    var numberNode = dom('p', null, ['Number: ' + card['number']]);
    var shapeNode = dom('p', null, ['Shape: ' + card.getValues('shape')]);
    var node = dom('div', {'class': CSSClasses}, [numberNode, shapeNode]);
    return node

}

function removeClassFromNode(className, cardNode) {
    var oldClasses = cardNode.getAttribute('class').split(' ');
    var index = oldClasses.indexOf(className);
    if (index != -1)
        oldClasses.splice(index, 1);
    var newClasses = oldClasses.join(' ');
    cardNode.setAttribute('class', newClasses);
}

function highlightCard(cardNode) {
    var oldClasses = cardNode.getAttribute('class');
    var newClasses = oldClasses + ' selected'
    cardNode.setAttribute('class', newClasses);
}

function unhighlightCard(cardNode) {
    removeClassFromNode('selected', cardNode);
}

function unhighlightAllCards(tableNode) {
    var parentNode = tableNode.parentNode;
    var table = parentNode.removeChild(tableNode);
    var cardNodes = table.getElementsByClassName('card');
    for (var i = 0; i < cardNodes.length; i++) {
        unhighlightCard(cardNodes[i]);
    }
    parentNode.appendChild(table);
}

function checkTableForSet() {
    if (isSet(table.clickedCards)) {
        alert('That is a set!'); 
        table.score += 1;
        console.log('score', table.score);
        table.removeCards(table.clickedCards);
        table.addThree();

    } else {
        alert('That is not a set.'); 
    }
}

function whenCardClicked(card) {
    return function(event) {
        var cardNode = event.currentTarget;
        var index;
        // if card has already been clicked on, remove it from the list of clicked cards
        if ((index = table.clickedCards.indexOf(card)) != -1) {
            unhighlightCard(cardNode);
            table.unclickCard(card);
        } else {
            highlightCard(cardNode);
            table.clickCard(card);
        }
        if (table.clickedCards.length === 3) {
            checkTableForSet();
            unhighlightAllCards(cardNode.parentNode);
            table.unclickAllCards();
            document.body.removeChild(cardNode.parentNode);
            addCardsToDOM(table.table);         
        }
    }
}

function addCardClick(cardNode, card) {
    cardNode.addEventListener('click', whenCardClicked(card));
}

function addCardsToDOM(cards) {
    var tableDiv = dom('div', {'class': 'table', 'id': 'table'}, []);
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < cards.length; i++) {
        cardNode = cardToNode(cards[i]);
        addCardClick(cardNode, cards[i]);
        fragment.appendChild(cardNode);
    }
    tableDiv.appendChild(fragment);
    document.body.appendChild(tableDiv);    
}
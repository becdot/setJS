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
    var index;
    var card1, card2, card3;
    // if card has already been clicked on, remove it from the list of clicked cards
    if (cardNode.style['font-weight'] === '900') {
        index = clickedCards.indexOf(cardNode);
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
        card1 = nodeToCard(clickedCards[0]);
        card2 = nodeToCard(clickedCards[1]);
        card3 = nodeToCard(clickedCards[2]);
        if (isSet(card1, card2, card3)) {
            alert('That is a set!');
            score += 1;
        } else {
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
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < cards.length; i++) {
        cardNode = cardToNode(cards[i], i);
        addCardClick(cardNode);
        fragment.appendChild(cardNode);
    }
    parentElement.appendChild(fragment);
}
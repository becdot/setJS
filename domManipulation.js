function createNode(name, attributes, childrenList) {
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

function addMessage(message) {
    var newMessage, oldMessage, messageNode, splitMessages, pNode;
    if (message.indexOf('\n') !== -1) {
        // if there is a line break in the message, create individual paragraph nodes for each line
        splitMessages = message.split('\n');
        newMessage = [];
        for (var i = 0; i < splitMessages.length; i++) {
            pNode = createNode('p', {'class': 'message'}, [splitMessages[i]])
            console.log('p node', pNode);
            newMessage.push(pNode);
        }
    } else {
        pNode = createNode('p', {'class': 'message'}, [message]);
        console.log('p node', pNode);
        newMessage = [pNode];
    }
    console.log('new message', newMessage);
    messageNode = document.getElementById('messages');
    console.log('messages node', messageNode);

    while (messageNode.firstChild) {
        messageNode.removeChild(messageNode.firstChild);
    }
    for (var i = 0; i < newMessage.length; i++) {
        messageNode.appendChild(newMessage[i]);
    }
}

function cardToNode(card) {
    var cardCSSClasses = ['card'].concat(card.getValues()).join(' ');
    var imageCSSClasses = ['image'].concat(card.getValues()).join(' ');
    var children = [];
    for (var i = 0; i < card.number; i++) {
        var imageDiv = createNode('div', {'class': imageCSSClasses}, []);
        children.push(imageDiv);
    }
    return createNode('div', {'class': cardCSSClasses}, children);
}

function highlightCard(cardNode) {
    var oldClasses = cardNode.getAttribute('class');
    var newClasses = oldClasses + ' selected';
    cardNode.setAttribute('class', newClasses);
}

function unhighlightCard(cardNode) {
    var oldClasses = cardNode.getAttribute('class').split(' ');
    var index = oldClasses.indexOf('selected');
    if (index != -1)
        oldClasses.splice(index, 1);
    var newClasses = oldClasses.join(' ');
    cardNode.setAttribute('class', newClasses);
}

function unhighlightAllCards(tableNode) {
    var parentNode = tableNode.parentNode;
    var removedTable = document.body.removeChild(tableNode);
    var cardNodes = removedTable.getElementsByClassName('card');
    for (var i = 0; i < cardNodes.length; i++) {
        unhighlightCard(cardNodes[i]);
    }
    parentNode.appendChild(removedTable);
}


function ifEnd(table) {
    if (table.deck.deck.length || table.getSet(table)) {
        return false;
    } else {
        window.clearInterval(computerInterval);
        if (table.score === table.computerScore) {
            addMessage('You tied: ' + table.score + ' to ' + table.computerScore);
        } else if (table.score > table.computerScore) {
            addMessage('You won: ' + table.score + ' to ' + table.computerScore);
        } else {
            addMessage('The computer has won: ' + table.computerScore + ' to ' + table.score);
        }
    }
}

function threeClickedCards(table, tableNode) {
    var clickedCards = table.clickedCards;
    if (Card.isSet(clickedCards)) {
        alert('That is a set!');
        table.updateAfterSet(clickedCards);
        addMessage('You: ' + table.score + '\n' + 'Computer: ' + table.computerScore);
        renderDOM(table);
        ifEnd(table);

    } else {
        addMessage('That is not a set.'); 
    }
}

function whenCardClicked(table, card) {
    return function(event) {
        var cardNode = event.currentTarget;
        var tableNode = cardNode.parentNode;
        // if card has already been clicked on, remove it from the list of clicked cards
        if (table.clickedCards.indexOf(card) != -1) {
            unhighlightCard(cardNode);
            table.unclickCard(card);
        } else {
            highlightCard(cardNode);
            table.clickCard(card);
        }
        if (table.clickedCards.length === 3) {
            unhighlightAllCards(tableNode);
            threeClickedCards(table, tableNode);
            table.unclickAllCards();         
        }
    }
}

function addCardClick(table, cardNode, card) {
    cardNode.addEventListener('click', whenCardClicked(table, card));
}


function computerMove(table) {
    return function() {
        var move;
        if (table) {
            if ((move = table.getSet(table))) {
                console.log('The computer got a set!');
                table.updateAfterSet(move, 'computer');
                addMessage(('You: ' + table.score + '\n' + 'Computer: ' + table.computerScore));
            } else {
                table.addThree()
            }
            renderDOM(table);
            ifEnd(table);
        }
    }
}

function addAIToDOM(table, delayInSecs) {
    computerInterval = window.setInterval(computerMove(table), delayInSecs * 1000);
}


function renderDOM(table) {
    var tableNode, fragment;
    var cards = table.table;
    if ((tableNode = document.getElementById('table')))
        document.body.removeChild(tableNode);
    fragment = document.createDocumentFragment();
    for (var i = 0; i < cards.length; i++) {
        cardNode = cardToNode(cards[i]);
        addCardClick(table, cardNode, cards[i]);
        fragment.appendChild(cardNode);
    }
    tableNode = createNode('div', {'class': 'table', 'id': 'table'}, []);
    tableNode.appendChild(fragment);
    document.body.appendChild(tableNode); 
}

function newGame(table, delayInSecs) {
    renderDOM(table);
    addAIToDOM(table, delayInSecs);
}
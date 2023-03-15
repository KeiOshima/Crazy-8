// cards.mjs
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10','J', 'K', 'Q']



export const range = (...args) => {
    let ranges = [];
    let start = 0;
    let end = 0;
    let inc = 0;
    let z = args.length;   
    // check number of elemetns in args and depending on how many there are assign those values to its respective start, end , and inc variable
    if (z == 1){
        end = args[0];
        start = 0
        inc = 1;
    }
    if( z == 2){
        start = args[0];
        end  = args[1];
        inc = 1;
    }
    if( z == 3){
        start = args[0];
        end = args[1];
        inc = args[2];
    }
  for (let x = start; x < end; x += inc) {
    ranges.push(x);
     
  }
  return ranges;
}

export const generateDeck = () => {
    let deck = [];
    for(let x = 0; x < 5; x++){
        for(let y = 0; y < ranks.length; y++){
            if(x = 1){
                const card = {suit: '♠️', rank: ranks[y]}
                deck.push(card);
            }
            if(x = 2){
                const card = {suit: '❤️', rank: ranks[y]}
                deck.push(card);
            }
            if(x = 3){
                const card = {suit: '♣️', rank: ranks[y]}
                deck.push(card);
            }
            if(x = 4){
                const card = {suit: '♦️', rank: ranks[y]}
                deck.push(card);
            }
        }
    }
    return deck;
}

export const handToString = (hand, sep='  ', numbers=false) => {
    let s = '';
    hand.forEach(function(ele, i) {
        s += `${numbers ? (i + 1) + ': ' : ''}${ele.rank ?? ''}${ele.suit ?? ''}${sep}`;
    });
    return s.trim();
};


export const draw  = (deck, n = 1) => {
    // using slice to get a copy of the original deck minus how many cards we want to draws
    const newDeckAfterDraw = deck.slice(0, deck.length - n);
    // getting the number of cards we drawed by having starting value in slice be the deck length minus how many cards we want to draw to the overall length of the deck as the top of the deck is the last element
    const cardsDrawn = deck.slice(deck.length - n, deck.length);
    return [newDeckAfterDraw, cardsDrawn];
};


// I implemented my shuffle algorithm based off the Fisher-Yates algorithm. I found this by searching sorting algorithm for a deck of cards and went to this stackoverflow post.
// https://stackoverflow.com/questions/59810241/how-to-fisher-yates-shuffle-a-javascript-array

export const shuffle = (deck) =>{
    const shuffledDeck = deck.slice();
    let temp = 0;
    for (let x = shuffledDeck.length-1; x >= 0; x--){
        let rand = Math.floor(Math.random() * (x + 1));
        temp = shuffledDeck[rand];
        shuffledDeck[rand] = shuffledDeck[x];
        shuffledDeck[x] = temp;
    }
    return shuffledDeck;
};

export const  deal = (cardArray, numHands = 2, cardsPerHand = 5) =>{

    // this is the deck that we will return we slice it by off of numHands * cardsPerHand
    let deck = cardArray.slice(0, (cardArray.length - (numHands * cardsPerHand)));
    let remainngCards = cardArray.length - (numHands * cardsPerHand);
    let hands = [];
    let IndexToStopDraw  = 0;
    let indexToBeginDraw = 0;

    for(let x = 0; x < numHands; x++){
        //here idex to stop draw represent wherer we want our first value for slice to be since the last element of our card array is actually the first element
        IndexToStopDraw = remainngCards + (x * cardsPerHand);
        // here index to begin draw to where we would start drawing from.
        indexToBeginDraw =  remainngCards + ((x + 1) * cardsPerHand);
        hands.push(cardArray.slice(IndexToStopDraw, indexToBeginDraw));
    }
    return { deck, hands };
};


export const matchesAnyProperty = (obj, matchObj) =>{
    // search through everybody in the obj
    for (let keys in obj){
        // also search thorugh every object in the matchObj.
        for( let keys2 in matchObj){
            // if a key is in matchObj we also want to check that its values are the same ie. wheter or not they are the same rank.
            if(keys in matchObj){
                if(matchObj[keys2] == obj[keys2]){
                    return true;
                }
            }
        }
    }
    return false;
};
// helper function taht helps us compare two arrays that are filled with card object and see if any of the cards have matching rank,suit or is a rank of 8
// we will return an object whihc has one boolean value and a numer indicating the index of where we found the card that matches the specifications above 
export const checkIfPlayable = (playerHand, nextPlay) =>{
    let counter = 0;
    let x = 0;
    // start from the top and if we find a card tha tmatches the specifications we want we break the loop.
    for(x = playerHand.length - 1; x >= 0; x--){
        if(playerHand[x].rank === '8'){
            counter += 2;
            break;
        }
        else if(playerHand[x].rank == nextPlay.rank){
            counter += 2;
            break;
        }
        else if(playerHand[x].suit == nextPlay.suit){
            counter += 2;
            break;
        }
    }
    // if our counter is not greater than or equal to 2 then we have not found a card from obj that has the same suit or rank in nextPlay and there is no card in playerHand that is rank 8.
    if(counter >= 2){
        return [true, x];
    }
    else{
        return [false, x];
    }
};

// similar implementation to CheckIfPlayable
export const  drawUntilPlayable = (deck, matchObj) =>{
    let counter = 0;
    let newDeck = [];
    let drawnCard = [];
    for(let x = deck.length - 1; x >= 0; x--){
        if(deck[x].rank === '8'){
            counter = x;
            break;
        }
        else if(deck[x].rank === matchObj.rank){
            counter = x;
            break;
        }
        else if(deck[x].suit === matchObj.suit){
            counter = x;
            break;
        }
    }
    // if our counter is 0 then have our drawncards array be a copy of the original deck but reversed.
    if( counter == 0){
       drawnCard = deck.slice().reverse()
    }
    // if we found a card that is playable. our new deck will be equal to the the bottom of the deck to the card that would come after the playable card 
    // and our hand will be th eindex where we drew tha playable card to the very end of the array in other words the top of the deck. 
    else {
        drawnCard = deck.slice(counter);
        newDeck = deck.slice(0, counter)
    }
    return [newDeck, drawnCard];
};




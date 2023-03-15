import {question} from 'readline-sync';
import clear from 'clear';
import {readFile} from 'fs';
import * as cards from '../lib/cards.mjs'



let unshuffleddeck = cards.generateDeck();
let shuffled = cards.shuffle(unshuffleddeck);
let {deck, hands} = cards.deal(shuffled);
let [playerHand, computerHand] = hands;
let discardPile = [];
let startCard = deck.pop()
// keep getting the top value form the dekc until we dont get an 8
while(shuffled.pop() === '8'){
    startCard = deck.pop();
}
let nextPlay = startCard;
discardPile = nextPlay;
console.log("Welcome to crazy 8 would you like to play against a computer or someone else?");
console.log("if you want to play against a computer enter 0");
console.log("if you want to play against a someon else enter 1");
let gameType= question(": ");
if(gameType == 0){
    console.log("you chose to play against a computer");
    playGameComputer(deck, playerHand, computerHand, discardPile, nextPlay);
}
else{
    console.log("you chose to play against a someone else");
    playGameHuman(deck, playerHand, computerHand, discardPile, nextPlay);
}

    
function playGameComputer(deck, playerHand, computerHand, discardPile, nextPlay){
    while(playerHand.length > 0 && computerHand.length > 0){
        if (deck.length === 0) {
            console.log("Deck is empty. Generating new deck...");
            const unshuffleddeck = cards.generateDeck();
            const shuffled = cards.shuffle(unshuffleddeck);
            deck = shuffled;
        }
        console.log();
        console.log("                   CRAZY 8's");
        console.log("-----------------------------------------------")
        console.log("|        Next suit/rank to play: ➡️ " + nextPlay.rank + nextPlay.suit + " ⬅       |");
        console.log("-----------------------------------------------");
        console.log("|        Top of discard pile: " + nextPlay.rank + nextPlay.suit + "              |");
        console.log("|        Number of cards left in deck: " + deck.length + "     |");
        console.log("-----------------------------------------------");
        console.log("💻✋ (computer hand): " + cards.handToString(computerHand));
        console.log("🧍✋ (player hand): " + cards.handToString(playerHand));
        console.log("-----------------------------------------------");
     
        // helper function from cards.mjs
        let isPlayable = cards.checkIfPlayable(playerHand, nextPlay);
        let [bool, index] = isPlayable;
        //if true then we know the player has a card they can play sp we ask them to choose whihc one they want to play
        if (bool == true){
            console.log("🧍 Player's turn...");
            console.log("Enter the number of the card you would like to play");
            for(let x = 0; x < playerHand.length; x++){
                let y = x + 1
                console.log(y + ": " + playerHand[x].rank + playerHand[x].suit);
        
            }
            let userInput = question(": ");
            // we do user input minus one since the indexing for the array starts at 0 not 1.
            let option = userInput - 1;
            console.log("You Played: " + playerHand[option].rank + playerHand[option].suit);
            if (playerHand[option].rank === '8'){
                console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
                console.log("1: ♠️");
                console.log("2: ❤️");
                console.log("3: ♣️ ");
                console.log("4: ♦️");
                let suiteChoice = question(": ");
                if(suiteChoice == 1){
                    nextPlay.suit = "♠️";
                    console.log("you have chose to set the suite to ♠️");
                }
                else if(suiteChoice == 2){
                    nextPlay.suit = "❤️";
                    console.log("you have chose to set the suite to ❤️");
                }
                else if(suiteChoice == 3){
                    nextPlay.suit = "♣️";
                    console.log("you have chose to set the suite to ♣️")       
                }
                else if(suiteChoice == 4){
                    nextPlay.suit = " ♦️";
                    console.log("you have chose to set the suite to  ♦️");        
                }
                nextPlay.rank = "";
                // chaing the display information fro the discardPile
                discardPile.rank =  playerHand[option].rank;
                discardPile.suit =  playerHand[option].suit;
                                            
            }
            else{
                 // chaing the display information for the discardPile and nextPlay 
                nextPlay.rank = playerHand[option].rank;
                nextPlay.suit = playerHand[option].suit;
                discardPile.rank = playerHand[option].rank;
                discardPile.suit = playerHand[option].suit;
            }
            // removing cards that player chose to play from the object playerHand.

            playerHand.splice(option, 1);
            console.log(playerHand.length);
    
        }
    
        // if false then we know a player does not have  a playable card so we make them draw a card until they have one.   
        if(bool == false){
                console.log("🧍 Player's turn...");
                console.log("🧍 You have no playable cards");
                console.log("Press ENTER to draw cards until matching: " + nextPlay.rank +", "+ nextPlay.suit + ", 8");
                question();
                let drawedHand = cards.drawUntilPlayable(deck, nextPlay);
                let [observedDeck, observedCardsDrawn] = drawedHand;
                console.log("cards Drawn: " +  cards.handToString(observedCardsDrawn))
                console.log("Card played: " + observedCardsDrawn[0].suit +  observedCardsDrawn[0].rank);
                // similar process as above
                if(observedCardsDrawn[0].rank === '8'){
                    console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
                    console.log("1: ♠️");
                    console.log("2: ❤️");
                    console.log("3: ♣️ ");
                    console.log("4: ♦️");
                    let suiteChoice = question(": ");
                    discardPile.rank =  observedCardsDrawn[0].rank;
                    discardPile.suit =  observedCardsDrawn[0].suit;
                    nextPlay.rank = " ";
                    if(suiteChoice == 1){
                        nextPlay.suit = "♠️";
                        console.log("you have chose to set the suite to ♠️");
                    }
                    else if(suiteChoice == 2){
                        nextPlay.suit = "❤️";
                        console.log("you have chose to set the suite to ❤️");
                    }
                    else if(suiteChoice == 3){
                        nextPlay.suit = "♣️";
                        console.log("you have chose to set the suite to ♣️")       
                    }
                    else if(suiteChoice == 4){
                        nextPlay.suit = "♦️";
                        console.log("you have chose to set the suite to  ♦️");        
                    }
                    let toAddToHand = observedCardsDrawn.slice(1);
                    playerHand = playerHand.concat(toAddToHand);
                    deck = observedDeck;
                }
                else{
                    nextPlay.rank = observedCardsDrawn[0].rank
                    nextPlay.suit = observedCardsDrawn[0].suit
                    discardPile.rank = observedCardsDrawn[0].rank
                    discardPile.suit = observedCardsDrawn[0].suit
                    // get the remaingin cards they did not play and put it in the playerHand object.
                    let toAddToHand = observedCardsDrawn.slice(1);
                    playerHand = playerHand.concat(toAddToHand);
                    deck = observedDeck;
                }
        }
        console.log("press enter to continue");
        question();
        console.log();

        if(playerHand.length === 0){
            break;
            
        }
    
        if (deck.length === 0) {
            console.log("Deck is empty. Generating new deck...");
            const unshuffleddeck = cards.generateDeck();
            const shuffled = cards.shuffle(unshuffleddeck);
            deck = shuffled;
        }
        
        // now we have the computer go 
        console.log();
        console.log("                   CRAZY 8's");
        console.log("-----------------------------------------------")
        console.log("|        Next suit/rank to play: ➡️ " + nextPlay.rank + nextPlay.suit + " ⬅       |");
        console.log("-----------------------------------------------");
        console.log("|        Top of discard pile: " + nextPlay.rank + nextPlay.suit + "              |");
        console.log("|        Number of cards left in deck: " + deck.length + "     |");
        console.log("-----------------------------------------------");
        console.log("💻✋ (computer hand): " + cards.handToString(computerHand));
        console.log("🧍✋ (player hand): " + cards.handToString(playerHand));
        console.log("-----------------------------------------------");
    
        isPlayable = cards.checkIfPlayable(computerHand, nextPlay);
        [bool, index] = isPlayable;
    
        // if true then we do very similar process for the player but we use the index we get from CherckIfPlayable to automatically choose the correct card for the computer to play. 
        if (bool == true){
            console.log("💻 Computers turn...");
            console.log("Enter the number of the card you would like to play");
            console.log("computer played: " + computerHand[index].rank + computerHand[index].suit);
            if(computerHand[index].rank === '8'){
                console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
                console.log("1: ♠️");
                console.log("2: ❤️");
                console.log("3: ♣️ ");
                console.log("4: ♦️");
                console.log("computer chose  ♦️");
                discardPile.rank =  computerHand[index].rank;
                discardPile.suit =  computerHand[index].suit;
                nextPlay.rank = "";
                nextPlay.suit = "♦️";
            }
            else{
                nextPlay.rank = computerHand[index].rank;
                nextPlay.suit = computerHand[index].suit;
                discardPile.rank = computerHand[index].rank;
                discardPile.suit = computerHand[index].suit;
            }
    
            computerHand.splice(index, 1);
            console.log(computerHand.length);
        }
    
        if(bool == false){
            console.log("💻 computers turn...");
            console.log("😔 computer has no playable cards");
            let drawedHand = cards.drawUntilPlayable(deck, nextPlay);
            let [observedDeck, observedCardsDrawn] = drawedHand;
            console.log("cards Drawn: " +  cards.handToString(observedCardsDrawn))
            console.log("Card played: " + observedCardsDrawn[0].suit +  observedCardsDrawn[0].rank);
            if(observedCardsDrawn[0].rank === '8'){
                console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
                console.log("1: ♠️");
                console.log("2: ❤️");
                console.log("3: ♣️ ");
                console.log("4: ♦️");
                console.log("computer chose  ♦️");
                discardPile.rank =  observedCardsDrawn[0].rank;
                discardPile.suit =  observedCardsDrawn[0].suit;
                nextPlay.suit = "♦️";
                nextPlay.rank = " ";
                let toAddToHand = observedCardsDrawn.slice(1);
                computerHand = computerHand.concat(toAddToHand);
                deck = observedDeck;
            }
            else{
                nextPlay.rank = observedCardsDrawn[0].rank
                nextPlay.suit = observedCardsDrawn[0].suit
                discardPile.rank = observedCardsDrawn[0].rank
                discardPile.suit = observedCardsDrawn[0].suit
                let toAddToHand = observedCardsDrawn.slice(1);
                computerHand = computerHand.concat(toAddToHand);
                deck = observedDeck;
    
            }
    
        }

    }


    console.log();
    if(playerHand.length === 0){
        console.log("Player Wins!!!");
    }
    else{
        console.log("Computer Wins!!!!");
    }

   
}


function playGameHuman(deck, playerHand, computerHand, discardPile, nextPlay){
    while(playerHand.length > 0 && computerHand.length > 0){
        if (deck.length === 0) {
            console.log("Deck is empty. Generating new deck...");
            const unshuffleddeck = cards.generateDeck();
            const shuffled = cards.shuffle(unshuffleddeck);
            deck = shuffled;
        }
        console.log();
        console.log("                   CRAZY 8's");
        console.log("-----------------------------------------------");
        console.log("|        Next suit/rank to play: ➡️ " + nextPlay.rank + nextPlay.suit + " ⬅       |");
        console.log("-----------------------------------------------");
        console.log("|        Top of discard pile: " + nextPlay.rank + nextPlay.suit + "              |");
        console.log("|        Number of cards left in deck: " + deck.length + "     |");
        console.log("-----------------------------------------------");
        console.log("💻✋ (player 1 hand): " + cards.handToString(playerHand));
        console.log("🧍✋ (player 2 hand): " + cards.handToString(computerHand));
        console.log("-----------------------------------------------");
     
        // helper function from cards.mjs
        let isPlayable = cards.checkIfPlayable(playerHand, nextPlay);
        let [bool, index] = isPlayable;
        //if true then we know the player has a card they can play sp we ask them to choose whihc one they want to play
        if (bool == true){
            console.log("🧍 Player's turn...");
            console.log("Enter the number of the card you would like to play");
            for(let x = 0; x < playerHand.length; x++){
                let y = x + 1
                console.log(y + ": " + playerHand[x].rank + playerHand[x].suit);
        
            }
            let userInput = question(": ");
            // we do user input minus one since the indexing for the array starts at 0 not 1.
            let option = userInput - 1;
            console.log("You Played: " + playerHand[option].rank + playerHand[option].suit);
            if (playerHand[option].rank === '8'){
                console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
                console.log("1: ♠️");
                console.log("2: ❤️");
                console.log("3: ♣️ ");
                console.log("4: ♦️");
                let suiteChoice = question(": ");
                if(suiteChoice == 1){
                    nextPlay.suit = "♠️";
                    console.log("you have chose to set the suite to ♠️");
                }
                else if(suiteChoice == 2){
                    nextPlay.suit = "❤️";
                    console.log("you have chose to set the suite to ❤️");
                }
                else if(suiteChoice == 3){
                    nextPlay.suit = "♣️";
                    console.log("you have chose to set the suite to ♣️")       
                }
                else if(suiteChoice == 4){
                    nextPlay.suit = " ♦️";
                    console.log("you have chose to set the suite to  ♦️");        
                }
                nextPlay.rank = "";
                // chaing the display information fro the discardPile
                discardPile.rank =  playerHand[option].rank;
                discardPile.suit =  playerHand[option].suit;
                                            
            }
            else{
                 // chaing the display information for the discardPile and nextPlay 
                nextPlay.rank = playerHand[option].rank;
                nextPlay.suit = playerHand[option].suit;
                discardPile.rank = playerHand[option].rank;
                discardPile.suit = playerHand[option].suit;
            }
            // removing cards that player chose to play from the object playerHand.

            playerHand.splice(option, 1);
            console.log(playerHand.length);
    
        }
    
        // if false then we know a player does not have  a playable card so we make them draw a card until they have one.   
        if(bool == false){
                console.log("🧍 Player's turn...");
                console.log("🧍 You have no playable cards");
                console.log("Press ENTER to draw cards until matching: " + nextPlay.rank +", "+ nextPlay.suit + ", 8");
                question();
                let drawedHand = cards.drawUntilPlayable(deck, nextPlay);
                let [observedDeck, observedCardsDrawn] = drawedHand;
                console.log("cards Drawn: " +  cards.handToString(observedCardsDrawn))
                console.log("Card played: " + observedCardsDrawn[0].suit +  observedCardsDrawn[0].rank);
                // similar process as above
                if(observedCardsDrawn[0].rank === '8'){
                    console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
                    console.log("1: ♠️");
                    console.log("2: ❤️");
                    console.log("3: ♣️ ");
                    console.log("4: ♦️");
                    let suiteChoice = question(": ");
                    discardPile.rank =  observedCardsDrawn[0].rank;
                    discardPile.suit =  observedCardsDrawn[0].suit;
                    nextPlay.rank = " ";
                    if(suiteChoice == 1){
                        nextPlay.suit = "♠️";
                        console.log("you have chose to set the suite to ♠️");
                    }
                    else if(suiteChoice == 2){
                        nextPlay.suit = "❤️";
                        console.log("you have chose to set the suite to ❤️");
                    }
                    else if(suiteChoice == 3){
                        nextPlay.suit = "♣️";
                        console.log("you have chose to set the suite to ♣️")       
                    }
                    else if(suiteChoice == 4){
                        nextPlay.suit = "♦️";
                        console.log("you have chose to set the suite to  ♦️");        
                    }
                    let toAddToHand = observedCardsDrawn.slice(1);
                    playerHand = playerHand.concat(toAddToHand);
                    deck = observedDeck;
                }
                else{
                    nextPlay.rank = observedCardsDrawn[0].rank
                    nextPlay.suit = observedCardsDrawn[0].suit
                    discardPile.rank = observedCardsDrawn[0].rank
                    discardPile.suit = observedCardsDrawn[0].suit
                    // get the remaingin cards they did not play and put it in the playerHand object.
                    let toAddToHand = observedCardsDrawn.slice(1);
                    playerHand = playerHand.concat(toAddToHand);
                    deck = observedDeck;
                }
        }
        console.log("press enter to continue");
        question();
        console.log();

        if(playerHand.length === 0){
            break;
            
        }


        if (deck.length === 0) {
            console.log("Deck is empty. Generating new deck...");
            const unshuffleddeck = cards.generateDeck();
            const shuffled = cards.shuffle(unshuffleddeck);
            deck = shuffled;
        }
        
        console.log();
        console.log("                   CRAZY 8's");
        console.log("-----------------------------------------------")
        console.log("|        Next suit/rank to play: ➡️ " + nextPlay.rank + nextPlay.suit + " ⬅       |");
        console.log("-----------------------------------------------");
        console.log("|        Top of discard pile: " + nextPlay.rank + nextPlay.suit + "              |");
        console.log("|        Number of cards left in deck: " + deck.length + "     |");
        console.log("-----------------------------------------------");
        console.log("🧍✋ (player 1 hand): " + cards.handToString(playerHand));
        console.log("🧍✋ (player 2 hand): " + cards.handToString(computerHand));
        console.log("-----------------------------------------------");
     
        // helper function from cards.mjs
        isPlayable = cards.checkIfPlayable(computerHand, nextPlay);
        [bool, index] = isPlayable;
        //if true then we know the player has a card they can play sp we ask them to choose whihc one they want to play
        if (bool == true){
            console.log("🧍 Player 2 turn...");
            console.log("Enter the number of the card you would like to play");
            for(let x = 0; x < computerHand.length; x++){
                let y = x + 1
                console.log(y + ": " + computerHand[x].rank + computerHand[x].suit);
        
            }
            let userInput = question(": ");
            // we do user input minus one since the indexing for the array starts at 0 not 1.
            let option = userInput - 1;
            console.log("You Played: " + computerHand[option].rank + computerHand[option].suit);
            if (computerHand[option].rank === '8'){
                console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
                console.log("1: ♠️");
                console.log("2: ❤️");
                console.log("3: ♣️ ");
                console.log("4: ♦️");
                let suiteChoice = question(": ");
                if(suiteChoice == 1){
                    nextPlay.suit = "♠️";
                    console.log("you have chose to set the suite to ♠️");
                }
                else if(suiteChoice == 2){
                    nextPlay.suit = "❤️";
                    console.log("you have chose to set the suite to ❤️");
                }
                else if(suiteChoice == 3){
                    nextPlay.suit = "♣️";
                    console.log("you have chose to set the suite to ♣️")       
                }
                else if(suiteChoice == 4){
                    nextPlay.suit = " ♦️";
                    console.log("you have chose to set the suite to  ♦️");        
                }
                nextPlay.rank = "";
                // chaing the display information fro the discardPile
                discardPile.rank =  computerHand[option].rank;
                discardPile.suit =  computerHand[option].suit;
                                            
            }
            else{
                 // chaing the display information for the discardPile and nextPlay 
                nextPlay.rank = computerHand[option].rank;
                nextPlay.suit = computerHand[option].suit;
                discardPile.rank = computerHand[option].rank;
                discardPile.suit = computerHand[option].suit;
            }
            // removing cards that player chose to play from the object playerHand.

            computerHand.splice(option, 1);
            console.log(computerHand.length);
    
        }
    
        // if false then we know a player does not have  a playable card so we make them draw a card until they have one.   
        if(bool == false){
                console.log("🧍 Player 2 turn...");
                console.log("🧍 You have no playable cards");
                console.log("Press ENTER to draw cards until matching: " + nextPlay.rank +", "+ nextPlay.suit + ", 8");
                question();
                let drawedHand = cards.drawUntilPlayable(deck, nextPlay);
                let [observedDeck, observedCardsDrawn] = drawedHand;
                console.log("cards Drawn: " +  cards.handToString(observedCardsDrawn))
                console.log("Card played: " + observedCardsDrawn[0].suit +  observedCardsDrawn[0].rank);
                // similar process as above
                if(observedCardsDrawn[0].rank === '8'){
                    console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
                    console.log("1: ♠️");
                    console.log("2: ❤️");
                    console.log("3: ♣️ ");
                    console.log("4: ♦️");
                    let suiteChoice = question(": ");
                    discardPile.rank =  observedCardsDrawn[0].rank;
                    discardPile.suit =  observedCardsDrawn[0].suit;
                    nextPlay.rank = " ";
                    if(suiteChoice == 1){
                        nextPlay.suit = "♠️";
                        console.log("you have chose to set the suite to ♠️");
                    }
                    else if(suiteChoice == 2){
                        nextPlay.suit = "❤️";
                        console.log("you have chose to set the suite to ❤️");
                    }
                    else if(suiteChoice == 3){
                        nextPlay.suit = "♣️";
                        console.log("you have chose to set the suite to ♣️")       
                    }
                    else if(suiteChoice == 4){
                        nextPlay.suit = "♦️";
                        console.log("you have chose to set the suite to  ♦️");        
                    }
                    let toAddToHand = observedCardsDrawn.slice(1);
                    computerHand = computerHand.concat(toAddToHand);
                    deck = observedDeck;
                }
                else{
                    nextPlay.rank = observedCardsDrawn[0].rank
                    nextPlay.suit = observedCardsDrawn[0].suit
                    discardPile.rank = observedCardsDrawn[0].rank
                    discardPile.suit = observedCardsDrawn[0].suit
                    // get the remaingin cards they did not play and put it in the playerHand object.
                    let toAddToHand = observedCardsDrawn.slice(1);
                    computerHand = computerHand.concat(toAddToHand);
                    deck = observedDeck;
                }
        }
        console.log("press enter to continue");
        question();
        console.log();
    }

    if(playerHand.length === 0){
        console.log("Player 1 Wins!!!");
    }
    else{
        console.log("PLayer 2 Wins!!!!");
    }

   
}
  


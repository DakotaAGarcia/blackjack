//-------------------------------------Deck of cards:-----------------------------------------


let deck_amount = 1;
const createDeck = () =>{
    const suits = ["clubs", "diamonds", "hearts", "spades"];
    const values =["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A" ];

let deck = [];

for(let d = 0; d < deck_amount; d++){
    for(let suit of suits){
        for (let value of values){
            deck.push({ value, suit });
        }
    }
}
    return deck;
};

//-------------------------------------Shuffle the deck--------------------------------------

const shuffle = deck =>{
    for( let i = deck.length - 1; i > 0; i --){
        const j = Math.floor(Math.random() * (i + 1));
        ([deck[i], deck[j]] = [deck[j], deck[i]])
    }
};

//-----------------------------------Deal 2 cards to palyer-------------------------------------


const dealCards = deck => [deck.pop(), deck.pop()];

//-----------------------------------Check the hands score--------------------------------------
let dealerWins = 0;
let playerWins = 0;

const totalScore = hand =>{
    let score = 0

    let ace = false;

//-----------------------------------------ace check------------------------------------------
    for(let card of hand) {
        let value = card.value;

        if( value === "A"){
            ace = true;
            value = 11;
        }else if(["K", "Q", "J"].includes(value)){
            value = 10;
        }
        score += parseInt(value);
    }

    if(ace && score > 21){
        score -= 10;
    }

    return score;
};

//--------------------------------------bust check---------------------------------------------

const busted = hand => totalScore(hand) > 21;

//-------------------------------------Declare winner-------------------------------------------

const getWinner = (playerHand, dealerHand) =>{
    const playerScore = totalScore(playerHand);
    const dealerScore = totalScore(dealerHand);

    if(busted(playerHand)){
        return "Dealer Wins";
    }else if(busted(dealerHand)){
        return "Player Wins";
    }else if( dealerScore === playerScore){
        return "Its a draw"
    }else if(playerScore === 21 && playerHand.length === 2){
        return "Player Blackjack";
    }else if(dealerScore === 21 && dealerHand.length === 2){
        return "Dealer Blackjack"
    }else{
        return playerScore > dealerScore ? "Player Wins" : "Dealer Wins";
    }
};



//----------------------------------------------Display card------------------------------------------
const displayCard = (card) => {
    return `${card.value} of ${card.suit}`;
  };
  
  //-----------------------------------------Update hand display---------------------------------------
  const updateHandDisplay = (handElement, hand, hideCard = false) => {
    handElement.innerHTML = '<h2>' + handElement.id.charAt(0).toUpperCase() + handElement.id.slice(1) + '</h2>';
    hand.forEach((card, index) => {
      if (hideCard && handElement.id === 'dealer-hand' && index === 0) {
        handElement.innerHTML += `<p>Face Down</p>`;
      } else {
        handElement.innerHTML += `<p>${displayCard(card)}</p>`;
      }
    });
  };
  
  //-----------------------------------------------Play Blackjack---------------------------------------
  const playBlackJack = () => {
    
    document.getElementById('player-hand').innerHTML = '';
    document.getElementById('dealer-hand').innerHTML = '';
    const deck = createDeck();
    shuffle(deck);
  
    const playerHand = dealCards(deck);
    const dealerHand = dealCards(deck);
  
    const playerHandElement = document.getElementById('player-hand');
    const dealerHandElement = document.getElementById('dealer-hand');
  
    updateHandDisplay(playerHandElement, playerHand);
    updateHandDisplay(dealerHandElement, dealerHand, true);
  
    //-----------------------------------------Hit button logic---------------------------------------
    document.getElementById('hit-button').disabled = false;
    document.getElementById('hold-button').disabled = false;
    document.getElementById('hit-button').addEventListener('click', () => {
        playerHand.push(deck.pop());
        updateHandDisplay(playerHandElement, playerHand);
    
        if (busted(playerHand)) {
          document.getElementById('message').innerText = 'Player Busted! Dealer Wins!';
          document.getElementById('hit-button').disabled = true;
          document.getElementById('hold-button').disabled = true;
        }
      });
  
//-----------------------------------------Hold button logic--------------------------------------
document.getElementById('hold-button').addEventListener('click', () => {
    // Dealer's turn
    const playerScore = totalScore(playerHand);
    while (
      totalScore(dealerHand) < 17 ||
      (totalScore(dealerHand) < 18 && dealerHand.some(card => card.value === 'A')) ||
      totalScore(dealerHand) < playerScore
    ) {
      dealerHand.push(deck.pop());
    }
  
    updateHandDisplay(dealerHandElement, dealerHand);
  
    const winner = getWinner(playerHand, dealerHand);
    if (winner === "Dealer Wins") {
      dealerWins++;
    } else if (winner === "Player Wins") {
      playerWins++;
    }
    
    document.getElementById('message').innerText = `Winner: ${winner}`;
    document.getElementById('hit-button').disabled = true;
    document.getElementById('hold-button').disabled = true;
    document.getElementById('dealer-wins').innerText = `Dealer Wins: ${dealerWins}`;
    document.getElementById('player-wins').innerText = `Player Wins: ${playerWins}`;

  });
  };
  
  //----------------------------------------------Start button logic------------------------------------
  document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('message').innerText = '';
    playBlackJack();
  });
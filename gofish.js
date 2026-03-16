$(document).ready(function() {
    
    // Game Variables
    const baseRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const jpDictionary = {
        '2':'二', '3':'三', '4':'四', '5':'五', '6':'六', '7':'七', '8':'八', 
        '9':'九', '10':'十', 'J':'J', 'Q':'Q', 'K':'K', 'A':'A'
    };
    
    let deck = [];
    let playerHand = [];
    let aiHand = [];
    let playerScore = 0;
    let aiScore = 0;
    let isJapanese = false;
    let isAiTurn = false; 

    // --- GAME ENGINE FUNCTIONS ---

    function buildDeck() {
        deck = [];
        for(let i = 0; i < 4; i++) {
            deck = deck.concat(baseRanks);
        }
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealGame() {
        buildDeck();
        playerHand = deck.splice(0, 5); 
        aiHand = deck.splice(0, 5);     
        playerScore = 0;
        aiScore = 0;
        isAiTurn = false;
        
        updateScreen();
        $('#game-messages').empty(); 
        logMessage("> NEW GAME STARTED. YOUR TURN.");
    }

    // --- JQUERY DOM MANIPULATION & SCORING ---

    function updateScreen() {
        $('#player-area .cards-container').empty();
        $('#ai-area .cards-container').empty();

        aiHand.forEach(() => {
            $('#ai-area .cards-container').append('<div class="card hidden"></div>');
        });

        playerHand.forEach(cardVal => {
            let displayVal = isJapanese ? jpDictionary[cardVal] : cardVal;
            let lockedClass = isAiTurn ? 'locked' : '';
            let cardElement = $(`<div class="card ${lockedClass}" data-val="${cardVal}">${displayVal}</div>`);
            $('#player-area .cards-container').append(cardElement);
        });

        // Update Scoreboard on UI
        $('#p-score').text(playerScore);
        $('#ai-score').text(aiScore);
    }

    function logMessage(msg) {
        $('#game-messages').prepend(`<p>${msg}</p>`);
        $('#game-messages p:gt(4)').remove(); 
    }

    // BOOK (MAtch) CHECKER LOGIC
    function checkBooks() {
        let foundBook = false;

        //  Check Player Hand
        let pCounts = {};
        playerHand.forEach(card => pCounts[card] = (pCounts[card] || 0) + 1);
        for (let card in pCounts) {
            if (pCounts[card] === 4) { // 4 of a kind
                playerScore++;
                playerHand = playerHand.filter(c => c !== card); // Remove from hand
                logMessage(`> YOU COMPLETED A BOOK OF [ ${card} ]!`);
                foundBook = true;
            }
        }

        //  Check AI Hand
        let aiCounts = {};
        aiHand.forEach(card => aiCounts[card] = (aiCounts[card] || 0) + 1);
        for (let card in aiCounts) {
            if (aiCounts[card] === 4) { // 4 of a kind
                aiScore++;
                aiHand = aiHand.filter(c => c !== card); // Remove from hand
                logMessage(`> MAINFRAME COMPLETED A BOOK OF [ ${card} ]!`);
                foundBook = true;
            }
        }

        if (foundBook) updateScreen();
        checkGameOver();
    }

    function checkGameOver() {
        if (deck.length === 0 && playerHand.length === 0 && aiHand.length === 0) {
            isAiTurn = true; // Lock the board
            let winner = playerScore > aiScore ? "YOU WIN!" : (aiScore > playerScore ? "MAINFRAME WINS!" : "TIE GAME!");
            logMessage(`> SYSTEM HALTED. ${winner}`);
        }
    }

    // --- THE AI LOGIC ---

    function aiTurn() {
        if (aiHand.length === 0) {
            logMessage("> MAINFRAME HAND EMPTY. DRAWING...");
            if (deck.length > 0) aiHand.push(deck.pop());
            isAiTurn = false;
            updateScreen();
            logMessage("> YOUR TURN.");
            return;
        }

        logMessage("> MAINFRAME IS THINKING...");

        setTimeout(function() {
            let randomIndex = Math.floor(Math.random() * aiHand.length);
            let askedCard = aiHand[randomIndex];
            
            logMessage(`> MAINFRAME ASKS: DO YOU HAVE A [ ${askedCard} ] ?`);

            if (playerHand.includes(askedCard)) {
                logMessage(`> SYSTEM: YOU LOST YOUR [ ${askedCard} ]!`);
                
                let cardsToTransfer = 0;
                playerHand = playerHand.filter(card => {
                    if (card === askedCard) { cardsToTransfer++; return false; }
                    return true; 
                });
                
                for(let i=0; i < cardsToTransfer; i++) { aiHand.push(askedCard); }
                
                updateScreen();
                checkBooks(); // Check if this steal made a book
                logMessage(`> MAINFRAME GETS TO GO AGAIN.`);
                
                setTimeout(aiTurn, 2000); 
                
            } else {
                logMessage("> YOU SAID: 'GO FISH'.");
                if (deck.length > 0) {
                    aiHand.push(deck.pop());
                    logMessage("> MAINFRAME DREW A CARD.");
                } else {
                    logMessage("> DECK IS EMPTY.");
                }
                
                checkBooks();
                isAiTurn = false;
                logMessage("> YOUR TURN.");
                updateScreen();
            }
        }, 1500); 
    }

    // --- EVENT LISTENERS ---

    $('#langBtn').on('click', function() {
        isJapanese = !isJapanese; 
        updateScreen(); 
        logMessage(isJapanese ? "> LANGUAGE: JAPANESE" : "> LANGUAGE: ENGLISH");
    });

    $('#dealBtn').on('click', function() {
        dealGame();
    });

    $('#player-area').on('click', '.card', function() {
        if (isAiTurn) {
            logMessage("> ERROR: NOT YOUR TURN.");
            return; 
        }

        let askedCard = $(this).data('val'); 
        logMessage(`> YOU ASKED FOR: [ ${askedCard} ]`);

        if (aiHand.includes(askedCard)) {
            logMessage(`> MAINFRAME HAS [ ${askedCard} ]!`);
            
            let cardsToTransfer = 0;
            aiHand = aiHand.filter(card => {
                if (card === askedCard) { cardsToTransfer++; return false; }
                return true; 
            });
            
            for(let i=0; i < cardsToTransfer; i++) { playerHand.push(askedCard); }
            
            checkBooks(); // Did player makea book?
            logMessage("> YOU GET TO GO AGAIN.");
            updateScreen();
        } else {
            logMessage("> MAINFRAME: 'GO FISH'.");
            if(deck.length > 0) {
                let drawnCard = deck.pop();
                playerHand.push(drawnCard);
                logMessage(`> YOU DREW A CARD.`);
            }
            
            checkBooks(); // Did drawn card make a book?
            isAiTurn = true;
            updateScreen(); 
            
            // DELAY : 2000= 2 sec
            setTimeout(aiTurn, 3500); 
        }
    });

    // startgame
    dealGame();
});
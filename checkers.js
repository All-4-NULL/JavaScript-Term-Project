document.addEventListener('DOMContentLoaded', () => {

    const turnIndicator = document.querySelector('.turn-indicator');
    const resetBtn = document.getElementById('resetBtn');

    let currentPlayer = 1; 
    let selectedSquare = null; 
    let isAiTurn = false;
    let consecutiveJumpPiece = null; 

    //Set up Board
    function initBoard() {
        const squares = document.querySelectorAll('.square');
        let index = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let square = squares[index];
                square.dataset.row = row;
                square.dataset.col = col;
                
                if (square.classList.contains('dark')) {
                    square.addEventListener('click', handlePlayerClick);
                }
                index++;
            }
        }
    }

    function getSquare(row, col) {
        return document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    }

    // IMPORTANT: MOVE logic
    function getAllMoves(playerNum, specificSquare = null) {
        let moves = [];
        
        let squaresToCheck = specificSquare ? [specificSquare] : 
            Array.from(document.querySelectorAll('.square.dark')).filter(sq => {
                let p = sq.querySelector('.piece');
                return p && p.classList.contains(playerNum === 1 ? 'player1' : 'player2');
            });

        squaresToCheck.forEach(startSq => {
            let startRow = parseInt(startSq.dataset.row);
            let startCol = parseInt(startSq.dataset.col);
            let piece = startSq.querySelector('.piece');
            let isKing = piece.classList.contains('king');

            let directions = [];
            if (playerNum === 1 || isKing) directions.push([-1, -1], [-1, 1]); 
            if (playerNum === 2 || isKing) directions.push([1, -1], [1, 1]);  

            directions.forEach(dir => {
                //  Normal Moves
                if (!specificSquare) { 
                    let nRow = startRow + dir[0];
                    let nCol = startCol + dir[1];
                    let nSq = getSquare(nRow, nCol);
                    if (nSq && !nSq.querySelector('.piece')) {
                        moves.push({ startSq, endSq: nSq, isJump: false });
                    }
                }

                // Jump Moves
                let jRow = startRow + (dir[0] * 2);
                let jCol = startCol + (dir[1] * 2);
                let jSq = getSquare(jRow, jCol);
                let mRow = startRow + dir[0];
                let mCol = startCol + dir[1];
                let mSq = getSquare(mRow, mCol);

                if (jSq && !jSq.querySelector('.piece') && mSq) {
                    let mPiece = mSq.querySelector('.piece');
                    let enemyClass = playerNum === 1 ? 'player2' : 'player1';
                    if (mPiece && mPiece.classList.contains(enemyClass)) {
                        moves.push({ startSq, endSq: jSq, isJump: true, midSq: mSq });
                    }
                }
            });
        });
        return moves;
    }

//  Player Interaction (CASUAL RULES - OPTIONAL JUMPS)
    function handlePlayerClick(e) {
        if (isAiTurn) return; 

        let clickedSq = e.currentTarget;
        let piece = clickedSq.querySelector('.piece');

        // Prevent selecting a different piece if you are in the middle of a doublejump combo
        if (consecutiveJumpPiece && piece && clickedSq !== consecutiveJumpPiece) {
            turnIndicator.innerText = "> MUST COMPLETE COMBO!";
            turnIndicator.style.color = "red";
            return;
        }

        // Select Piece
        if (piece && !consecutiveJumpPiece) {
            if (piece.classList.contains('player1')) {
                if (selectedSquare) selectedSquare.style.boxShadow = '';
                selectedSquare = clickedSq;
                selectedSquare.style.boxShadow = 'inset 0 0 20px #00ffff';
            }
        } 
        // Move Piece
        else if (selectedSquare && !piece) {
            // Get all valid moves (both normal moves and jumps)
            let allValidMoves = getAllMoves(1, consecutiveJumpPiece);
            
            // Allow the player to choose A valid move they want
            let chosenMove = allValidMoves.find(m => m.startSq === selectedSquare && m.endSq === clickedSq);
            
            if (chosenMove) {
                executeMove(chosenMove);
            } else if (consecutiveJumpPiece) {
                 // show an error if they clicked a blank space instead of finishing their doublejump
                 turnIndicator.innerText = "> INVALID: MUST COMPLETE COMBO!";
                 turnIndicator.style.color = "red";
            }
        }
    }

    //  Executing Moves 
    function executeMove(moveData) {
        let piece = moveData.startSq.querySelector('.piece');
        moveData.endSq.appendChild(piece); 

        if (moveData.isJump) {
            moveData.midSq.innerHTML = ''; 
        }

        let endRow = parseInt(moveData.endSq.dataset.row);
        if (currentPlayer === 1 && endRow === 0) piece.classList.add('king');
        if (currentPlayer === 2 && endRow === 7) piece.classList.add('king');

        moveData.startSq.style.boxShadow = '';
        selectedSquare = null;

        if (checkWinCondition()) return;

        // --- DOUBLE JUMP LOGIC ---
        if (moveData.isJump) {
            let nextJumps = getAllMoves(currentPlayer, moveData.endSq).filter(m => m.isJump);
            if (nextJumps.length > 0) {
                consecutiveJumpPiece = moveData.endSq;
            
                selectedSquare = moveData.endSq; 
                
                moveData.endSq.style.boxShadow = 'inset 0 0 20px #ffd700'; 
                
                if (currentPlayer === 2) {
                    setTimeout(triggerAiTurn, 1000); 
                } else {
                    turnIndicator.innerText = "> DOUBLE JUMP!";
                    turnIndicator.style.color = '#ffd700';
                }
                return; 
            }
        }

        consecutiveJumpPiece = null;
        switchTurn();
    }

  // The Mainframe AI
    function triggerAiTurn() {
        let aiMoves = getAllMoves(2, consecutiveJumpPiece);

        if (aiMoves.length === 0) {
            triggerGameOver("AI OUT OF MOVES. YOU WIN!", "#00ffff");
            return;
        }

        let jumps = aiMoves.filter(m => m.isJump);
        let chosenMove = jumps.length > 0 
            ? jumps[Math.floor(Math.random() * jumps.length)] 
            : aiMoves[Math.floor(Math.random() * aiMoves.length)];

        setTimeout(() => {
            executeMove(chosenMove);
        }, 800);
    }

    //  Game State Management
    function switchTurn() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        
        if (currentPlayer === 2) {
            isAiTurn = true;
            turnIndicator.innerText = `> MAINFRAME THINKING...`;
            turnIndicator.style.color = '#ff00ff';
            triggerAiTurn();
        } else {
            isAiTurn = false;
            turnIndicator.innerText = `> P1 TURN`;
            turnIndicator.style.color = '#00ffff';
        }
    }

    function checkWinCondition() {
        let p1Pieces = document.querySelectorAll('.player1').length;
        let p2Pieces = document.querySelectorAll('.player2').length;

        if (p1Pieces === 0) {
            triggerGameOver("MAINFRAME WINS!", "#ff00ff");
            return true;
        }
        if (p2Pieces === 0) {
            triggerGameOver("YOU WIN!", "#00ffff");
            return true;
        }
        return false;
    }

    // --- VICTORY OVERLAY ---
    function triggerGameOver(message, neonColor) {
        isAiTurn = true; // Lock the board
        turnIndicator.innerText = "> SYSTEM HALTED";
        turnIndicator.style.color = "#fff";

        // Game Over screen (overlay)
        const board = document.querySelector('.checkers-board');
        board.innerHTML = `
            <div style="grid-column: 1 / -1; grid-row: 1 / -1; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: rgba(0,0,0,0.85); z-index: 10;">
                <h2 style="color: ${neonColor}; font-size: 2.5rem; text-shadow: 0 0 20px ${neonColor}; margin: 0; text-align: center;">${message}</h2>
                <p style="color: #fff; font-size: 0.8rem; margin-top: 20px; animation: blink 1s infinite;">CLICK 'RESET BOARD' TO PLAY AGAIN</p>
            </div>
        `;
    }

    resetBtn.addEventListener('click', () => location.reload());

    initBoard();
});
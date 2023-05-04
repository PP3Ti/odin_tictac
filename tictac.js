const Gameboard = (() => {
    let gameState = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const wonState = [  [0, 1, 2],
                        [0, 4, 8],
                        [0, 3, 6],
                        [1, 4, 7],
                        [2, 5, 8],
                        [2, 4, 6],
                        [3, 4, 5],
                        [6, 7, 8]
                ]
    Object.seal(gameState)      // fix array length
    return {
        gameState,
        wonState
    }
})()
const Player = (name, marker) => {
    return {
        name,
        marker
    }
}
const Game = (() => {
    const playerOne = Player('FL3RA', 'X', true)
    const playerTwo = Player('Robot', 'O', false)
    let currentPlayer = playerOne
    let lastPlayer = playerOne
    let finished = false
    let winner
    let draw
    let winnerFields
    const checkForWinner = (gamestate) => {
        let wonState = Gameboard.wonState
        let emptySpots = AI.getEmptySpots(gamestate)
        if (!Game.finished) {
            for (i = 0; i < wonState.length; i++) {
                if (typeof gamestate[wonState[i][0]] !== 'number' && 
                    gamestate[wonState[i][0]] === gamestate[wonState[i][1]] &&
                    gamestate[wonState[i][0]] === gamestate[wonState[i][2]]) 
                    {
                    Game.finished = true
                    Game.winner = Game.lastPlayer
                    Game.winnerFields = wonState[i]
                }
            } 
            if (emptySpots.length === 0 && (Game.winner === undefined)) {
                Game.finished = true
                Game.draw = true
                console.log('draw')
            }
        } 
    }
    const playRound = (id, marker) => {
        if (!Game.finished) {
            marker = currentPlayer.marker
            if (typeof Gameboard.gameState[id] === 'number') {
                Gameboard.gameState[id] = marker
                Game.lastPlayer = Game.playerOne
                checkForWinner(Gameboard.gameState)
                if (Game.finished) {
                    return
                } else {
                    AI.makeBestMove()
                    checkForWinner(Gameboard.gameState)
                }
            } else {
                return
            }
        } else {
            return
        }
    }
    return {
        playerOne,
        playerTwo,
        currentPlayer,
        lastPlayer,
        winner,
        finished,
        draw,
        winnerFields,
        playRound,
        checkForWinner,
    }
})()
const AI = (() => {
    let score 
    let calls = 0
    function getEmptySpots(gamestate) {
        return gamestate.filter(e => typeof e === 'number')
    }
    function minimax(board, player) {
        calls++
        let emptySpots = getEmptySpots(board)

        if (winning(board, Game.playerOne.marker)){
            return {score:-10};
        } else if (winning(board, Game.playerTwo.marker)) {
           return {score:10};
        } else if (emptySpots.length === 0){
            return {score:0};
        }
        let moves = []
        for (let i = 0; i < emptySpots.length; i++) {
            let move = {}
            move.index = board[emptySpots[i]]
            board[emptySpots[i]] = player.marker

            if (player === Game.playerTwo) {
                let result = minimax(board, Game.playerOne)
                move.score = result.score
            } else {
                let result = minimax(board, Game.playerTwo)
                move.score = result.score
            }

            board[emptySpots[i]] = move.index
            moves.push(move)
        }
        let bestMove 

        if (player === Game.playerTwo) {
            let bestScore = -100
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
            } 
        }
        } else {
            let bestScore = 100
            for (let i = 0; i < moves.length; i ++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score
                    bestMove = i
                }
            }
        }
        return moves[bestMove]
    }
    function makeBestMove() {
        let move = minimax(Gameboard.gameState, Game.playerTwo)
        Gameboard.gameState[move.index] = Game.playerTwo.marker
        Game.lastPlayer = Game.playerTwo
    }
    function makeMove() {
        Game.currentPlayer = Game.playerTwo
        let randomField = Math.floor(Math.random() * getEmptySpots(Gameboard.gameState).length)
        let fieldId = getEmptySpots(Gameboard.gameState)[randomField]
        Gameboard.gameState[fieldId] = Game.playerTwo.marker
    }
    function winning(board, player){
        if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
            ) {
            return true;
        } else {
            return false;
        }
       }
    return {
        getEmptySpots,
        minimax,
        makeMove,
        makeBestMove,
        winning,
    }
})()
const displayController = (() => {
    const restartButton = document.getElementById('restartButton')
    const fields = document.querySelectorAll('.field')
    const draw = document.getElementById('draw')
    restartButton.addEventListener('click', function() {
        window.location.reload()
    })
    function updateScreen() {
        for (i = 0; i < Gameboard.gameState.length; i++) {
            if (typeof Gameboard.gameState[i] !== 'number') {
                fields[i].textContent = Gameboard.gameState[i]
            }
        }
        if (Game.draw) {
            draw.classList.remove('invisible')
            draw.classList.add('visible')
        }
        if (Game.finished && (!Game.draw)) {
            for (j = 0; j < Game.winnerFields.length; j++) {
                for (k = 0; k < fields.length; k++) {
                    if (Game.winnerFields[j] == fields[k].id) {
                        fields[k].classList.add('winnerField')
                    }
                }
            }
        }
    }
    fields.forEach(field => {
        field.addEventListener('click', function() {
            let id = this.id
            Game.playRound(id)
            updateScreen()
        })
    });
})()
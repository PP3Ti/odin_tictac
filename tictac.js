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
const Player = (name, marker, maximizingplayer) => {
    return {
        name,
        marker, 
        maximizingplayer
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
    const checkForWinner = (gamestate) => {
        gamestate = Gameboard.gameState
        let wonState = Gameboard.wonState
        let emptySpots = AI.getEmptySpots()
        if (!Game.finished) {
            for (i = 0; i < wonState.length; i++) {
                if (typeof gamestate[wonState[i][0]] !== 'number' && 
                    gamestate[wonState[i][0]] === gamestate[wonState[i][1]] &&
                    gamestate[wonState[i][0]] === gamestate[wonState[i][2]]) 
                {
                    Game.finished = true
                    Game.winner = Game.lastPlayer
                    console.log(Game.winner.name + ' won')
                } else if (emptySpots.length === 0) {
                    Game.finished = true
                    Game.draw = true
                    console.log('draw')
                }
            } 
        } 
    }
    const playRound = (id, marker) => {
        if (!Game.finished) {
            marker = currentPlayer.marker
            if (typeof Gameboard.gameState[id] === 'number') {
                Gameboard.gameState[id] = marker
                Game.lastPlayer = Game.playerOne
                checkForWinner()
                if (Game.finished) {
                    return
                } else {
                    AI.makeMove()
                    Game.lastPlayer = Game.playerTwo
                    console.log(lastPlayer)
                    checkForWinner()
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
        playRound,
        checkForWinner,
    }
})()
const AI = (() => {
    let score
    function getEmptySpots() {
        let emptySpots = Gameboard.gameState.filter(e => typeof e === 'number')
        return emptySpots
    }
    function evalBoard (gamestate) {
        if (Game.finished && Game.draw) {
            AI.score = 0
        } else if (Game.finished && (Game.winner.maximizingplayer)) {
            AI.score = 10
        } else if (Game.finished && (!Game.winner.maximizingplayer)) {
            AI.score = -10
        }
        if(Game.finished) {
            console.log(AI.score)
        }
    }
    function minimax (gamestate, depth, maximizingPlayer) {
    }
    function bestMove() {
    }
    function makeMove() {
        Game.currentPlayer = Game.playerTwo
        let fieldId = getEmptySpots()[0]
        console.log(fieldId)
        Gameboard.gameState[fieldId] = Game.playerTwo.marker
        console.log(Gameboard.gameState)
    }
    return {
        getEmptySpots,
        minimax,
        bestMove,
        makeMove,
        evalBoard
    }
})()
const displayController = (() => {
    const fields = document.querySelectorAll('.field')
    function updateScreen() {
        for (i = 0; i < Gameboard.gameState.length; i++) {
            if (typeof Gameboard.gameState[i] !== 'number') {
                fields[i].textContent = Gameboard.gameState[i]
            }
        }
    }
    fields.forEach(field => {
        field.addEventListener('click', function() {
            let id = this.id
            Game.playRound(id)
            Game.checkForWinner()
            updateScreen()
        })
    });
})()
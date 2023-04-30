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
        marker, 
    }
}
const Game = (() => {
    const playerOne = Player('FL3RA', 'X')
    const playerTwo = Player('Robot', 'O')
    let currentPlayer = playerOne
    let lastPlayer = playerOne
    let finished = false
    const checkForWinner = (gamestate) => {
        gamestate = Gameboard.gameState
        wonState = Gameboard.wonState
        for (i = 0; i < wonState.length; i++) {
            if (gamestate[wonState[i][0]] !== '' && 
                gamestate[wonState[i][0]] === gamestate[wonState[i][1]] &&
                gamestate[wonState[i][0]] === gamestate[wonState[i][2]]) {
                console.log(lastPlayer.name + ' won')
                finished = true
            }
        }
    }
    const playRound = (id, marker) => {
        marker = currentPlayer.marker
        if (typeof Gameboard.gameState[id] === 'number') {
            Gameboard.gameState[id] = marker
        } else {
            return
        }
        if (currentPlayer === playerOne) {
            lastPlayer = playerOne
            currentPlayer = playerTwo
            console.log(currentPlayer.name)
        } else {
            lastPlayer = playerTwo
            currentPlayer = playerOne
            console.log(Gameboard.gameState)
        }
    }
    return {
        playerOne,
        playerTwo,
        currentPlayer,
        lastPlayer,
        playRound,
        checkForWinner,
    }
})()
const displayController = (() => {
    const fields = document.querySelectorAll('.field')
    fields.forEach(field => {
        field.addEventListener('click', function() {
            let id = this.id
            Game.playRound(id)
            if (typeof Gameboard.gameState[id] !== 'number'){
                field.textContent = Gameboard.gameState[id]
            }
            Game.checkForWinner()
        })
    });
})()
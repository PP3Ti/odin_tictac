const Gameboard = (() => {
    let gameState = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
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
    let lastPlayer
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
    const getScore = (gamestate) => {
        gamestate = Gameboard.gameState
        let score = 0
        let idList = []
        function emptyIndexes(gamestate) {
            gamestate = Gameboard.gameState
            return gamestate.filter(element => element != 'X' && element !== 'O')
        }
        if (finished) {
            score += 100
            console.log('finished')
        } else {
            idList = emptyIndexes();
        }
        console.log(idList)
        return score
    }
    const playRound = (id, marker) => {
        marker = currentPlayer.marker
        if (Gameboard.gameState[id] === '') {
            Gameboard.gameState[id] = marker
        } else {
            return
        }
        if (currentPlayer === playerOne) {
            lastPlayer = playerOne
            currentPlayer = playerTwo
        } else {
            lastPlayer = playerTwo
            currentPlayer = playerOne
            minimax()
            getScore()
        }
    }
    const minimax = () => {
        console.log('computer moved')
    }
    return {
        playerOne,
        playerTwo,
        currentPlayer,
        playRound,
        checkForWinner,
        minimax,
        getScore
    }
})()
const displayController = (() => {
    const fields = document.querySelectorAll('.field')
    fields.forEach(field => {
        field.addEventListener('click', function() {
            let id = this.id
            Game.playRound(id)
            field.textContent = Gameboard.gameState[field.id]
            Game.checkForWinner()
        })
    });
})()
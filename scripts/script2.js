// LOGGER FUNCTION

function log(x) {
  console.log(x);
}

// GAMEBOARD FUNCTION

const gameBoard = (function gameBoard() {
  const rows = 3;
  const columns = 3;

  let board = [];
  let playersArray = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = " ";
    }
  }

  const getPlayers = () => playersArray;
  const getBoard = () => board;

  const assignValue = (player, row, column) => {
    // VALIDATION REQUIRED HERE

    if (board[row][column] == " ") {
      board[row][column] = player.symbol;
      log(getBoard());
      game.switchPlayer();
    } else {
      log("That spot has already been marked! Try selecting a different cell.");
      game.playRound();
    }
  };

  const setPlayers = (name, symbol) => {
    player = {
      name,
      symbol,
    };
    playersArray.push(player);
  };

  return { getBoard, getPlayers, assignValue, setPlayers };
})();

function gameStateController() {
  const playerone = gameBoard.setPlayers("Hi", "x");
  const playerTwo = gameBoard.setPlayers("Ji", "o");
  const playerArray = gameBoard.getPlayers();
  const displayController = tempDisplayController();
  let round = 1;

  let activePlayer = playerArray[0];

  const switchPlayer = () => {
    activePlayer =
      activePlayer === playerArray[0] ? playerArray[1] : playerArray[0];
    // log(`${activePlayer.name} is the active player`);
    // log(`${activePlayer.name}'s turn: `);
  };

  const playRound = () => {
    log(`Round: ${round}`);
    log(`${activePlayer.name}'s turn: `);
    displayController.tempPromptInput(activePlayer);
    round++;

    let board = gameBoard.getBoard();

    // WIN CON CHECK HERE
  };

  return { playRound, switchPlayer };
}

const tempDisplayController = () => {
  const tempPromptInput = (activePlayer) => {
    let row = prompt("Row?");
    let column = prompt("column?");
    gameBoard.assignValue(activePlayer, row, column);
  };

  return { tempPromptInput };
};

let game = gameStateController();

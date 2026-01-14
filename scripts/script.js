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
      points: 0,
    };
    playersArray.push(player);
  };

  const getPlayerPoints = (player) => {
    return player.points;
  };

  const incPlayerPoints = (player) => {
    player.points = player.points++;
  };

  return {
    getBoard,
    getPlayers,
    assignValue,
    setPlayers,
    getPlayerPoints,
    incPlayerPoints,
  };
})();

function gameStateController() {
  const playerone = gameBoard.setPlayers("Hi", "x");
  const playerTwo = gameBoard.setPlayers("Ji", "o");
  const playerArray = gameBoard.getPlayers();
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
    tempDisplayController.tempPromptInput(activePlayer);
    round++;

    let board = gameBoard.getBoard();

    // WIN CON CHECK HERE
    if (round >= 5) {
      let firstLateralRow = board[0];
      let secondLateralRow = board[1];
      let thirdLateralRow = board[2];

      let firstDiagonalRow = [board[0][0], board[1][1], board[2][2]];
      let secondDiagonalRow = [board[0][2], board[1][1], board[2][0]];

      let firstColumn = [board[0][0], board[1][0], board[2][0]];
      let secondColumn = [board[0][1], board[1][1], board[2][1]];
      let thirdColumn = [board[0][2], board[1][2], board[2][2]];

      let winConCheckArray = [
        firstLateralRow,
        secondLateralRow,
        thirdLateralRow,
        firstDiagonalRow,
        secondDiagonalRow,
        firstColumn,
        secondColumn,
        thirdColumn,
      ];

      let result = tempDisplayController.winConController(winConCheckArray);

      if (result) {
        log(`${activePlayer.name} wins!`);
        gameBoard.incPlayerPoints(activePlayer);
        gameBoard.getPlayerPoints(activePlayer);
      }
    }
  };

  return { playRound, switchPlayer };
}

const tempDisplayController = (() => {
  const tempPromptInput = (activePlayer) => {
    let row = prompt("Row?");
    let column = prompt("column?");
    gameBoard.assignValue(activePlayer, row, column);
  };

  const winConController = (array) => {
    let winCon = false;
    for (row of array) {
      if (row[0] == "x" || row[0] == "o") {
        let checkValue = row[0];
        if (row.filter((cellValue) => cellValue == checkValue).length == 3) {
          return (winCon = true);
        }
      } else {
        continue;
      }
    }
    return winCon;
  };

  return { tempPromptInput, winConController };
})();

let game = gameStateController();

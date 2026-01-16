// LOGGER FUNCTION

function log(x) {
  console.log(x);
}

// GAMEBOARD FUNCTION

const gameBoard = (function gameBoard() {
  const rows = 3;
  const columns = 3;

  // INITIALISE EMPTY ARRAYS FOR STORING BOARD DATA AND PLAYERS

  let board = [];
  let playersArray = [];

  // CONSTRUCT AN EMPTY BOARD

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = " ";
    }
  }

  // GET FUNCTIONS

  const getPlayers = () => playersArray;

  const getBoard = () => board;

  const assignValue = (player, row, column) => {
    if (board[row][column] == " ") {
      board[row][column] = player.symbol;
      log(getBoard());
      game.incRound();
      game.switchPlayer();
    } else {
      log("That spot has already been marked! Try selecting a different cell.");
      game.playRound();
    }
  };

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = " ";
      }
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
    player.points = player.points + 1;
  };

  return {
    getBoard,
    getPlayers,
    assignValue,
    setPlayers,
    getPlayerPoints,
    incPlayerPoints,
    resetBoard,
  };
})();

function gameStateController() {
  gameBoard.setPlayers("Hi", "x");
  gameBoard.setPlayers("Ji", "o");
  const playerArray = gameBoard.getPlayers();

  let activePlayer = playerArray[0];
  let round = 1;

  const scoreBoard = () => {
    for (player of playerArray) {
      log(`${player.name}'s points : ${gameBoard.getPlayerPoints(player)}`);
    }
  };

  const getRound = () => round;

  const resetRound = () => {
    round = 1;
  };
  const incRound = () => round++;

  const switchPlayer = () => {
    activePlayer =
      activePlayer === playerArray[0] ? playerArray[1] : playerArray[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = () => {
    log(`Round: ${round}`);
    log(`${activePlayer.name}'s turn: `);
    tempDisplayController.tempPromptInput(activePlayer);
    // WIN CON CHECK HERE
    if (round >= 5) {
      winConChecker.checkRoundWin(activePlayer);
    }
  };

  return {
    playRound,
    switchPlayer,
    getActivePlayer,
    incRound,
    scoreBoard,
    resetRound,
    getRound,
  };
}

const winConChecker = (() => {
  const checkRoundWin = (activePlayer) => {
    let round = game.getRound();

    if (round == 10) {
      log("It's a tie! Nobody wins!");
      game.scoreBoard();
      return;
    }

    let board = gameBoard.getBoard();

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

    let result = winConController(winConCheckArray);

    if (result) {
      game.switchPlayer();
      activePlayer = game.getActivePlayer();

      log(`${activePlayer.name} wins!`);
      gameBoard.incPlayerPoints(activePlayer);
      log(
        `${activePlayer.name}'s points: ${gameBoard.getPlayerPoints(
          activePlayer
        )}`
      );
      game.scoreBoard();
      gameBoard.resetBoard();
      game.resetRound();
    }
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

  return { winConController, checkRoundWin };
})();

const tempDisplayController = (() => {
  const tempPromptInput = (activePlayer) => {
    let row = prompt("Row?");
    let column = prompt("column?");

    if (row == null || column == null || row == "" || column == "") {
      log("Please type in a valid number!");
    } else {
      let rowNum = Number(row);
      let columnNum = Number(column);
      if (isNaN(rowNum) || isNaN(columnNum)) {
        log("Please type in a valid number!");
        game.playRound();
      } else if (0 <= rowNum <= 3 && 0 <= columnNum <= 3) {
        gameBoard.assignValue(activePlayer, rowNum, columnNum);
      } else {
        log("Please type in a valid number!");
        game.playRound();
      }
    }
  };

  return { tempPromptInput };
})();

let game = gameStateController();

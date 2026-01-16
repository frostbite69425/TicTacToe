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

  // CONSTRUCT AN EMPTY BOARD

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = " ";
    }
  }

  // GET FUNCTIONS

  const getBoard = () => board;

  const assignValue = (player, row, column) => {
    if (board[row][column] == " ") {
      board[row][column] = player.symbol;
      log(getBoard());
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

  return {
    getBoard,
    assignValue,
    resetBoard,
  };
})();

function gameStateController() {
  let playersArray = [];

  const getPlayerPoints = (player) => {
    return player.points;
  };

  const setPlayers = (name, symbol) => {
    player = {
      name,
      symbol,
      points: 0,
    };
    playersArray.push(player);
  };

  const incPlayerPoints = (player) => {
    player.points = player.points + 1;
  };

  // INITIALISE PLAYERS
  setPlayers("Hi", "x");
  setPlayers("Ji", "o");

  //   SETS THE ACTIVE PLAYER
  let activePlayer = playersArray[0];

  let round = 1;

  const scoreBoard = () => {
    for (player of playersArray) {
      log(`${player.name}'s points : ${getPlayerPoints(player)}`);
    }
  };

  //   FUNCTION FOR GETTING, RESETING AND INCREASING THE ROUND

  const getRound = () => round;

  const resetRound = () => {
    round = 1;
  };
  const incRound = () => round++;

  //   FUNCTION FOR SWITCHING PLAYERS

  const switchPlayer = () => {
    activePlayer =
      activePlayer === playersArray[0] ? playersArray[1] : playersArray[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = () => {
    log(`Round: ${round}`);
    log(`${activePlayer.name}'s turn: `);
    tempDisplayController.tempPromptInput(activePlayer);
    incRound();
    switchPlayer();

    if (round >= 5) {
      let result = winConChecker.checkRoundWin();
      if (result == 0) {
        log("It's a tie! Nobody wins!");
        scoreBoard();
        gameBoard.resetBoard();
        resetRound();
      } else if (result == 1) {
        switchPlayer();
        activePlayer = getActivePlayer();

        log(`${activePlayer.name} wins!`);
        incPlayerPoints(activePlayer);
        scoreBoard();
        gameBoard.resetBoard();
        resetRound();
      }
    }
  };

  return {
    playRound,
    getActivePlayer,
    scoreBoard,
    getRound,
  };
}

const winConChecker = (() => {
  const checkRoundWin = () => {
    let round = game.getRound();

    if (round == 10) {
      return 0;
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
      return 1;
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
        log("Please type in a numeber in the range of 0 - 2!");
        game.playRound();
      }
    }
  };

  return { tempPromptInput };
})();

const DOMdisplayController = (() => {
  const cellNodeList = document.querySelectorAll(".container div");
  log(cellNodeList);
  const renderCellContents = (row, column, player) => {
    for (cell of cellNodeList) {
      if (cell.dataset.row == row && cell.dataset.column == column) {
        selectedCell = cell;

        selectedCell.textContent = player.symbol;
      }
    }
  };

  return { renderCellContents };
})();

let game = gameStateController();

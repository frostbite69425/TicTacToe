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
      return true;
    } else {
      return false;
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

const gameStateController = (() => {
  let playersArray = [];

  const getPlayerPoints = (player) => {
    return player.points;
  };

  let activePlayer;

  const setPlayers = (name, symbol) => {
    player = {
      name,
      symbol,
      points: 0,
    };
    playersArray.push(player);
    activePlayer = playersArray[0];
  };

  const incPlayerPoints = (player) => {
    player.points = player.points + 1;
  };

  // INITIALISE PLAYERS
  // DEBUG: COMMENTING THESE OUT AND MAKING SET PLAYERS PUBLIC
  // setPlayers("Hi", "x");
  // setPlayers("Ji", "o");

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

  // PASSING THE ROWNUM AND COLNUM ARGUMENTS INTO PLAYROUND

  const playRound = (rowNum, colNum) => {
    DOMdisplayController.renderNotification(
      `Round: ${round} ${activePlayer.name}'s turn: `,
    );

    // DEBUG: THIS WILL STILL NEED A VALIDATION CHECK IN ORDER TO PREVENT THE CODE FROM BREAKING
    let returnVal = gameBoard.assignValue(activePlayer, rowNum, colNum);
    if (returnVal) {
      DOMdisplayController.renderCellContents(rowNum, colNum, activePlayer);
      incRound();
      switchPlayer();
    } else {
      DOMdisplayController.renderNotification(
        "That spot has already been marked! Try selecting a different cell.",
      );
    }

    if (round >= 5) {
      let result = winConChecker.checkRoundWin();
      if (result == 0) {
        DOMdisplayController.renderNotification("It's a tie! Nobody wins!");
        scoreBoard();
        gameBoard.resetBoard();
        DOMdisplayController.resetBoardDisplay();
        resetRound();
      } else if (result == 1) {
        switchPlayer();
        activePlayer = getActivePlayer();

        DOMdisplayController.renderNotification(`${activePlayer.name} wins!`);
        log(gameBoard.getBoard());
        incPlayerPoints(activePlayer);
        scoreBoard();
        gameBoard.resetBoard();
        DOMdisplayController.resetBoardDisplay();
        resetRound();
      }
    }
  };

  return {
    playRound,
    getActivePlayer,
    scoreBoard,
    getRound,
    setPlayers,
  };
})();

// DEBUG MAKING GAMESTATECONTROLLER AN IIFE TO AVOID MAKING DIFFERENT INSTANCES OF THE SAME VARIABLES.

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

const DOMdisplayController = (() => {
  const cellNodeList = document.querySelectorAll(".container div");
  const notificationDiv = document.querySelector(".notification");
  const activePlayer = gameStateController.getActivePlayer();

  // DEBUG: I HAVE YET TO FIGURE OUT THE FLOW

  // FLOW THINGY MOVED OUTSIDE OF THE DISPLAY CONTROLLER

  const renderCellContents = (row, column, player) => {
    for (let cell of cellNodeList) {
      if (cell.dataset.row == row && cell.dataset.column == column) {
        if (cell.textContent == "") {
          cell.textContent = player.symbol;
        } else {
          renderNotification("Space already occupied");
        }
      }
    }
  };

  const renderNotification = (message) => {
    notificationDiv.textContent = message;
  };

  const resetBoardDisplay = () => {
    for (let cell of cellNodeList) {
      cell.textContent = "";
    }
  };

  return {
    renderCellContents,
    renderNotification,
    resetBoardDisplay,
  };
})();

const gameStart = () => {
  const startGameBtn = document.querySelector(
    "body > div.game-interface > div.game-controls > button:nth-child(1)",
  );
  const modal = document.querySelector(".modal");
  const modalForm = document.querySelector(".modal-form");
  const modalCancelBtn = document.querySelector(".cancel");
  const modalConfirmBtn = document.querySelector(".confirm");
  const userNameOne = document.querySelector("#user-name-one");
  const symbolOne = document.querySelector("#symbol-one");
  const userNameTwo = document.querySelector("#user-name-two");
  const symbolTwo = document.querySelector("#symbol-two");
  const gameBoardDiv = document.querySelector(".game-board");

  const showModal = (() => {
    startGameBtn.addEventListener("click", () => {
      modal.showModal();
    });
  })();

  modal.addEventListener("close", (e) => {
    modal.close();
  });

  const gameLoop = () => {
    const cellNodeList = document.querySelectorAll(".container div");
    let board = gameBoard.getBoard();

    for (cell of cellNodeList) {
      cell.addEventListener("click", () => {
        let activePlayer = gameStateController.getActivePlayer();
        row = cell.dataset.row;
        col = cell.dataset.column;
        if (board[row][col] == " ") {
          gameBoard.assignValue(activePlayer, row, col);
          DOMdisplayController.renderCellContents(row, col, activePlayer);
        } else {
          DOMdisplayController.renderNotification("Space already occupied!");
        }
      });
    }
  };

  modalConfirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      !userNameOne.checkValidity() ||
      !userNameTwo.checkValidity() ||
      !symbolOne.checkValidity() ||
      !symbolTwo.checkValidity()
    ) {
      modalForm.reportValidity();
      return;
    }

    gameStateController.setPlayers(
      userNameOne.value.toString(),
      symbolOne.value.toString(),
    );
    gameStateController.setPlayers(
      userNameTwo.value.toString(),
      symbolTwo.value.toString(),
    );

    log(gameStateController.getActivePlayer());
    log(gameStateController.scoreBoard());

    modal.close();
    modalForm.reset();
    gameBoardDiv.classList.toggle("none");

    gameLoop();
  });

  modalCancelBtn.addEventListener("click", () => {
    modal.close();
    modalForm.reset();
  });

  // DOMdisplayController.userInput();
};

gameStart();

// let game = gameStateController;

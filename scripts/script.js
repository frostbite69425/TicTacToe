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

  let round = 1;

  const scoreBoard = () => {
    let playerOne, playerTwo;
    [playerOne, playerTwo] = playersArray;
    DOMdisplayController.renderScore(playerOne, playerTwo);
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

  const setActivePlayer = () => {
    activePlayer = playersArray[0];
  };

  // PASSING THE ROWNUM AND COLNUM ARGUMENTS INTO PLAYROUND

  const playRound = (rowNum, colNum) => {
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
        switchPlayer();
        scoreBoard();
        // gameBoard.resetBoard();
        // DOMdisplayController.resetBoardDisplay();
        // resetRound();
        // DEBUG: THIS DISPLAY WIPING THINGY NEEDS TO HAPPEN ON USER INPUT. IF THE USER WANTS TO PLAY AGAIN
        return "round end";
      } else if (result == 1) {
        switchPlayer();
        activePlayer = getActivePlayer();

        DOMdisplayController.renderNotification(`${activePlayer.name} wins!`);
        log(gameBoard.getBoard());
        incPlayerPoints(activePlayer);
        scoreBoard();
        // gameBoard.resetBoard();
        // DOMdisplayController.resetBoardDisplay();
        // resetRound();
        return "round end";
      }
    }
  };

  return {
    playRound,
    getActivePlayer,
    scoreBoard,
    getRound,
    setPlayers,
    resetRound,
    setActivePlayer,
  };
})();

// DEBUG MAKING GAMESTATECONTROLLER AN IIFE TO AVOID MAKING DIFFERENT INSTANCES OF THE SAME VARIABLES.

const winConChecker = (() => {
  const checkRoundWin = () => {
    let round = gameStateController.getRound();

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
  const cellNodeList = document.querySelectorAll(".container button");
  const notificationDiv = document.querySelector(".notification");
  const roundDiv = document.querySelector(".round-display");
  const scoreBoardDiv = document.querySelector(".scoreboard");
  const playerOneScoreDiv = document.querySelector(".player-one-score");
  const playerTwoScoreDiv = document.querySelector(".player-two-score");

  const renderScore = (playerOne, playerTwo) => {
    playerOneScoreDiv.textContent = `${playerOne.name}'s score: ${playerOne.points}`;
    playerTwoScoreDiv.textContent = `${playerTwo.name}'s score: ${playerTwo.points}`;
  };

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

  const renderRound = (message) => {
    roundDiv.textContent = message;
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
    renderRound,
    renderScore,
  };
})();

const gameStart = () => {
  const startGameBtn = document.querySelector(
    "body > div.game-interface > div.game-controls > button:nth-child(1)",
  );
  const playAgainBtn = document.querySelector(
    ".game-controls > button:nth-child(2)",
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
  const cellNodeList = document.querySelectorAll(".container button");
  let board = gameBoard.getBoard();

  playAgainBtn.addEventListener("click", () => {
    gameBoard.resetBoard();
    DOMdisplayController.resetBoardDisplay();
    DOMdisplayController.renderNotification("");
    gameStateController.resetRound();
    cellNodeList.forEach((cell) => {
      cell.disabled = false;
    });
    gameStateController.setActivePlayer();
    board = gameBoard.getBoard();
    let round = gameStateController.getRound();
    let activePlayer = gameStateController.getActivePlayer();
    DOMdisplayController.renderRound(
      `Round: ${round} ${activePlayer.name}'s turn: `,
    );
  });

  // DEBUG: THE ROUND AFTER WIPING THE BOARD RETAINS THE ROUND NUMBER OF THE LAST ROUND AND THE LAST ROUND'S WINNER GOES FIRST FOR SOME REASON

  // DEBUG: WILL HAVE TO CHANGE THE DIVS INTO BUTTONS

  cellNodeList.forEach((cell) => {
    cell.addEventListener("click", () => {
      row = cell.dataset.row;
      col = cell.dataset.column;
      if (board[row][col] == " ") {
        playAgainBtn.disabled = true;
        let returnVal = gameStateController.playRound(row, col);
        if (returnVal !== "round end") {
          gameLoop();
        } else {
          playAgainBtn.disabled = false;
          cellNodeList.forEach((cell) => {
            cell.disabled = true;
          });
        }
        // THIS LOOP WORKS AS INTENDED BUT NEEDS A BREAK AFTER EACH ROUND
      } else {
        DOMdisplayController.renderNotification("Space already occupied!");
      }
    });
  });

  const showModal = (() => {
    startGameBtn.addEventListener("click", () => {
      modal.showModal();
    });
  })();

  modal.addEventListener("close", (e) => {
    modal.close();
  });

  const gameLoop = () => {
    board = gameBoard.getBoard();
    let round = gameStateController.getRound();
    let activePlayer = gameStateController.getActivePlayer();
    DOMdisplayController.renderRound(
      `Round: ${round} ${activePlayer.name}'s turn: `,
    );
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

    modal.close();
    modalForm.reset();
    gameBoardDiv.classList.toggle("none");
    startGameBtn.classList.toggle("none");
    playAgainBtn.classList.toggle("none");

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

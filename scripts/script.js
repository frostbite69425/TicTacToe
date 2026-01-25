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

  const getPlayers = () => playersArray;

  const incPlayerPoints = (player) => {
    player.points = player.points + 1;
  };

  let round = 1;

  const scoreBoard = () => {
    let playerOne, playerTwo;
    [playerOne, playerTwo] = playersArray;
    DOMdisplayController.renderScore(playerOne, playerTwo);
    DOMdisplayController.switchScoreBoardDisplay();
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

  const playRound = (rowNum, colNum) => {
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
        return "round end";
      } else if (result == 1) {
        switchPlayer();
        activePlayer = getActivePlayer();

        DOMdisplayController.renderNotification(`${activePlayer.name} wins!`);
        incPlayerPoints(activePlayer);
        scoreBoard();
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
    getPlayers,
  };
})();

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
  const playerOneScoreDiv = document.querySelector(".player-one-score");
  const playerTwoScoreDiv = document.querySelector(".player-two-score");
  const scoreBoard = document.querySelector(".scoreboard");

  const switchScoreBoardDisplay = () => {
    scoreBoard.classList.toggle("none");
  };

  const renderScore = (playerOne, playerTwo) => {
    playerOneScoreDiv.textContent = `${playerOne.name}'s score: ${playerOne.points}`;
    playerTwoScoreDiv.textContent = `${playerTwo.name}'s score: ${playerTwo.points}`;
  };

  const renderCellContents = (row, column, player) => {
    for (let cell of cellNodeList) {
      if (cell.dataset.row == row && cell.dataset.column == column) {
        if (cell.textContent == "") {
          if (notificationDiv.textContent !== "") {
            renderNotification("");
          }
          cell.textContent = player.symbol;

          if (player.symbol == "x") {
            cell.classList.toggle("one");
          } else {
            cell.classList.toggle("two");
          }
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
      if (cell.classList.contains("one") || cell.classList.contains("two")) {
        cell.classList.remove("one");
        cell.classList.remove("two");
      }
    }
  };

  return {
    renderCellContents,
    renderNotification,
    resetBoardDisplay,
    renderRound,
    renderScore,
    switchScoreBoardDisplay,
  };
})();

const gameStart = () => {
  const startGameBtn = document.querySelector(
    ".game-controls > button:nth-child(1)",
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
  const themeSwitchBtn = document.querySelector("button.theme");
  const gitBtn = document.querySelector(".git-button");
  const roundDiv = document.querySelector(".round-display");
  const restartBtn = document.querySelector(".restart-button");
  let board = gameBoard.getBoard();

  themeSwitchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("light");
    themeSwitchBtn.classList.toggle("light");

    if (themeSwitchBtn.classList.contains("light")) {
      themeSwitchBtn.innerHTML = `<svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path
              d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"
            />`;
    } else {
      themeSwitchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>`;
    }
  });

  gitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "https://github.com/frostbite69425";
  });

  playAgainBtn.addEventListener("click", () => {
    gameBoard.resetBoard();
    DOMdisplayController.resetBoardDisplay();
    DOMdisplayController.switchScoreBoardDisplay();
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

  restartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.reload();
  });

  cellNodeList.forEach((cell) => {
    cell.addEventListener("click", () => {
      row = cell.dataset.row;
      col = cell.dataset.column;
      if (board[row][col] == " ") {
        playAgainBtn.disabled = true;
        restartBtn.disabled = true;

        let returnVal = gameStateController.playRound(row, col);
        if (returnVal !== "round end") {
          gameLoop();
        } else {
          playAgainBtn.disabled = false;
          restartBtn.disabled = false;
          cellNodeList.forEach((cell) => {
            cell.disabled = true;
          });
        }
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
    // AI IMPLEMENTATION?

    const getRandomInt = () => {
      return Math.floor(Math.random() * 3);
    };

    if (activePlayer == gameStateController.getPlayers()[1]) {
      let randomRow = getRandomInt().toString();
      let randomCol = getRandomInt().toString();

      while (board[randomRow][randomCol] !== " " && round <= 8) {
        randomRow = getRandomInt().toString();
        randomCol = getRandomInt().toString();
      }

      if (board[randomRow][randomCol] == " ") {
        playAgainBtn.disabled = true;
        restartBtn.disabled = true;
        let returnVal = gameStateController.playRound(randomRow, randomCol);
        if (returnVal !== "round end") {
          gameLoop();
        } else {
          playAgainBtn.disabled = false;
          restartBtn.disabled = false;
          cellNodeList.forEach((cell) => {
            cell.disabled = true;
          });
        }
      } else {
        DOMdisplayController.renderNotification("Space already occupied!");
      }
    }
  };

  modalConfirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!userNameOne.checkValidity() || !userNameTwo.checkValidity()) {
      modalForm.reportValidity();
      return;
    } else if (symbolOne.value.toString() == symbolTwo.value.toString()) {
      symbolTwo.setCustomValidity("The two symbols can't be the same!");
      symbolTwo.reportValidity();
      return;
    } else {
      symbolTwo.setCustomValidity("");
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
    roundDiv.classList.toggle("none");
    startGameBtn.classList.toggle("none");
    playAgainBtn.classList.toggle("none");
    restartBtn.classList.toggle("none");

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

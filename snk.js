const BOARD_SIZE = 11;
const INIT_SNK_SIZE = 3;
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";
const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];
const GAME_OVER = "game over";
const SPEED = 1000;

function randomPosition() {
  const randomRow = Math.floor(Math.random() * BOARD_SIZE);
  const randomCol = Math.floor(Math.random() * BOARD_SIZE);
  return [randomRow, randomCol];
}

function makeBoard(snk) {
  let board = new Array(BOARD_SIZE);
  for (let row = 0; row < board.length; row++) {
    board[row] = new Array(BOARD_SIZE);
    for (let col = 0; col < board[row].length; col++) {
      let found = snk.some((part) => {
        return row === part[0] && col === part[1];
      });
      let char = found ? "1" : "0";
      board[row][col] = char;
    }
  }

  board[apple[0]][apple[1]] = "*";
  console.log(apple);

  board.forEach((row) => {
    console.log(board.indexOf(row).toString().padEnd(5), row.join(" "));
  });

  console.log("\n\n");

  return board;
}

function step(snk, direction = LEFT) {
  //   if (direction === lastDir) {
  //     return [snk, board];
  //   }
  lastDir = direction;
  let head = snk[0];

  let newSnk = snk.map((part, index, original) => {
    if (index === 0) {
      switch (direction) {
        case LEFT:
          return [head[0], head[1] - 1];

        case RIGHT:
          return [head[0], head[1] + 1];

        case UP:
          return [head[0] - 1, head[1]];

        case DOWN:
          return [head[0] + 1, head[1]];
      }
    } else {
      return original[index - 1];
    }
  });
  newSnk = validate(newSnk);
  return [newSnk, makeBoard(newSnk)];
}

function validate(snk) {
  snk.forEach((part) => {
    //console.log(part);
    if (part.some((idx) => idx >= BOARD_SIZE || idx < 0)) {
      throw new Error(GAME_OVER);
    }
  });
  const head = snk[0];
  if (head[0] === apple[0] && head[1] === apple[1]) {
    snk = eat();
  }
  return snk;
}

function createHtmlTable(board) {
  const tbl = document.createElement("table");
  const tbody = document.createElement("tbody");
  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("td");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.dataset.fill = board[i][j];
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  tbl.appendChild(tbody);
  return tbl;
}

function initGui(board) {
  const container = document.querySelector("#container");
  container.replaceChildren();
  container.appendChild(createHtmlTable(board));
}

function move(dir) {
  try {
    [snk, board] = step(snk, dir);
    initGui(board);
    document.querySelectorAll(`.move-button`).forEach((btn) => {
      btn.disabled = btn.classList.contains(dir) ? true : false;
    });
    // document.querySelector(`#${dir}`).disabled = true;
  } catch (error) {
    if (error.message === GAME_OVER) {
      gameOver();
    } else {
      throw error;
    }
  }
}

function gameOver() {
  document.querySelector("#message").innerHTML = "Game Over!";
  document
    .querySelectorAll('[data-fill="1"]')
    .forEach((elem) => (elem.dataset.fill = "x"));
  document
    .querySelectorAll("move-button")
    .forEach((btn) => (btn.disabled = true));
  clearInterval(mainInterval);
}

function eat() {
  apple = randomPosition();
  console.log("Apple!");
  let head = snk[0];
  let newPart;

  switch (lastDir) {
    case LEFT:
      newPart = [head[0], head[1] - 1];
      break;

    case RIGHT:
      newPart = [head[0], head[1] + 1];
      break;

    case UP:
      newPart = [head[0] - 1, head[1]];
      break;

    case DOWN:
      newPart = [head[0] + 1, head[1]];
      break;

    default:
      break;
  }
  snk.splice(0, 0, newPart);
  console.log("snake got bigger", snk);
  return snk;
}

// start
const initPosition = parseInt(BOARD_SIZE / 2);
let snk = [];
for (let index = 0; index < INIT_SNK_SIZE; index++) {
  snk.push([initPosition, initPosition - index]);
}

let apple = randomPosition();
let board = makeBoard(snk);
let lastDir = RIGHT;
step(snk, lastDir);

const mainInterval = setInterval(() => {
  try {
    console.log(lastDir);
    move(lastDir);
  } catch (error) {
    throw error;
  }
}, SPEED);

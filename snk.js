const BOARD_SIZE = 11;
const INIT_SNK_SIZE = 3;
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";
const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];
const GAME_OVER = "game over";
const SPEED = 250;

function randomPosition() {
  // create random apple position
  const randomRow = Math.floor(Math.random() * BOARD_SIZE);
  const randomCol = Math.floor(Math.random() * BOARD_SIZE);
  return [randomRow, randomCol];
}

function makeBoard(snk) {
  // generate the board's data as 2D-array
  // 0 = empty
  // 1 = snake body
  // @ = snake head
  // * = apple
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

  head = snk[0];
  board[head[0]][head[1]] = "@";
  board[apple[0]][apple[1]] = "*";

  board.forEach((row) => {
    console.debug(board.indexOf(row).toString().padEnd(5), row.join(" "));
  });

  console.debug("\n\n");

  return board;
}

function step(snk, direction = LEFT) {
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
  const head = snk[0];

  snk.forEach((part, partId) => {
    // is the snake out of boundaries?
    if (part.some((idx) => idx >= BOARD_SIZE || idx < 0)) {
      throw new Error(GAME_OVER);
    }

    // is the snake hitting itself?
    if (partId > 0) {
      if (JSON.stringify(head) === JSON.stringify(part)) {
        throw new Error(GAME_OVER);
      }
    }
  });

  // is the snake hitting the apple?
  if (head[0] === apple[0] && head[1] === apple[1]) {
    snk = eat();
  }
  return snk;
}

function createHtmlTable(board) {
  const tbl = document.querySelector("#container>table");
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

function draw(board) {
  const container = document.querySelector("#container>table");
  container.replaceChildren();
  createHtmlTable(board);
}

function move(dir, byUser = true) {
  if (isGameOver) return;

  if (byUser) {
    console.log(`user changed direction to ${dir}`);
  }
  console.log(`${!byUser ? "auto" : ""} moving ${dir}`);

  document
    .querySelectorAll(`.move-button`)
    .forEach((b) => b.classList.remove("current-direction"));
  document.querySelector(`#${dir}`).classList.add("current-direction");

  try {
    [snk, board] = step(snk, dir);
    draw(board);
    document.querySelectorAll(`.move-button`).forEach((btn) => {
      btn.disabled = btn.classList.contains(dir) ? true : false;
    });
  } catch (error) {
    if (error.message === GAME_OVER) {
      gameOver();
    } else {
      throw error;
    }
  }
}

function gameOver() {
  isGameOver = true;
  document.querySelector("#container>table").classList.toggle("gameover");
  document.querySelector("#message").innerHTML = "GAME OVER";
  document
    .querySelectorAll('[data-fill="1"]')
    .forEach((elem) => (elem.dataset.fill = "x"));
  document
    .querySelectorAll('[data-fill="@"]')
    .forEach((elem) => (elem.dataset.fill = "x"));
  document
    .querySelectorAll(".move-button")
    .forEach((btn) => (btn.disabled = true));
  clearInterval(mainInterval);
}

function eat() {
  const tableElemnt = document.querySelector("#container>table");
  tableElemnt.classList.add("apple");
  setTimeout(() => tableElemnt.classList.remove("apple"), 1000);
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
  console.log(`snake size changed to ${snk.length}`, snk);
  score += 1;
  displayScore();
  return snk;
}

function displayScore() {
  document.querySelector("#score").innerHTML = score;
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
let score = 0;
let isGameOver = false;
let mainInterval;

function start() {
  if (isGameOver) {
    isGameOver = false;
    document.querySelector("#container>table").classList.toggle("gameover");

    snk = [];
    for (let index = 0; index < INIT_SNK_SIZE; index++) {
      snk.push([initPosition, initPosition - index]);
    }
    apple = randomPosition();
    board = makeBoard(snk);
    lastDir = RIGHT;
    score = 0;
  }
  document.querySelector("#message").innerHTML = "";
  document.querySelectorAll(`.move-button`).forEach((btn) => {
    btn.disabled = false;
  });
  step(snk, lastDir);

  mainInterval = setInterval(() => {
    try {
      move(lastDir, false);
    } catch (error) {
      throw error;
    }
  }, SPEED);

  addEventListener("keydown", (e) => {
    if (e.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    switch (e.key) {
      case "ArrowDown":
        if (lastDir === UP) {
          console.warn("can't change from up to down");
          return;
        }
        move(DOWN);
        break;
      case "ArrowUp":
        if (lastDir === DOWN) {
          console.warn("can't change from down to up");
          return;
        }
        move(UP);
        break;
      case "ArrowLeft":
        if (lastDir === RIGHT) {
          console.warn("can't change from right to left");
          return;
        }
        move(LEFT);
        break;
      case "ArrowRight":
        if (lastDir === LEFT) {
          console.warn("can't change from left to right");
          return;
        }
        move(RIGHT);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
    e.preventDefault();
  });
}

addEventListener("keydown", (e) => {
  if (e.key === " ") start();
});
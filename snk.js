const BOARD_SIZE = 11;
const INIT_SNK_SIZE = 3;
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";
const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

function makeBoard(snk) {
  let board = new Array(BOARD_SIZE);

  for (let row = 0; row < board.length; row++) {
    board[row] = new Array(BOARD_SIZE);
    for (let col = 0; col < board[row].length; col++) {
      let found = snk.some((part) => {
        return row === part[0] && col === part[1];
      });
      let char = found ? "x" : "-";
      board[row][col] = char;
    }
  }

  board.forEach((row) => {
    console.log(board.indexOf(row).toString().padEnd(5), row.join(" "));
  });

  console.log("\n\n");

  return board;
}

function step(snk, direction = LEFT) {
  let head = snk[0];

  let newSnk = snk.map((part, index, original) => {
    if (index === 0) {
      switch (direction) {
        case LEFT:
          return [head[0], head[1] + 1];

        case RIGHT:
          return [head[0], head[1] - 1];

        case UP:
          return [head[0] - 1, head[1]];

        case DOWN:
          return [head[0] + 1, head[1]];
      }
    } else {
      return original[index - 1];
    }
  });
  validate(newSnk);
  makeBoard(newSnk);
  return newSnk;
}

function validate(snk) {
  snk.forEach((part) => {
    //console.log(part);
    if (part.some((idx) => idx >= BOARD_SIZE || idx < 0)) {
      throw new Error("game over");
    }
  });
}

// start
const initPosition = parseInt(BOARD_SIZE / 2);
let snk = [];
for (let index = 0; index < INIT_SNK_SIZE; index++) {
  snk.push([initPosition, initPosition - index]);
}
makeBoard(snk);

const mainInterval = setInterval(() => {
  try {
    const randomDirection =
      DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      console.log(randomDirection);
    snk = step(snk, randomDirection);
  } catch (error) {
    console.error(error.message);
    clearInterval(mainInterval);
  }
}, 1000);

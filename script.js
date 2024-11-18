const right = { x: 1, y: 0 }
const left = { x: -1, y: 0 }
const up = { x: 0, y: -1 }
const down = { x: 0, y: 1 }

const boardSize = 20

const initialState = {
  snake: [{ x: 0, y: 0 }],
  food: generateFood(),
  direction: right,
  gameOver: false,
}

const board = document.getElementById("board")

for (let index = 0; index < boardSize * boardSize; index += 1) {
  const cell = document.createElement("div")
  cell.classList.add("cell")
  board.appendChild(cell)
}

const renderBoard = (state) => {
  const cells = document.querySelectorAll(".cell")
  cells.forEach((cell) => (cell.className = "cell"))

  const [head, ...body] = state.snake

  const index = head.y * boardSize + head.x
  cells[index].classList.add("snake-head")

  body.forEach(segment => {
    const index = segment.y * boardSize + segment.x
    cells[index].classList.add("snake-body")
  })

  const foodIndex = state.food.y * boardSize + state.food.x
  cells[foodIndex].classList.add("food")
}

const moveSnake = (snake, direction) => {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  }

  newHead.x = (newHead.x + boardSize) % boardSize
  newHead.y = (newHead.y + boardSize) % boardSize

  return [newHead, ...snake.slice(0, -1)]
}

const checkCollison = (snake) => {
  const [head, ...body] = snake
  return body.some((segment) => segment.x === head.x && segment.y === head.y)
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  }
}

const gameLoop = (state) => {
  if (state.gameOver) {
    alert("Game over!")
    return
  }
  console.log("state.direction", state.direction)
  const newSnake = moveSnake(state.snake, initialState.direction)
  if (checkCollison(newSnake)) {
    state.gameOver = true
  }

  let newFood = state.food
  if (newSnake[0].x === state.food.x && newSnake[0].y === state.food.y) {
    newSnake.push({ ...newSnake[newSnake.length - 1] })
    newFood = generateFood()
  }

  const newState = {
    ...state,
    snake: newSnake,
    food: newFood,
  }
  console.log("newState.direction", newState.direction)

  renderBoard(newState)
  setTimeout(() => gameLoop(newState), 200)
}

const handleKeyPress = (event) => {
  const keyMap = {
    ArrowRight: right,
    ArrowLeft: left,
    ArrowUp: up,
    ArrowDown: down,
  }

  if (keyMap[event.key]) {
    initialState.direction = keyMap[event.key]
  }
}

document.addEventListener("keydown", handleKeyPress)
renderBoard(initialState)
gameLoop(initialState)

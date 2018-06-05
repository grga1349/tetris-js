const canvas = document.getElementById('gameCanvas')
const context = canvas.getContext('2d')

const GRID_WIDTH = 16
const GRID_HEIGHT = 32
const PIECE_GRID_WIDTH = 4
const PIECE_GRID_HEIGHT = 4
const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height
const BRICK_WIDTH = canvas.width / 16
const BRICK_HEIGHT = BRICK_WIDTH

function drawBrick(x, y, color) {
  const xReal = x * BRICK_WIDTH
  const yReal = y * BRICK_HEIGHT
  
  context.fillStyle = color
  context.fillRect(xReal + 1, yReal + 1, BRICK_WIDTH - 2, BRICK_HEIGHT - 2)
}

function clearCanvas() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

export {
  GRID_WIDTH,
  GRID_HEIGHT, 
  PIECE_GRID_WIDTH, 
  PIECE_GRID_HEIGHT, 
  CANVAS_WIDTH,
  CANVAS_HEIGHT, 
  BRICK_WIDTH,
  BRICK_HEIGHT,
  drawBrick,
  clearCanvas
}

import {createPiece} from './piece'
import {createGrid} from './grid'
import { GRID_WIDTH, 
  GRID_HEIGHT, 
  PIECE_GRID_WIDTH, 
  PIECE_GRID_HEIGHT, 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  BRICK_WIDTH, 
  BRICK_HEIGHT, 
  drawBrick, 
  clearCanvas 
} from './dom'

// Game object
function createGame(grid, piece) {
  const priv = {
    grid: grid,
    piece: piece,
    score: 0,
    scoreElement: document.getElementById('score')
  }

  const pub = {
    noColision(nextXPos, nextYPos) {
      for (let i = 0; i < PIECE_GRID_HEIGHT; i ++) {
        let mask = priv.piece.getRow(i)
        let row = priv.grid.getRow(i + nextYPos)

        if (nextXPos > 0) {
          mask = mask >> nextXPos
        } else {
          mask = mask << (nextXPos * -1)
        }

        if(row & mask) {
          return false
        }
      }

      return true
    },

    pushPieceIntoGrid() {
      let {x, y} = priv.piece.getPosition()

      for (let i = 0; i < PIECE_GRID_HEIGHT; i ++) {
        let mask = priv.piece.getRow(i)
        let row = priv.grid.getRow(i + y)

        if (x > 0) {
          mask = mask >> x
        } else {
          mask = mask << (x * -1)
        }

        priv.grid.setRow(i + y, row | mask)

      }
       
    },

    renderScore() {
      console.log('rendering score', priv.scoreElement)

      priv.scoreElement.innerHTML = priv.score
    },

    resetPiece() {
      priv.piece = priv.piece.resetPosition()
      priv.piece = priv.piece.randomizePiece()
    },

    moveLeft() {
      let {x, y} = priv.piece.getPosition()

      if (pub.noColision(x - 1, y)) {
        priv.piece = priv.piece.moveLeft()
      }
    },

    moveRight() {
      let {x, y} = priv.piece.getPosition()

      if (pub.noColision(x + 1, y)) {
        priv.piece = priv.piece.moveRight()
      }
    },

    moveDown() {
      let {x, y} = priv.piece.getPosition()

      if (pub.noColision(x, y + 1)) {
        priv.piece = priv.piece.moveDown()
      } else {
        pub.pushPieceIntoGrid()
        pub.resetPiece()
        if (priv.grid.removeFull()) {
          priv.score = priv.score + 10
          pub.renderScore()
        }
      }  
    },

    rotate() {
      let {x, y} = priv.piece.getPosition()

      priv.piece = priv.piece.rotate()

      if (!pub.noColision(x, y)) {
        priv.piece = priv.piece.rotateBack()
      } 
    },

    onKeyDown(event) {
      // console.log(event.keyCode)
      switch (event.keyCode) {
        case 39:
          pub.moveRight()
          break
        case 37:
          pub.moveLeft()
          break
        case 32:
          pub.rotate()
          break
        case 67:
          priv.piece = priv.piece.changePiece() 
        default:
          break
      }
    },

    renderGame() {
      clearCanvas()
      priv.grid.render()
      priv.piece.render()
    },

    init() {
      document.addEventListener('keydown', pub.onKeyDown)
      setInterval(pub.renderGame, 16)
      setInterval(pub.moveDown, 300)
    },
  }

  return pub
}

const game = createGame(
  createGrid(),
  createPiece({
    x: 0, 
    y: 0, 
    xPos: 5, 
    yPos: 4, 
    rotation: 0, 
    type: 0, 
    color: 'blue'
  })
)

game.init()


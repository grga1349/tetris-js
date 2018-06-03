import {Piece} from './piece'
import {Grid} from './grid'
import {
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
} from './dom'

// Game object
class Game {
  constructor(grid, piece) {
    this.grid = grid
    this.piece = piece

    this.onKeyDown = this.onKeyDown.bind(this)
    this.moveDown = this.moveDown.bind(this)
    this.renderGame = this.renderGame.bind(this)
  }

  noColision(nextXPos, nextYPos) {
    for (let i = 0; i < PIECE_GRID_HEIGHT; i ++) {
      let mask = this.piece.getRow(i)
      let row = this.grid.getRow(i + nextYPos)

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
  }

  pushPieceIntoGrid() {
  
  }

  resetPiece() {
    this.piece.resetPosition()
  }

  moveLeft() {
    let {x, y} = this.piece.getPosition()

    if (this.noColision(x - 1, y)) {
      this.piece.moveLeft()
    }
  }

  moveRight() {
    let {x, y} = this.piece.getPosition()

    if (this.noColision(x + 1, y)) {
      this.piece.moveRight()
    }
  }

  moveDown() {
    let {x, y} = this.piece.getPosition()

    if (this.noColision(x, y + 1)) {
      this.piece.moveDown()
    } else {
      this.pushPieceIntoGrid()
      this.resetPiece()
    }  
  }

  rotate() {
    let {x, y} = this.piece.getPosition()

    this.piece.rotate()

    if (!this.noColision(x, y)) {
      this.piece.rotateBack()
    } 
  }

  changePiece() {

  }

  onKeyDown(event) {
    // console.log(event.keyCode)
    switch (event.keyCode) {
      case 39:
        this.moveRight()
        break
      case 37:
        this.moveLeft()
        break
      case 32:
        this.rotate()
        break
      case 67:
        this.piece.changePiece() 
      default:
        break
    }
  }

  renderGame() {
    clearCanvas()
    this.grid.render()
    this.piece.render()
  }

  init() {
    document.addEventListener('keydown', this.onKeyDown)
    setInterval(this.renderGame, 16)
    setInterval(this.moveDown, 300)
  }
}

const game = new Game(
  new Grid(),
  new Piece(0, 0, 5, 4, 0, 0, 'blue')
)

game.init()

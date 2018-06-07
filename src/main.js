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
    this.score = 0
    this.scoreElement = document.getElementById('score')

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
    let {x, y} = this.piece.getPosition()

    for (let i = 0; i < PIECE_GRID_HEIGHT; i ++) {
      let mask = this.piece.getRow(i)
      let row = this.grid.getRow(i + y)

      if (x > 0) {
        mask = mask >> x
      } else {
        mask = mask << (x * -1)
      }

      this.grid.setRow(i + y, row | mask)

    }
     
  }

  renderScore() {
    console.log('rendering score', this.scoreElement)

    this.scoreElement.innerHTML = this.score
  }

  resetPiece() {
    this.piece.resetPosition()
    this.piece.randomizePiece()
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
      if (this.grid.removeFull()) {
        this.score = this.score + 10
        this.renderScore()
      }
    }  
  }

  rotate() {
    let {x, y} = this.piece.getPosition()

    this.piece.rotate()

    if (!this.noColision(x, y)) {
      this.piece.rotateBack()
    } 
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


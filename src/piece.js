import {PIECE_GRID_WIDTH, PIECE_GRID_HEIGHT, drawBrick} from './dom'
import {getType} from './types'

// Piece object
class Piece {
  constructor(x, y, xPos, yPos, rotation, type, color) {
    this.xPos = xPos 
    this.yPos = yPos 
    this.x = x
    this.y = y
    this.rotation = rotation
    this.type = type
    this.color = color

    this.render = this.render.bind(this)
    this[Symbol.iterator] = this[Symbol.iterator].bind(this)
  }

  render() {
    for(let {x, y, full} of this) {

      if (full) {
        drawBrick(x, y, this.color)
      }
    }
  }

  resetPosition() {
    this.xPos = 5
    this.yPos = 4
  }

  moveLeft() {
    this.xPos = this.xPos - 1
  }

  moveRight() {
    this.xPos = this.xPos + 1
  }

  moveDown() {
    this.yPos = this.yPos + 1
  }

  rotate() {
    this.rotation = this.rotation + 1

    if (this.rotation === 4) {
      this.rotation = 0
    }
  }

  rotateBack() {
    this.rotation = this.rotation - 1

    if (this.rotation === -1) {
      this.rotation = 3
    }
  }

  changePiece() {
    this.type = this.type + 1

    if (this.type === 7) {
      this.type = 0
    }
  }

  getPosition() {
    return {x: this.xPos, y: this.yPos}
  }  	

  getRow(rowIndex) {
    return (getType(this.type, this.rotation) << 
      (rowIndex * 4)) &
      (0xF000)
  }

  debug() {
    console.log('Piece debug: ', {
      x: this.x,
      y: this.y,
      xPos: this.xPos,
      yPos: this.yPos,
      rotation: this.rotation,
      type: this.type,
    })
  }

  [Symbol.iterator]() {
    this.x = 0
    this.y = 0
    this.bin = 0x8000

    return {
      next: () => {
        if (
          this.x === PIECE_GRID_WIDTH && 
          this.y === PIECE_GRID_HEIGHT
        ) {
          return {done: true}
        }

        if (this.x === PIECE_GRID_WIDTH) {
          this.x = 0
          this.y = this.y + 1
        }

        let x = this.x + this.xPos
        let y = this.y + this.yPos

        let bin = this.bin

        this.x = this.x + 1
        this.bin = this.bin >> 1

        let full = bin & getType(this.type, this.rotation)

        return {value: {x, y, full}, done: false}
      }
    }
  }
}

export {
  Piece
}

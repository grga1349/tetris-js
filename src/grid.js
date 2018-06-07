import {GRID_WIDTH, GRID_HEIGHT, drawBrick} from './dom'

const EMPTY_GRID_PIECE = 0x8001
const FULL_GRID_PIECE = 0xFFFF

// Grid object
class Grid {
  constructor() {
    this.x = 0
    this.y = 0
    this.bin = 0x8000
    this.color = 'red'
    this.grid = new Uint16Array(GRID_HEIGHT)

    for (let key in this.grid) {
      if (key == GRID_HEIGHT - 1) {
        this.grid[key] = FULL_GRID_PIECE
        
        break
      }
      
      this.grid[key] = EMPTY_GRID_PIECE
    }

    this.render = this.render.bind(this)
    this[Symbol.iterator] = this[Symbol.iterator].bind(this)
  }

  render() {
    for (let {x, y, full} of this) {

      if (full) {
        drawBrick(x, y, this.color)
      }
    }
  }

  getRow(rowIndex) {
    return this.grid[rowIndex]
  }

  removeFull() {
    let skip = 0

    for (let i = GRID_HEIGHT - 2; i >= 0; i --) {
      if (this.grid[i] === 0xFFFF) {
        skip = skip + 1
      }

      if ((i - skip) < 0) {
        this.grid[i] = EMPTY_GRID_PIECE

        continue
      } 

      this.grid[i] = this.grid[i - skip]
    }

    return skip !== 0
  }

  setRow(rowIndex, payload) {
    this.grid[rowIndex] = payload
  }

  [Symbol.iterator]() {
    this.x = 0
    this.y = 0
    this.bin = 0x8000
  
    return {
      next: () => {
        if (this.x === GRID_WIDTH && this.y === GRID_HEIGHT) {
          return {done: true}
        }
        
        if (this.x === GRID_WIDTH) {
          this.x = 0
          this.y = this.y + 1
          this.bin = 0x8000
        }

        let x = this.x
        let y = this.y
        let bin = this.bin

        let row = this.grid[y]

        this.x = this.x + 1
        this.bin = this.bin >> 1
        
        let full = bin & row
        
        return {value: {x, y, full}, done: false}
      }
    }
  }
}

export {Grid}

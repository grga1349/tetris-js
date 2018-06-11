import {GRID_WIDTH, GRID_HEIGHT, extendWithRender} from './dom'

const EMPTY_GRID_PIECE = 0x8001
const FULL_GRID_PIECE = 0xFFFF

// Grid object
function createGrid(){
  const priv = {
    color: 'red',
    grid: new Uint16Array(GRID_HEIGHT)
  }
  const pub = {
    getRow(rowIndex) {
      return priv.grid[rowIndex]
    },

    removeFull() {
      let skip = 0

      for (let i = GRID_HEIGHT - 2; i >= 0; i --) {
        if (priv.grid[i] === 0xFFFF) {
          skip = skip + 1
        }

        if ((i - skip) < 0) {
          priv.grid[i] = EMPTY_GRID_PIECE

          continue
        } 

        priv.grid[i] = priv.grid[i - skip]
      }

      return skip !== 0
    },

    setRow(rowIndex, payload) {
      priv.grid[rowIndex] = payload
    },

    blocks: {
      [Symbol.iterator]() {
        let x = 0
        let y = 0
        let bin = 0x8000
      
        return {
          next: () => {
            if (x === GRID_WIDTH && y === GRID_HEIGHT) {
              return {done: true}
            }
            
            if (x === GRID_WIDTH) {
              x = 0
              y = y + 1
              bin = 0x8000
            }

            let tempX = x
            let tempY = y
            let tempBin = bin
            let row = priv.grid[y]

            x = x + 1
            bin = bin >> 1
            
            let full = tempBin & row
            
            return {value: {x: tempX, y: tempY, full}, done: false}
          }
        }
      }
    }
  }

  for (let key in priv.grid) {
    if (key == GRID_HEIGHT - 1) {
      priv.grid[key] = FULL_GRID_PIECE
      
      break
    }
    
    priv.grid[key] = EMPTY_GRID_PIECE
  }

  return {...pub, ...extendWithRender(pub, priv)}
}

export {createGrid}

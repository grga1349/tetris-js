import {PIECE_GRID_WIDTH, PIECE_GRID_HEIGHT, extendWithRender} from './dom'
import {getType} from './types'

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function createPiece({x, y, xPos, yPos, rotation, type, color}) {
  const priv = {x, y, xPos, yPos, rotation, type, color}
  const pub = {
    getPosition() {
      const {xPos: x, yPos: y} = priv

      return {x, y}
    },
 
    randomizePiece() {
      return createPiece({
        ...priv,
        type: getRandomNumber(7),
        rotation: getRandomNumber(4),
      })
    },

    resetPosition() {
      return createPiece({...priv, xPos: 5, yPos: 4})
    },

    moveLeft() {
      const {xPos} = priv

      return createPiece({...priv, xPos: xPos - 1})
    },

    moveRight() {
      const {xPos} = priv

      return createPiece({...priv, xPos: xPos + 1})
    },

    moveDown() {
      const {yPos} = priv

      return createPiece({...priv, yPos: yPos + 1})
    },

    rotate() {
      const {rotation} = priv

      if (rotation === 3) {
        return createPiece({...priv, rotation: 0})
      }

      return createPiece({...priv, rotation: rotation + 1})
    },

    rotateBack() {
      const {rotation} = priv

      if (rotation === 0) {
        return createPiece({...priv, rotation: 3})
      }

      return createPiece({...priv, rotation: rotation - 1})
    },

    changePiece() {
      const {type} = priv

      if (type === 6) {
        return createPiece({...priv, type: 0})
      }

      return createPiece({...priv, type: type + 1})
    },


    getRow(rowIndex) {
      const {type, rotation} = priv

      return (getType(type, rotation) << (rowIndex * 4)) & (0xF000)
    },

    blocks: {
      [Symbol.iterator]() {
        const {xPos, yPos, type, rotation} = priv
        let x = 0
        let y = 0
        let bin = 0x8000

        return {
          next: () => {
            if (
              x === PIECE_GRID_WIDTH && 
              y === PIECE_GRID_HEIGHT
            ) {
              return {done: true}
            }

            if (x === PIECE_GRID_WIDTH) {
              x = 0
              y = y + 1
            }

            let tempX = x + xPos
            let tempY = y + yPos

            let tempBin = bin

            x = x + 1
            bin = bin >> 1

            let full = tempBin & getType(type, rotation)

            return {value: {x: tempX, y: tempY, full}, done: false}
          }
        }
      }
    }
  }

  return {...pub, ...extendWithRender(pub, priv)}
}

export {
  createPiece,
}

import {createDomain, sample} from 'effector'
import {Socket} from "socket.io";

const gameDomain = createDomain()


interface Client {
  socket: string,
  desk:  number[][]
  background : string
}

const $clients = gameDomain.createStore<{currentPlayer: string | null, clients: Client[]}>({currentPlayer: '', clients: []})

const init = gameDomain.createEvent<string>()
const move = gameDomain.createEvent<{direction: string, clientId: string}>()
const clientConnected  = gameDomain.createEvent<string>()
const clientDisconnected  = gameDomain.createEvent<string>()

sample({
  source:$clients,
  clock:clientConnected,
  target:$clients,
  fn:(clients,socket)=>{
 let  r = Math.floor(Math.random() * (256))
    let  g = Math.floor(Math.random() * (256))
    let b = Math.floor(Math.random() * (256))
       let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    clients.clients.push(
        {socket:socket,desk:[[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]], background:color})


    return {
      currentPlayer:clients.currentPlayer,
      clients:clients.clients
    }

  }
})
sample({
  source:$clients,
  clock:clientDisconnected,
  target:$clients,
  fn:(clients,socket)=>{
    const newCl = clients.clients.slice(clients.clients.findIndex(client => client.socket === socket),1)

    return {
      currentPlayer:String(socket),
      clients:newCl
    }}})



const getBlankCoordinates = (desk: number[][]) => {
  const blankCoordinates = []
  for (let r = 0; r < desk.length; r++) {
    for (let c = 0; c < desk[r].length; c++) {
      if (desk[r][c] === 0) {
        blankCoordinates.push([r, c])
      }
    }
  }

  return blankCoordinates
}

const randomStartingNumber = () => {
  const startingNumbers = [2, 4]
  return startingNumbers[Math.floor(Math.random() * startingNumbers.length)]
}
const placeRandom = (desk: Array<Array<number>>) => {
  const blankCoordinates = getBlankCoordinates(desk)
  const randomCoordinate = blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)]
  desk[randomCoordinate[0]][randomCoordinate[1]] = randomStartingNumber()
  return desk
}
const moveUp = (inputDesk: Array<Array<number>>): Array<Array<number>> => {
  let rotatedRight = rotateRight(inputDesk)
  let desk = []

  // Shift all numbers to the right
  for (let r = 0; r < rotatedRight.length; r++) {
    let row = []
    for (let c = 0; c < rotatedRight[r].length; c++) {
      let current = rotatedRight[r][c]
      current === 0 ? row.unshift(current) : row.push(current)
    }

    desk.push(row)
  }

  for (let r = 0; r < desk.length; r++) {
    for (let c = desk[r].length - 1; c >= 0; c--) {
      if (desk[r][c] > 0 && desk[r][c] === desk[r][c - 1]) {
        desk[r][c] = desk[r][c] * 2
        desk[r][c - 1] = 0
      } else if (desk[r][c] === 0 && desk[r][c - 1] > 0) {
        desk[r][c] = desk[r][c - 1]
        desk[r][c - 1] = 0
      }
    }
  }

  desk = rotateLeft(desk)

  return [...desk]
}

const moveRight = (inputBoard: Array<Array<number>>) => {
  let desk = []

  for (let r = 0; r < inputBoard.length; r++) {
    let row = []
    for (let c = 0; c < inputBoard[r].length; c++) {
      let current = inputBoard[r][c]
      current === 0 ? row.unshift(current) : row.push(current)
    }
    desk.push(row)
  }

  for (let r = 0; r < desk.length; r++) {
    for (let c = desk[r].length - 1; c >= 0; c--) {
      if (desk[r][c] > 0 && desk[r][c] === desk[r][c - 1]) {
        desk[r][c] = desk[r][c] * 2
        desk[r][c - 1] = 0
      } else if (desk[r][c] === 0 && desk[r][c - 1] > 0) {
        desk[r][c] = desk[r][c - 1]
        desk[r][c - 1] = 0
      }
    }
  }

  return [...desk]
}

const moveDown = (inputBoard: Array<Array<number>>) => {
  let rotatedRight = rotateRight(inputBoard)
  let desk = []

  for (let r = 0; r < rotatedRight.length; r++) {
    let row = []
    for (let c = rotatedRight[r].length - 1; c >= 0; c--) {
      let current = rotatedRight[r][c]
      current === 0 ? row.push(current) : row.unshift(current)
    }
    desk.push(row)
  }

  for (let r = 0; r < desk.length; r++) {
    for (let c = 0; c < desk.length; c++) {
      if (desk[r][c] > 0 && desk[r][c] === desk[r][c + 1]) {
        desk[r][c] = desk[r][c] * 2
        desk[r][c + 1] = 0
      } else if (desk[r][c] === 0 && desk[r][c + 1] > 0) {
        desk[r][c] = desk[r][c + 1]
        desk[r][c + 1] = 0
      }
    }
  }

  desk = rotateLeft(desk)

  return [...desk]
}

const moveLeft = (inputBoard: Array<Array<number>>) => {
  let desk = []

  for (let r = 0; r < inputBoard.length; r++) {
    let row = []
    for (let c = inputBoard[r].length - 1; c >= 0; c--) {
      let current = inputBoard[r][c]
      current === 0 ? row.push(current) : row.unshift(current)
    }
    desk.push(row)
  }

  for (let r = 0; r < desk.length; r++) {
    for (let c = 0; c < desk.length; c++) {
      if (desk[r][c] > 0 && desk[r][c] === desk[r][c + 1]) {
        desk[r][c] = desk[r][c] * 2
        desk[r][c + 1] = 0
      } else if (desk[r][c] === 0 && desk[r][c + 1] > 0) {
        desk[r][c] = desk[r][c + 1]
        desk[r][c + 1] = 0
      }
    }
  }

  return [...desk]
}

const rotateRight = (matrix: Array<Array<number>>) => {
  let result = []

  for (let c = 0; c < matrix.length; c++) {
    let row = []
    for (let r = matrix.length - 1; r >= 0; r--) {
      row.push(matrix[r][c])
    }
    result.push(row)
  }

  return [...result]
}

const rotateLeft = (matrix: Array<Array<number>>) => {
  let result = []

  for (let c = matrix.length - 1; c >= 0; c--) {
    let row = []
    for (let r = matrix.length - 1; r >= 0; r--) {
      row.unshift(matrix[r][c])
    }
    result.push(row)
  }

  return [...result]
}
const boardMoved = (original: Array<Array<number>>, updated: Array<Array<number>>) => {
  return JSON.stringify(updated) !== JSON.stringify(original)
}
const checkForGameOver = (desk: number[][]) => {
  let moves = [
    boardMoved(desk, moveUp(desk)),
    boardMoved(desk, moveRight(desk)),
    boardMoved(desk, moveDown(desk)),
    boardMoved(desk, moveLeft(desk)),
  ]

  return !moves.includes(true)
}


sample({
  source: $clients,
  clock: init,
  target: $clients,
  fn: (clients, socketID) => {

    clients.clients.map(client => {
          client.desk.map((row) => row.fill(0))
          client.desk = placeRandom(placeRandom(client.desk))
        }
    )
      clients.currentPlayer = socketID

    return {
      currentPlayer: clients.currentPlayer,
      clients: clients.clients
    }}
})

sample({
  source: $clients,
  clock: move,
  target: $clients,
  fn: (clients, {direction, clientId}) => {
    let currentPlayerIndex = clients.clients.findIndex(client => client.socket === clientId)

    if (clients.clients[currentPlayerIndex+1] !==undefined) {
      console.log("Сходил - " + clients.clients[currentPlayerIndex+1].socket)
      clients.currentPlayer = clients.clients[currentPlayerIndex+1].socket

    } else {
      clients.currentPlayer = clients.clients[0].socket
    }
      if (direction === 'up') {
        clients.clients = clients.clients.map(client => {

          const movedUp = moveUp(client.desk)
          if (boardMoved(client.desk, movedUp)) {
             placeRandom(movedUp)
          }
          return {...client, desk: movedUp}
        })

      }  else if (direction === 'down') {
        clients.clients=clients.clients.map(client => {
          const movedDown = moveDown(client.desk)
          if (boardMoved(client.desk, movedDown)) {
             placeRandom(movedDown)
          }

          return {...client, desk: movedDown}
        })
      } else if (direction === 'right') {
        clients.clients = clients.clients.map(client => {
          const movedRight = moveRight(client.desk)
          if (boardMoved(client.desk, movedRight)) {
            placeRandom(movedRight)
          }
          return {...client, desk: movedRight}
        })
      } else if (direction === 'left') {
        clients.clients =clients.clients.map(client => {
          const movedLeft = moveLeft(client.desk)
          if (boardMoved(client.desk, movedLeft)) {
             placeRandom(movedLeft)
          }

           return {...client, desk: movedLeft}
        })
      }

    return {...clients}
  },
})

export const gameService = {
  clients:$clients,
  move,
  init,
  clientDisconnected,
  clientConnected,

}

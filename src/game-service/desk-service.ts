import { createDomain, sample } from 'effector'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

const gameDomain = createDomain()

const newGameClicked = gameDomain.createEvent()
const updateClients = gameDomain.createEvent<Client[]>()
const move = gameDomain.createEvent<string>()
const updateCurrentPlayer = gameDomain.createEvent<string>()

type Client = {
  desk: number[][]
  socket: string
  background: string
}

const $clients = gameDomain.createStore<Client[]>([])
const $currentPlayer = gameDomain.createStore<string>('')
$clients.on(updateClients, (clients, newClients) => {
  return newClients
})

$currentPlayer.on(updateCurrentPlayer, (last, current) => {
  return current
})

socket.on('connect', () => {
  console.log(socket.id)

  socket.on('sendClients', (clients) => {
    updateClients(clients.clients)
    updateCurrentPlayer(clients.currentPlayer)
  })

  newGameClicked.watch(() => {
    socket.emit('newGameClicked')
  })

  sample({
    source: $currentPlayer,
    clock: move,
    fn: (currentPlayer, direction) => {
      if (socket.id === currentPlayer) {
        socket.emit('move', direction)
      }
    },
  })

  // move.watch((direction) => {
  //   if()
  //   socket.emit('move', direction)
  // })
  socket.on('current', (currentSocketId) => {
    updateCurrentPlayer(currentSocketId)
  })
})

export const gameService = {
  clients: $clients,
  newGameClicked,
  updateClients,
  move,
  currentPlayer: $currentPlayer,
}

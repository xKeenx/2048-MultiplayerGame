import React, { useEffect } from 'react'
import Row from './Row'
import style from '../style.module.scss'
import { useStore } from 'effector-react'
import { gameService } from '../game-service/desk-service'

const Board = () => {
  const clients = useStore(gameService.clients)
  const currentPlayer = useStore(gameService.currentPlayer)

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      const up = 'ArrowUp'
      const right = 'ArrowRight'
      const down = 'ArrowDown'
      const left = 'ArrowLeft'
      if (e.key === up) {
        gameService.move('up')
      } else if (e.key === right) {
        gameService.move('right')
      } else if (e.key === down) {
        gameService.move('down')
      } else if (e.key === left) {
        gameService.move('left')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div>
      <div className={style.title}> 2048 </div>

      <div className={style.restartButtonDiv}>
        <button className={style.buttonStyle} onClick={() => gameService.newGameClicked()}>
          Новая игра
        </button>
      </div>

      <div className={style.multiplayer}>
        {clients.length > 0 &&
          clients.map((client, i) => (
            <div key={i} style={client.socket === currentPlayer ? { border: 'solid red 20px' } : {}}>
              Игрок № {i + 1}
              <div key={i} style={{ backgroundColor: client.background }}>
                {client.desk.map((row, i) => (
                  <Row key={i} row={row} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Board

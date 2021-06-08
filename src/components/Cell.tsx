import React from 'react'
import style from '../style.module.scss'

const Cell = (props: { cellValue: number }) => {
  let value = props.cellValue === 0 ? '' : props.cellValue

  let color = (value: number | string) => {
    if (value === 2) return '#eee4da'

    if (value === 4) return '#eee1c9'

    if (value === 8) return '#f3b27a'

    if (value === 16) return '#f69664'

    if (value === 32) return '#f77c5f'

    if (value === 64) return '#f75f3b'

    if (value === 128) return '#edd073'

    if (value === 256) return 'pink'

    if (value === 512) return '#50C8FF'

    if (value === 1024) return 'green'

    if (value === 2048) return 'blue'
    return ''
  }
  const backgroundColor = {
    backgroundColor: color(value),
  }

  return (
    <div>
      <div className={style.cell} style={backgroundColor}>
        <div style={{ fontSize: '55px' }}>{value}</div>
      </div>
    </div>
  )
}
export default Cell

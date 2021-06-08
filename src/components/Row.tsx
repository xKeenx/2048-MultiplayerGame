import React from 'react'
import Cell from './Cell'

const Row = (props: { row: number[] }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {props.row.map((cell, i) => (
        <Cell key={i} cellValue={cell} />
      ))}
    </div>
  )
}
export default Row

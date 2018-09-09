import React from 'react'
import './Letter.css'

export default function Letter(props) {
  return (
    <div className="letter">
      <div className="square-box">
        <div className="square-content">
          <div>{props.letter}</div>
        </div>
      </div>
    </div>
  )
}

import React, { Component } from 'react'
import './Letter.css'

export default class Letter extends Component {
  render() {
    const { letter, size } = this.props
    return (
      <svg width={size} height={size}>
        <rect x="0" y="0" width={size} height={size} fill="white" />
        <text
          className="letter"
          style={{ '--size': `${size}px` }}
          x="50%"
          y="50%"
          alignment-baseline="central"
          text-anchor="middle"
        >
          {letter}
        </text>
      </svg>
    )
  }
}

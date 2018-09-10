import React, { Component } from 'react'
import Letter from '../Letter'
import './Word.css'

export default class Word extends Component {
  render() {
    const { word, wordIndex } = this.props
    const delay = {
      '--delay': wordIndex * 40 + 'ms'
    }

    return (
      <div className="word" style={delay}>
        {word.split('').map((letter, i) => (
          <Letter key={i} letter={letter.toUpperCase()} />
        ))}
      </div>
    )
  }
}

import React, { Component } from 'react'
import Letter from '../Letter'
import './Word.css'

export default class Word extends Component {
  render() {
    const delay = {
      '--delay': this.props.wordIndex * 40 + 'ms'
    }
    return (
      <div className="word" style={delay}>
        {this.props.word.split('').map((letter, i) => (
          <Letter key={i} letter={letter.toUpperCase()} />
        ))}
      </div>
    )
  }
}

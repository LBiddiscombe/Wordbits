import React, { Component } from 'react'
import './WordList.css'

export default class WordList extends Component {
  render() {
    const { words } = this.props
    return (
      <ul className="wordList">
        {words &&
          words.map((word, i) => (
            <li className="wordList__item" key={word}>
              {word.toLowerCase()}
            </li>
          ))}
      </ul>
    )
  }
}

import React, { Component } from 'react'
import './WordList.css'

export default class WordList extends Component {
  render() {
    const { words } = this.props
    return (
      <ul className="word-list">
        {words &&
          words.map((word, i) => (
            <li className="word-list-item" key={word}>
              {word.toLowerCase()}
            </li>
          ))}
      </ul>
    )
  }
}

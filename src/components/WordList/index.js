import React, { Component } from 'react'
import './WordList.css'
import Word from '../Word'

export default class WordList extends Component {
  render() {
    const { words } = this.props
    return (
      <ul className="word-list">
        {words.map((word, i) => (
          <li className="word-list-item" key={word}>
            <Word word={word} wordIndex={i} />
          </li>
        ))}
      </ul>
    )
  }
}

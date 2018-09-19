import React, { Component } from 'react'
import './WordList.css'
import Word from '../Word'

export default class WordList extends Component {
  render() {
    const { words, duration = 0 } = this.props
    return (
      <ul className="word-list">
        {words && (
          <li className="results">
            Found {words.length} results in {duration}
            ms
          </li>
        )}
        {words &&
          words.map((word, i) => (
            <li className="word-list-item" key={word}>
              <Word word={word} wordIndex={i} />
            </li>
          ))}
      </ul>
    )
  }
}

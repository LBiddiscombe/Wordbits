import React, { Component } from 'react'
import './WordList.css'
import Word from '../Word'

export default class WordList extends Component {
  render() {
    const { dictionary, letters } = this.props
    const anagrams = dictionary ? dictionary.getAnagrams(letters, 3) : []
    return (
      <ul className="word-list">
        {anagrams.map((word, i) => (
          <li className="word-list-item" key={word}>
            <Word word={word} wordIndex={i} />
          </li>
        ))}
      </ul>
    )
  }
}

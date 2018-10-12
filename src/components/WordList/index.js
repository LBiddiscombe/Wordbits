import React, { Component } from 'react'
import './WordList.css'

const LengthTitle = props => <li className="wordList__title">{props.len} letters</li>
const Word = props => <li className="wordList__item">{props.word.toLowerCase()}</li>

export default class WordList extends Component {
  render() {
    const { words = [] } = this.props

    let rows = []
    let lastLength = 0
    words.forEach(word => {
      if (word.length !== lastLength) {
        rows.push(<LengthTitle len={word.length} key={word.length} />)
      }
      rows.push(<Word word={word} key={word} />)
      lastLength = word.length
    })
    return <ul className="wordList">{rows}</ul>
  }
}

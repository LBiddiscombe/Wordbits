import React, { Component } from 'react'
import './WordList.css'
import Definition from '../Definition'

const LengthTitle = props => (
  <li className="wordList__title">
    <span className="wordList__titleText">
      {props.len} <span className="wordList__titleLetters">letters</span>
    </span>
  </li>
)
const Word = props => <li className="wordList__item">{props.word.toLowerCase()}</li>

export default class WordList extends Component {
  state = { selectedWord: '' }

  onClick = e => {
    e.preventDefault()
    if (e.target.tagName === 'SPAN') return
    if (!this.state.selectedWord) {
      this.setState({ selectedWord: e.target.textContent })
    } else {
      this.setState({ selectedWord: '' })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectedWord: '' })
  }

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

    const columns = Math.trunc(words.length / 15) + 1

    return this.state.selectedWord ? (
      <div onClick={this.onClick}>
        <Definition word={this.state.selectedWord} />
      </div>
    ) : (
      <ul
        className="wordList"
        style={{ '--column-count': columns, '--width': columns * 10 + 'rem' }}
        onClick={this.onClick}
      >
        {rows}
      </ul>
    )
  }
}

import React, { Component } from 'react'
import './WordList.css'
import Definition from '../Definition'

const LengthTitle = props => (
  <li className="wordList__title">
    <span className="wordList__titleText">{props.len} letters</span>
  </li>
)
const Word = props => <li className="wordList__item">{props.word.toLowerCase()}</li>

export default class WordList extends Component {
  state = { defn: [] }

  onClick = e => {
    e.preventDefault()
    if (this.state.defn.length > 0) {
      this.setState({ defn: [] })
      return
    }
    fetch(
      'https://googledictionaryapi.eu-gb.mybluemix.net/?define=' +
        e.target.textContent +
        '&lang=en',
      {}
    )
      .then(blob => blob.json())
      .then(data => {
        this.setState({ defn: data })
      })
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

    return this.state.defn.length > 0 ? (
      <Definition definition={this.state.defn}>
        <div onClick={this.onClick}>{JSON.stringify(this.state, null, 2)}</div>
      </Definition>
    ) : (
      <ul className="wordList" onClick={this.onClick}>
        {rows}
      </ul>
    )
  }
}

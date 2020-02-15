import React, { useState, useEffect } from 'react'
import { animated, useTransition } from 'react-spring'
import './WordList.css'
import Definition from '../Definition'

function WordList(props) {
  const [selectedWord, setSelectedWord] = useState('')
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    setSelectedWord('')
    if (props.words) {
      setColumns(Math.trunc(words.length / 15) + 1)
    }
  }, [props])

  const onClick = e => {
    e.preventDefault()
    if (['SPAN', 'UL'].includes(e.target.tagName)) return
    if (!selectedWord) {
      setSelectedWord(e.target.textContent)
    } else {
      setSelectedWord('')
    }
  }

  const { words = [] } = props

  let rows = []
  let lastLength = 0
  words.forEach(word => {
    if (word.length !== lastLength) {
      rows.push(<LengthTitle len={word.length} key={word.length} />)
    }
    rows.push(<Word word={word} key={word} />)
    lastLength = word.length
  })

  return selectedWord ? (
    <div onClick={onClick}>
      <Definition word={selectedWord} />
    </div>
  ) : (
    <ul
      className="wordList"
      style={{ '--column-count': columns, '--width': columns * 10 + 'rem' }}
      onClick={onClick}
    >
      {rows}
    </ul>
  )
}

const LengthTitle = props => (
  <li className="wordList__title">
    <span className="wordList__titleText">
      {props.len} <span className="wordList__titleLetters">letters</span>
    </span>
  </li>
)

const Word = props => <li className="wordList__item">{props.word.toLowerCase()}</li>

export default WordList

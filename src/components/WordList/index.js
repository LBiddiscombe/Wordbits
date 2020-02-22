import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  if (selectedWord)
    return (
      <div onClick={onClick}>
        <Definition word={selectedWord} />
      </div>
    )

  return (
    <AnimatePresence>
      {rows.length > 0 && (
        <motion.ul
          className="wordList"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30, transition: { ease: 'easeOut', duration: 0.1 } }}
          style={{ '--column-count': columns, '--width': columns * 10 + 'rem' }}
          onClick={onClick}
        >
          {rows}
        </motion.ul>
      )}
    </AnimatePresence>
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

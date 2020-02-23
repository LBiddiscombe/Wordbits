import React, { useState, useEffect } from 'react'
import './App.css'
import './nprogress.css'
import WordList from '../WordList'
import TextInput from '../TextInput'
import { loadDictionary } from '../../modules/api'

const WILDCARD_CHAR = '.'
const USE_ALL_CHAR = '/'
const AS_WORD_START_CHAR = '*'
const MAX_WILDCARDS = 7

function App() {
  const [dictionary, setDictionary] = useState(null)
  const [letters, setLetters] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadDictionary().then(dictionary => setDictionary(dictionary))
  }, [])

  const onTextInputSubmit = letters => {
    const wildcardCount = (letters.match(/\./g) || []).length
    if (wildcardCount > MAX_WILDCARDS) {
      const error = `Max ${MAX_WILDCARDS} wildcards allowed`
      setError(error)
      return
    }

    const beginsWithCount = (letters.match(/\*/g) || []).length
    if (beginsWithCount > 1) {
      const error = `Only 1 begins with (${AS_WORD_START_CHAR}) wildcard allowed`
      setError(error)
      return
    }

    if (beginsWithCount === 1 && letters.length - wildcardCount - 1 <= 1) {
      const error = `At least 2 letters required for prefix search`
      setError(error)
      return
    }

    setLetters(letters)
    setError('')
  }

  let words = undefined
  let duration = 0
  const wildcardFound =
    letters.indexOf(WILDCARD_CHAR) !== -1 || letters.indexOf(AS_WORD_START_CHAR) !== -1
  const useAllLetters = letters.slice(-1) === USE_ALL_CHAR
  const asWordStart = letters.slice(-1) === AS_WORD_START_CHAR

  if (!error && dictionary && letters.length > 0) {
    const start = performance.now()

    if (wildcardFound) {
      //TODO: fails when something like "l.st*" is passed
      if (asWordStart) {
        words = dictionary.getWordsBeginning(letters, WILDCARD_CHAR)
      } else words = dictionary.getWordMatches(letters, WILDCARD_CHAR)
    } else {
      words = dictionary.getAnagrams(letters, useAllLetters ? letters.length - 1 : 3)
    }

    duration = Math.round(performance.now() - start)
  }

  let results = error
  if (!error) {
    results = words ? 'Found ' + words.length + ' results in ' + duration + 'ms' : ''
    if (useAllLetters) {
      results = results + ' using all letters'
    }
  }

  return (
    <div className="app">
      <div className="app__top">
        <h1 className="app__header">Wordbits</h1>
        <p className="app__hint">
          Try <span className="app__hint--bold">listen</span>,{' '}
          <span className="app__hint--bold">listen{AS_WORD_START_CHAR}</span>,{' '}
          <span className="app__hint--bold">listen{USE_ALL_CHAR}</span> or{' '}
          <span className="app__hint--bold">ha{WILDCARD_CHAR}e</span>
        </p>
        <TextInput handleSubmit={onTextInputSubmit} />
      </div>
      <p className="app__results">{results}</p>
      <WordList words={words} duration={duration} />
    </div>
  )
}

export default App

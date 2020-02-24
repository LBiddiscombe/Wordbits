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
  const [inputString, setInputString] = useState('')
  const [error, setError] = useState('')
  const [words, setWords] = useState(undefined)
  const [resultText, setResultText] = useState('')

  // on first render load the dictionary
  useEffect(() => {
    loadDictionary().then(dictionary => setDictionary(dictionary))
  }, [])

  const onTextInputSubmit = value => {
    const wildcardCount = (value.match(/\./g) || []).length
    if (wildcardCount > MAX_WILDCARDS) {
      setError(`Max ${MAX_WILDCARDS} wildcards allowed`)
      return
    }

    const beginsWithCount = (value.match(/\*/g) || []).length
    if (beginsWithCount > 1) {
      setError(`Only 1 begins with (${AS_WORD_START_CHAR}) wildcard allowed`)
      return
    }

    if (beginsWithCount === 1 && value.length - wildcardCount - 1 <= 1) {
      setError(`At least 2 letters required for prefix search`)
      return
    }

    setInputString(value)
    setError('')
  }

  // when inputString changes get the results from the dictionary
  useEffect(() => {
    let duration = 0
    let results = undefined
    const wildcardFound = inputString.indexOf(WILDCARD_CHAR) !== -1
    const useAllLetters = inputString.slice(-1) === USE_ALL_CHAR
    const asWordStart = inputString.slice(-1) === AS_WORD_START_CHAR

    if (!error && dictionary && inputString.length > 0) {
      const start = performance.now()
      if (asWordStart) {
        results = dictionary.getWordsBeginning(inputString, WILDCARD_CHAR)
        setWords(results)
      } else if (wildcardFound) {
        results = dictionary.getWordMatches(inputString, WILDCARD_CHAR)
        setWords(results)
      } else {
        results = dictionary.getAnagrams(inputString, useAllLetters ? inputString.length - 1 : 3)
        setWords(results)
      }
      duration = Math.round(performance.now() - start)
    } else {
      setWords(undefined)
    }

    if (!error) {
      let resultText = results ? 'Found ' + results.length + ' results in ' + duration + 'ms' : ''
      setResultText(resultText)
      if (useAllLetters) {
        setResultText(resultText + ' using all letters')
      }
    }
  }, [inputString])

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
        <TextInput handleSubmit={onTextInputSubmit} error={error} />
      </div>
      <p className="app__resulttext">{resultText}</p>
      <WordList words={words} />
    </div>
  )
}

export default App

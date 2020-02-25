import React, { useState, useEffect } from 'react'
import './App.css'
import './nprogress.css'
import WordList from '../WordList'
import TextInput from '../TextInput'
import { validateSearchString, executeSearch } from '../../modules/Dictionary'
import { loadDictionary } from '../../modules/api'

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
    const error = validateSearchString(value)
    setError(error)
    if (!error) setInputString(value)
  }

  // when inputString changes get the results from the dictionary
  useEffect(() => {
    const [words, resultText] = executeSearch(dictionary, inputString)
    setWords(words)
    setResultText(resultText)
  }, [inputString])

  return (
    <div className="app">
      <div className="app__top">
        <h1 className="app__header">Wordbits</h1>
        <p className="app__hint">
          Try <b>listen</b>, <b>listen*</b>, <b>listen/</b> or <b>ha.e</b>
        </p>
        <TextInput handleSubmit={onTextInputSubmit} error={error} />
      </div>
      <p className="app__resulttext">{resultText}</p>
      <WordList words={words} />
    </div>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import './App.css'
import NProgress from 'nprogress'
import './nprogress.css'
import WordList from '../WordList'
import TextInput from '../TextInput'
import { loadDictionary, validateSearchString, executeSearch } from '../../modules/Dictionary'
import api from '../../modules/api'

function App() {
  const [inputString, setInputString] = useState('')
  const [error, setError] = useState('')
  const [words, setWords] = useState(undefined)
  const [resultText, setResultText] = useState('')

  // on first render load the dictionary
  useEffect(() => {
    NProgress.start()
    api.getWords().then(words => {
      loadDictionary(words)
      NProgress.done()
    })
  }, [])

  const onTextInputSubmit = value => {
    const error = validateSearchString(value)
    setError(error)
    if (!error) setInputString(value)
  }

  // when inputString changes get the results from the dictionary
  useEffect(() => {
    const { results, resultText } = executeSearch(inputString)
    setWords(results)
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
      {words && <WordList words={words} />}
    </div>
  )
}

export default App

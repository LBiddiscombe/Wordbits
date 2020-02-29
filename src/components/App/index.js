import React, { useState, useEffect } from 'react'
import './App.css'
import NProgress from 'nprogress'
import './nprogress.css'
import WordList from '../WordList'
import TextInput from '../TextInput'
import { loadDictionary, searchDictionary } from '../../modules/Dictionary'
import api from '../../modules/api'

function App() {
  const [error, setError] = useState('')
  const [words, setWords] = useState([])
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
    if (value) setResultText('Searching...')
    setTimeout(() => {
      const { error, results, resultText } = searchDictionary(value)
      setError(error)
      setWords(results)
      setResultText(resultText)
    }, 0)
  }

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

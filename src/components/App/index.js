import React, { useState } from 'react'
import './App.css'
import NProgress from 'nprogress'
import './nprogress.css'
import WordList from '../WordList'
import TextInput from '../TextInput'
import api from '../../modules/api'

function App() {
  const [error, setError] = useState('')
  const [words, setWords] = useState([])
  const [resultText, setResultText] = useState('')

  const onTextInputSubmit = value => {
    if (!value) {
      setError('')
      setWords([])
      setResultText('')
      return
    }

    NProgress.start()
    setResultText('Searching...')
    api.searchDictionary(value).then(response => {
      const { error, results, resultText } = response
      setError(error)
      setWords(results)
      setResultText(resultText)
      NProgress.done()
    })
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

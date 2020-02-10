import React, { useReducer, useEffect } from 'react'
import NProgress from 'nprogress'
import './App.css'
import './nprogress.css'
import Trie from '../../modules/Dictionary'
import WordList from '../WordList'
import TextInput from '../TextInput'

const WILDCARD_CHAR = '.'
const USE_ALL_CHAR = '/'
const AS_WORD_START_CHAR = '*'
const MAX_WILDCARDS = 7

function App() {
  const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), {
    dictionary: null,
    letters: '',
    error: ''
  })

  useEffect(() => {
    NProgress.start()
    const APIKEY = `${process.env.REACT_APP_MLAB_APIKEY}`
    const url =
      'https://api.mlab.com/api/1/databases/wordbits/collections/words/5c263989fb6fc00eee87d369?apiKey=' +
      APIKEY
    fetch(url)
      .then(blob => blob.json())
      .then(data => {
        const words = data.words
        const dictionary = new Trie()
        words.forEach((word, index) => {
          dictionary.add(word)
          if (index % 1000 === 0) {
            NProgress.inc()
          }
        })
        setState({ dictionary })
        NProgress.done()
      })
  }, [])

  const onTextInputSubmit = letters => {
    const wildcardCount = (letters.match(/\./g) || []).length
    if (wildcardCount > MAX_WILDCARDS) {
      const error = `Max ${MAX_WILDCARDS} wildcards allowed`
      setState({ error })
    } else {
      setState({ letters, error: '' })
    }
  }

  const { dictionary, letters, error } = state
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
          <span className="app__hint--bold">listen{AS_WORD_START_CHAR}</span> or{' '}
          <span className="app__hint--bold">listen{USE_ALL_CHAR}</span>,{' '}
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

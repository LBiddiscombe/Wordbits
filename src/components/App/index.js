import React, { Component } from 'react'
import NProgress from 'nprogress'
import './App.css'
import './nprogress.css'
import Trie from '../../modules/Dictionary'
import WordList from '../WordList'
import TextInput from '../TextInput'

export default class App extends Component {
  state = {
    dictionary: null,
    letters: '',
    error: ''
  }

  onTextInputSubmit = letters => {
    const wildcardCount = (letters.match(/\?/g) || []).length
    if (wildcardCount > 3) {
      const error = 'Max 3 wildcards allowed'
      this.setState({ error })
    } else {
      this.setState({ letters, error: '' })
    }
  }

  componentDidMount() {
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
        this.setState({ dictionary })
        NProgress.done()
      })
  }

  render() {
    const { dictionary, letters, error } = this.state
    let words = undefined
    let duration = 0
    const wildcardFound = letters.indexOf('?') !== -1
    const useAllLetters = letters.slice(-1) === '/'

    if (!error && dictionary && letters.length > 0) {
      const start = performance.now()

      words = wildcardFound
        ? dictionary.getWordMatches(letters, '?')
        : dictionary.getAnagrams(letters, useAllLetters ? letters.length - 1 : 3)
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
            Try <span className="app__hint--bold">listen</span> or{' '}
            <span className="app__hint--bold">listen/</span> or{' '}
            <span className="app__hint--bold">ha?e</span>
          </p>
          <TextInput handleSubmit={this.onTextInputSubmit} />
        </div>
        <p className="app__results">{results}</p>
        <WordList words={words} duration={duration} />
      </div>
    )
  }
}

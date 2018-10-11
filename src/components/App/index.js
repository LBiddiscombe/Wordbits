import React, { Component } from 'react'
import './App.css'
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
    const gist = '22219d5aca00191c82a17ae84a206a69'
    const filename = 'wordList.json'
    const url = 'https://api.github.com/gists/' + gist
    fetch(url)
      .then(blob => blob.json())
      .then(data => {
        const words = JSON.parse(data.files[filename].content)
        const dictionary = new Trie()
        words.forEach(word => dictionary.add(word))
        this.setState({ dictionary })
      })
  }

  render() {
    const { dictionary, letters, error } = this.state
    let words = null
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
        <h1 className="app__header">Wordbits</h1>
        <p className="app__hint">
          Try <span className="app__hint--bold">listen</span> or{' '}
          <span className="app__hint--bold">listen/</span> or{' '}
          <span className="app__hint--bold">ha?e</span>
        </p>
        <TextInput handleSubmit={this.onTextInputSubmit} />
        <p className="app__results">{results}</p>
        <WordList words={words} duration={duration} />
      </div>
    )
  }
}

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
    const wildcardCount = (letters.match(/\./g) || []).length
    if (wildcardCount > 3) {
      const error = 'Max 3 wildcards allowed'
      this.setState({ error })
    } else {
      const error = ''
      this.setState({ letters, error })
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

    if (!error && dictionary && letters.length > 0) {
      const start = performance.now()
      const wildcardFound = letters.indexOf('.') !== -1
      words = wildcardFound
        ? dictionary.getWordMatches(letters)
        : dictionary.getAnagrams(letters, 3)
      duration = Math.round(performance.now() - start)
    }

    return (
      <div className="app">
        <h1 className="app__header">Wordbits</h1>
        <p className="app__hint">Try searching 'SOMETHING' or 'HA.E'</p>
        <TextInput handleSubmit={this.onTextInputSubmit} />
        {!error &&
          words && (
            <p className="app__results">
              Found {words.length} results in {duration}
              ms
            </p>
          )}
        {error && <p className="app__results">{error}</p>}
        <WordList words={words} duration={duration} />
      </div>
    )
  }
}

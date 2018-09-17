import React, { Component } from 'react'
import './App.css'
import Trie from '../../modules/Dictionary'
import WordList from '../WordList'
import TextInput from '../TextInput'

export default class App extends Component {
  state = {
    dictionary: null,
    letters: ''
  }

  onTextInputSubmit = letters => {
    this.setState({ letters })
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
    const { dictionary, letters } = this.state
    let words = []

    if (dictionary) {
      const wildcardFound = letters.indexOf('.') !== -1
      words = wildcardFound
        ? dictionary.getWordMatches(letters)
        : dictionary.getAnagrams(letters, 3)
    }

    return (
      <div className="app">
        <p className="hint">Try searching 'HELLO' or 'HA.E'</p>
        <TextInput handleSubmit={this.onTextInputSubmit} />
        <WordList words={words} />
      </div>
    )
  }
}

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
    const anagrams = dictionary ? dictionary.getAnagrams(letters, 3) : []

    return (
      <div className="app">
        <TextInput handleSubmit={this.onTextInputSubmit} />
        <WordList words={anagrams} />
      </div>
    )
  }
}

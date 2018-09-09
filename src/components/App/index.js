import React, { Component } from 'react'
import './App.css'
import Trie from '../../modules/Dictionary'
import WordList from '../WordList'
import Word from '../Word'

export default class App extends Component {
  state = {
    dictionary: null,
    letters: 'monopoly'
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

    return (
      <div className="app">
        <header className="app-header">
          <Word word={letters} wordIndex={0} />
        </header>
        <WordList dictionary={dictionary} letters={letters} />
      </div>
    )
  }
}

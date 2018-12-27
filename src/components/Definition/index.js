import React, { Component } from 'react'
import './Definition.css'

export default class Definition extends Component {
  state = { definition: null }

  componentDidMount() {
    fetch('https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + this.props.word + '&lang=en')
      .then(blob => blob.json())
      .then(data => {
        this.setState({ definition: data })
      })
  }

  render() {
    const { definition } = this.state
    const types = definition && Object.keys(definition[0].meaning)
    const meanings = definition && definition[0].meaning
    const word = (definition && definition[0].word) || this.props.word
    const phonetic = definition && definition[0].phonetic

    let results = <p className="definition__loading">Loading...</p>
    if (definition) {
      results = types.map(type => {
        return (
          <div key={type}>
            {type !== 'crossReference' && <h3 className="definition__type">{type}</h3>}
            <ol>
              {meanings[type].map((meaning, i) => (
                <li className="definition__meaning" key={type + i}>
                  {meaning.definition}
                </li>
              ))}
            </ol>
          </div>
        )
      })
    }

    return (
      <div className="definition">
        <h1>
          {word}
          <span className="definition__phonetic">{phonetic}</span>
        </h1>
        {results}
      </div>
    )
  }
}

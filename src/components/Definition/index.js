import React, { Component } from 'react'
import './Definition.css'

export default class Definition extends Component {
  _isMounted = false
  state = {
    word: this.props.word,
    phontetic: '',
    definitions: null
  }

  componentDidMount() {
    this._isMounted = true
    fetch('https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + this.props.word + '&lang=en')
      .then(blob => blob.json())
      .then(data => {
        if (this._isMounted) {
          const { word, phonetic } = data[0]
          const meanings = data.map(defn => defn.meaning)
          const definitions = mergeMeanings(meanings)
          this.setState({
            word,
            phonetic,
            definitions
          })
        }
      })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { word, phonetic, definitions } = this.state

    let results = []
    if (definitions) {
      definitions.forEach((value, key) => {
        results.push(
          <div key={key}>
            {key !== 'crossReference' && <h3 className="definition__type">{key}</h3>}
            <ol>
              {value.map((meaning, i) => (
                <li className="definition__meaning" key={key + i}>
                  {meaning}
                </li>
              ))}
            </ol>
          </div>
        )
      })
    } else results = <p className="definition__loading">Loading...</p>

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

function mergeMeanings(meanings) {
  const mergedMeanings = new Map()
  meanings.forEach(response => {
    Object.keys(response).forEach(key => {
      if (mergedMeanings.has(key))
        mergedMeanings.set(
          key,
          mergedMeanings.get(key).concat(response[key].map(obj => obj.definition))
        )
      else mergedMeanings.set(key, response[key].map(obj => obj.definition))
    })
  })
  return mergedMeanings
}

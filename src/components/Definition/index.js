import React, { useReducer, useEffect } from 'react'
import './Definition.css'

function Definition(props) {
  const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), {
    word: props.word,
    phontetic: '',
    definitions: null
  })

  useEffect(() => {
    fetch('https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + props.word + '&lang=en')
      .then(blob => blob.json())
      .then(data => {
        const { word, phonetic, meaning } = data[0]
        const definitions = mergeMeanings(meaning)
        setState({
          word,
          phonetic,
          definitions
        })
      })
      .catch(e => {
        console.log(e)
        setState({
          definitions: new Map([['Error', ['No Definition Found']]])
        })
      })
  }, [])

  const { word, phonetic, definitions } = state

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

function mergeMeanings(meanings) {
  const mergedMeanings = new Map()
  Object.keys(meanings).forEach(key => {
    if (mergedMeanings.has(key))
      mergedMeanings.set(
        key,
        mergedMeanings.get(key).concat(meanings[key].map(obj => obj.definition))
      )
    else mergedMeanings.set(key, meanings[key].map(obj => obj.definition))
  })
  return mergedMeanings
}

export default Definition

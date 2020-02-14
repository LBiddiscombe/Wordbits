import React, { useReducer, useEffect } from 'react'
import { getDefinition } from '../../modules/api'
import './Definition.css'

function Definition(props) {
  const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), {
    word: props.word,
    phontetic: '',
    definitions: null
  })

  useEffect(() => {
    getDefinition(props.word)
      .then(({ word, phonetic, definitions }) =>
        setState({
          word,
          phonetic,
          definitions
        })
      )
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

export default Definition

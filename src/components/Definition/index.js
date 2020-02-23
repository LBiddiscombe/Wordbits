import React, { useState, useEffect } from 'react'
import { getDefinition } from '../../modules/api'
import './Definition.css'

function Definition(props) {
  const [word, setWord] = useState(props.word)
  const [phonetic, setPhonetic] = useState('')
  const [definitions, setDefinitions] = useState(null)

  useEffect(() => {
    getDefinition(props.word)
      .then(({ word, phonetic, definitions }) => {
        setWord(word)
        setPhonetic(phonetic)
        setDefinitions(definitions)
      })
      .catch(e => {
        console.log(e)
        setDefinitions(new Map([['Error', ['No Definition Found']]]))
      })
  }, [])

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

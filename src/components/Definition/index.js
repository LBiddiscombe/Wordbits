import React, { Component } from 'react'
import './Definition.css'

export default class Definition extends Component {
  render() {
    const { definition } = this.props
    const types = Object.keys(definition[0].meaning)
    const meanings = definition[0].meaning

    const result = types.map(type => {
      return (
        <div key={type}>
          <h3>
            <em>{type}</em>
          </h3>
          <p>{meanings[type][0].definition}</p>
        </div>
      )
    })
    return (
      <div className="Definition">
        <h1>{definition[0].word}</h1>
        {result}
      </div>
    )
  }
}

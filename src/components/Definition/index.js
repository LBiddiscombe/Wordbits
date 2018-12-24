import React, { Component } from 'react'
import './Definition.css'

export default class Definition extends Component {
  render() {
    return <pre className="Definition">{this.props.children}</pre>
  }
}

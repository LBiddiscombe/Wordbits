import React, { Component } from 'react'
import './TextInput.css'

export default class TextInput extends Component {
  state = {
    letters: ''
  }

  saveToState = e => {
    const { name, value } = e.target
    this.setState({ [name]: value.toUpperCase() })
  }

  onSubmit = e => {
    e.preventDefault()
    const { handleSubmit } = this.props
    handleSubmit(this.state.letters)
  }

  render() {
    return (
      <form
        className="text-input-form"
        onSubmit={this.onSubmit}
        autocomplete="off"
      >
        <input
          className="text-input"
          name="letters"
          onChange={this.saveToState}
          value={this.state.letters}
          autoFocus
        />
        <button type="submit" className="submit-button">
          GO
        </button>
      </form>
    )
  }
}

import React, { Component } from 'react'
import './TextInput.css'

export default class textInputForm extends Component {
  state = {
    letters: ''
  }

  saveToState = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
    if (value === '') {
      const { handleSubmit } = this.props
      handleSubmit('')
    }
  }

  onSubmit = e => {
    e.preventDefault()
    const { handleSubmit } = this.props
    handleSubmit(this.state.letters)
    window.scrollTo(0, 0)
    document.getElementById('letters').blur()
  }

  onReset = e => {
    e.preventDefault()
    this.setState({ letters: '' })
    const { handleSubmit } = this.props
    handleSubmit('')
    document.getElementById('letters').focus()
    window.scrollTo(0, 0)
  }

  render() {
    const { letters } = this.state
    return (
      <form className="textInputForm" onSubmit={this.onSubmit} autoComplete="off">
        <input
          className="textInputForm__input"
          name="letters"
          id="letters"
          onChange={this.saveToState}
          value={this.state.letters}
          maxLength="11"
          autoFocus
        />
        {letters && (
          <button type="reset" className="textInputForm__reset" onClick={this.onReset}>
            <i className="fas fa-times-circle" />
          </button>
        )}
        <button type="submit" className="textInputForm__submit">
          GO
        </button>
      </form>
    )
  }
}

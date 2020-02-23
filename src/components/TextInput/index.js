import React, { useState } from 'react'
import './TextInput.css'

function TextInput({ handleSubmit }) {
  const [letters, setLetters] = useState('')

  const saveToState = e => {
    const { value } = e.target
    setLetters(value)
    handleSubmit('')
  }

  const onSubmit = e => {
    e.preventDefault()
    handleSubmit(letters)
    window.scrollTo(0, 0)
    document.getElementById('letters').blur()
  }

  const onReset = e => {
    e.preventDefault()
    setLetters('')
    handleSubmit('')
    document.getElementById('letters').focus()
    window.scrollTo(0, 0)
  }

  return (
    <form className="textInputForm" onSubmit={onSubmit} autoComplete="off">
      <input
        className="textInputForm__input"
        name="letters"
        id="letters"
        onChange={saveToState}
        value={letters}
        maxLength="15"
        autoFocus
        autoComplete="off"
      />
      {letters && (
        <button type="reset" className="textInputForm__reset" onClick={onReset}>
          <i className="fas fa-times-circle" />
        </button>
      )}
      <button type="submit" className="textInputForm__submit">
        GO
      </button>
    </form>
  )
}

export default TextInput

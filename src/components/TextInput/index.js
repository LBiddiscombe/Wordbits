import React, { useReducer } from 'react'
import './TextInput.css'

function TextInput({ handleSubmit }) {
  const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), {
    letters: ''
  })

  const saveToState = e => {
    const { name, value } = e.target
    setState({ [name]: value })
    handleSubmit('')
  }

  const onSubmit = e => {
    e.preventDefault()
    handleSubmit(state.letters)
    window.scrollTo(0, 0)
    document.getElementById('letters').blur()
  }

  const onReset = e => {
    e.preventDefault()
    setState({ letters: '' })
    handleSubmit('')
    document.getElementById('letters').focus()
    window.scrollTo(0, 0)
  }

  const { letters } = state
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

import React, { Component } from 'react'
import InputField from '../InputField/InputField.js'
import PropTypes from 'prop-types'

function Todo(props) {
  const { onRemove, inputValue, classes, inputName, onComplete, completed } = props,
    completeClass = completed ? 'completed' : ''
  return <div className={ classes + ' ' + completeClass }>
    <span className="input-group-addon no-border no-bg">
      <input 
        type="checkbox" 
        aria-label="" 
        onChange={ onComplete } 
        name={ `check-${ inputName }`} 
        value={ inputName }
        checked={ completed }
      />
    </span>  
    <InputField 
      inputValue={ inputValue }
      htmlType="text" 
      classes="form-control no-border no-focus font-weight-100 font-size-lg" 
      name={ inputName }
      onChange={ () => {} }
      disabled={ completed }
    />      
    <span className="input-group-btn">      
      <button 
        type="button"
        className="close no-focus"
        aria-label="Close"
        onClick={ onRemove }>
        <span aria-hidden="true">&times;</span>
      </button>  
    </span>          
  </div>
}

export default Todo


import React, { Component } from 'react'
import PropTypes from 'prop-types'

function InputField(props) {
  const { onSubmit, onChange, inputValue, placeHolder, classes, htmlType, name, disabled } = props
  return <input 
    type={ htmlType } 
    onKeyPress={ onSubmit }
    onChange={ onChange }
    value={ inputValue }
    className={ classes }
    placeholder={ placeHolder }
    name={ name }
    disabled={ disabled }
  />
}

InputField.propTypes = {
  classes: PropTypes.string,
  disabled: PropTypes.bool,
  htmlType: PropTypes.string.isRequired,
  inputValue: PropTypes.string,
  placeHolder: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func
}

InputField.defaultProps = {
  htmlType: 'text'
}
 export default InputField

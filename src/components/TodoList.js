import React, { Component } from 'react'
import InputField from './InputField.js'
import Todo from './Todo.js'
import PropTypes from 'prop-types'

function TodoList(props) {
  const { todos, itemClasses, listClasses, onRemove, onComplete, completed } = props
  
  let todoList = todos
    .map(function(item, index) {
      //console.log(item.key)
      return <Todo 
        key={ item.key }
        classes={ itemClasses }
        value={ item.text }
        inputName={ item.key }
        onRemove={ () => onRemove(item.key) }
        onComplete={ onComplete }
        completed={ item.completed }
      />   
    })

  return <div className={ listClasses }>
    { todoList } 
  </div>  
}

export default TodoList
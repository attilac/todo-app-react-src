import React, { Component } from 'react'
import InputField from './InputField.js'
import Todo from './Todo.js'
import PropTypes from 'prop-types'

function TodoList(props) {
  const { todos, itemClasses, listClasses, onRemove, onComplete, completed } = props
  /*
  let todoList = todos
  .map(function(item, index) {
    //console.log(item.value.text)
    return <Todo 
      key={ item.key }
      classes={ itemClasses }
      inputValue={ item.value.text }
      inputName={ item.key }
      onRemove={ () => onRemove(item) }
      onComplete={ onComplete }
      completed={ item.value.completed }
    />   
  })*/

  let todoList = Object.keys(todos)
    .map(function(item, index) {
      //console.log(item.value.text)
      return <Todo 
        key={ item }
        classes={ itemClasses }
        inputValue={ todos[item].text }
        inputName={ item }
        onRemove={ () => onRemove(item) }
        onComplete={ onComplete }
        completed={ todos[item].completed }
      />   
    })

  return <div className={ listClasses }>
    { todoList } 
  </div>  
}

export default TodoList
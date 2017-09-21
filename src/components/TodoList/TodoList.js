import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import Todo from '../Todo/Todo.js'
import PropTypes from 'prop-types'
import './TodoList.css'

function TodoList(props) {
  const { todos, itemClasses, listClasses, onRemove, onComplete, completed } = props
  
  let todoList = todos
    .map(function(item, index) {
      //console.log(item.key)
      return (
        <Todo 
          key={ item.key }
          classes={ itemClasses }
          inputValue={ item.text }
          inputName={ item.key }
          onRemove={ () => onRemove(item.key) }
          onComplete={ onComplete }
          completed={ item.completed }
        /> 
      )    
    })

  return (
    todoList &&
    <div className={ listClasses }>
      <CSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >         
        { todoList } 
      </CSSTransitionGroup>    
    </div> 
  )   
}

export default TodoList
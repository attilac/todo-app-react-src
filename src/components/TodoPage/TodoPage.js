import React from 'react'
import InputField from '../InputField/InputField'
import TodoList from '../TodoList/TodoList.js'

function TodoPage(props) {
  const { todoText, todoOnChange, postTodo, removeTodo, onCheckedCompleted, todos, onKeyPress } = props
  return (  
    <div className="TodoPage">
      <div className="row">
        <div className="col-lg-8 push-lg-2">    
          <div className="input-group add-todo mb-3">
            <InputField 
              htmlType="text" 
              inputValue={ todoText }
              classes="form-control font-weight-100 font-size-lg "
              onChange={ todoOnChange }
              onKeyPress={ onKeyPress }
              name="todoText" 
              placeHolder="Enter todo here"
              disabled={ false }
            /> 
            <span className="input-group-btn">
              <button className="btn btn-info px-4" type="button" onClick={ postTodo }>Add</button>
            </span>
          </div>
          {
            todos &&
            <TodoList 
              todos={ todos }
              listClasses="list-group todo-list input-group"
              itemClasses="list-group-item"
              onRemove={ removeTodo } 
              onComplete={ onCheckedCompleted } 
            />                              
          }  
        </div>  
      </div> 
    </div> 
  )
}

export default TodoPage
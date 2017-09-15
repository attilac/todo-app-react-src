import React, { Component } from 'react'
import InputField from './components/InputField'
import Todo from './components/Todo.js'
import TodoList from './components/TodoList.js'
import './App.css'
import firebase from './firebase.js'
import utils from './scripts/utils.js'

class App extends Component {

  state = {
    todos: [],
    todoInput: ''
  }

  componentDidMount() {
    console.log('Did mount')
    /*   
    firebase.database()
      .ref('todos')
      .orderByChild('date')
      .limitToLast(10)
      .once('value', (snapshot) => {
        //console.log(snapshot.val())  
        //this.setState({ todos: sortedList })
        console.log('Fetched todos!')
      }) 
    */

    this.childAdded()
    this.childChanged()  
    this.childRemoved()           
  }   

  childAdded = () => {
    firebase.database()
      .ref('todos')
      .orderByChild('date')
      .limitToLast(10)      
      .on('child_added', (snapshot) => {
        let todos = [...this.state.todos]
        const todo = snapshot.val()
        todo['key'] = snapshot.key   
        todos.push(todo)
        //console.log(todos)
        console.log('Added todo!')
        this.setState({ todos: todos })   
      })
  }

  childChanged = () => {
    firebase.database()
      .ref('todos')
      .on('child_changed', (snapshot) => {
        let todos = this.state.todos
          .map( (todo) => {
            return todo.key === snapshot.key ?
              Object.assign(todo, todo, snapshot.val())
              :
              todo    
          }) 
        //console.log(todos)      
        console.log('Updated todo!')
        this.setState({ todos: todos })       
      })     
  }   

  childRemoved = () => {
    firebase.database()
      .ref('todos')
      .on('child_removed', (snapshot) => {
        //console.log(snapshot.key)
        let todos = [...this.state.todos]
          .filter( (todo) => {
            return todo.key !== snapshot.key    
          })
        console.log('Removed todo')
        this.setState({ todos: todos })
      }) 
  } 

  createUser = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => console.log(error)) 
  }

  loginUser = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => console.log(error)) 
  }  

  updateCompletedTodo = (id, value) => {
    firebase.database()
      .ref(`/todos/${id}`)
      .update({ completed: value })
  }

  removeTodo = (id) => {
    firebase.database()
      .ref(`todos/${id}`)
      .remove()    
  }

  todoOnChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value})    
  }  

  todoOnComplete = (event) => {
    const { name, checked, value } = event.target
    //console.log(checked)
    this.updateCompletedTodo(value, checked)
  }  

  postTodo = () => {
    const { todoInput } = this.state
    if (todoInput !== '') {
      const todo = {
        text: todoInput,
        completed: false,
        date: (new Date()).toLocaleString()
      }   
      this.setState({ todoInput: '' })

      firebase.database()
        .ref('todos')
        .push(todo)
        .then( () => {
          console.log('Pushed a new todo') 
        }) 
        .catch(error => { 
          console.log('There was an error', error) 
        })                
    }    
  }   

  render() {
    const { todos, todoText } = this.state
    const todosSorted = utils.sortObjectsByKey(todos, 'date', 'DESC')
    //console.log(todosSorted)
 
    return (
      <div className="App">
        <nav className="navbar navbar-inverse bg-red">
          <a className="navbar-brand" href="#">Todo List</a>
        </nav>

        <div className="container pt-3">
          <div className="row">
            <div className="col-lg-8 push-lg-2">
              <div className="input-group add-todo mb-3">
                <InputField 
                  value={ todoText }
                  htmlType="text" 
                  classes="form-control"
                  onChange={ this.todoOnChange }
                  name="todoInput" 
                  placeHolder="Enter todo here"
                /> 
                <span className="input-group-btn">
                  <button className="btn btn-info px-4" type="button" onClick={ this.postTodo }>Add</button>
                </span>
              </div>
              {
                todos &&
                <TodoList 
                  todos={ todosSorted }
                  listClasses="list-group todo-list input-group"
                  itemClasses="list-group-item"
                  onRemove={ this.removeTodo } 
                  onComplete={ this.todoOnComplete } 
                />                              
              }  
            </div>  
          </div>  
        </div>
      </div>
    )
  }
}

export default App

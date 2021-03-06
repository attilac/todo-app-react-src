import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'
import firebase from './firebase.js'
import { Navbar } from 'reactstrap'
// Components

import LoginForm from './components/LoginForm/LoginForm'
import LoginPage from './components/LoginPage/LoginPage'
import PrivateRoute from './components/PrivateRoute/PrivateRoute.js'
import Spinner from './components/Spinner/Spinner.js'
import TodoPage from './components/TodoPage/TodoPage.js'
import UserDropdown from './components/UserDropdown/UserDropdown.js'
// Scripts
import utils from './scripts/utils.js'
// CSS
import './fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import './App.css'

class App extends Component {

  state = {
    errorMessage: '',
    collapsed: true,
    todos: [],
    todoText: '',
    user: undefined,
    username: ''    
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

    firebase
      .auth()
      .onAuthStateChanged(user => {
        if(user) {
          //const displayName = user.displayName;
          const email = user.email
          //const emailVerified = user.emailVerified;
          //const photoURL = user.photoURL;
          //const uid = user.uid; //KEY! UID!         
          this.setState({ 
            user: user,
            username: email
          })
          console.log(user)
        } else {
          this.setState({ 
            user: user,
            username: ''
          })          
        }
      })    

    this.childAdded()
    this.childChanged()  
    this.childRemoved()           
  }  

  componentWillUnmount() {
    firebase.database()
      .ref('todos')
      .off()  

    firebase
      .auth()
      .unsubscribeAuthStateChanged()        
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
              Object.assign(todo, snapshot.val())
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

  logOutUser = () => {
    firebase
      .auth()
      .signOut()
      .catch(error => {
        console.log(error)
      }) 
  }   

  onFormSubmit = (username, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .catch(error => {
        const errorMessage = error.message
        //const errorCode = error.code
        this.setState({ errorMessage: errorMessage})
        console.log(errorMessage)
      }) 
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

  onCheckedCompleted = (event) => {
    const { checked, value } = event.target
    //console.log(checked)
    this.updateCompletedTodo(value, checked)
  }  

  postTodo = () => {
    const { todoText } = this.state
    if (todoText !== '') {
      const todo = {
        text: todoText,
        completed: false,
        date: (new Date()).toLocaleString()
      }   
      this.setState({ todoText: '' })

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

  todoOnEnter = (event) => {
    if(event.key === 'Enter') {
      this.postTodo() 
    }
  } 

  toggleNavbar = () => {
    this.setState({ collapsed: !this.state.collapsed })
  } 

  render() {
    const { todos, todoText, user, username, errorMessage } = this.state
    utils.sortObjectsByKey(todos, 'date', 'DESC')
    //console.log(todosSorted)
 
    return (
      <Router basename="/todo-app-react"> 
        <div className="App">

          <Navbar 
            color="red" 
            inverse 
            toggleable
            className="flex-row"
          >
            <Link className="navbar-brand" to="/">Todo List</Link>
            <div className="mr-auto"></div>
            <UserDropdown 
              user={ user }
              username={ username }
              logOutUser={ this.logOutUser }
            />          
          </Navbar>

          <div className="container pt-3">
            {
              user === undefined ?
                <Spinner />
                :                 
                <Switch>

                  <Route path='/login' render={({ match }) => (
                    user ? (
                      <Redirect to="/"/>
                    ) : (
                      <LoginPage >
                        <LoginForm 
                          submitBtnLabel="Log in" 
                          errorMessage={ errorMessage }
                          onFormSubmit={ this.onFormSubmit } 
                          user={ user }
                        />
                      </LoginPage> 
                    )
                  )}/>   

                  <PrivateRoute
                    exact 
                    path="/"
                    component={ TodoPage }
                    todos={ todos }
                    todoOnChange={ this.todoOnChange }
                    onKeyPress={ this.todoOnEnter }
                    onCheckedCompleted={ this.onCheckedCompleted }
                    removeTodo={ this.removeTodo }
                    postTodo={ this.postTodo }
                    todoText={ todoText }
                    user={ user }
                  />  
                </Switch>   
            }
          </div>
              
        </div>
      </Router>  
    )
  }
}

export default App

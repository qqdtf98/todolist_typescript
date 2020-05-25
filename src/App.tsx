import './App.css'

import { Link, Route, BrowserRouter as Router } from 'react-router-dom'

import Main from 'src/pages/main'
import React from 'react'
import TodoPage from 'src/pages/TodoPage'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Main} />
        <Route path="/todo/:userId" component={TodoPage} />
      </Router>
    </div>
  )
}

export default App

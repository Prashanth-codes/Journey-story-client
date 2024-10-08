import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Root />} />
          <Route path='/dashboard' exact element={<Home />}/>
          <Route path='/login' exact element={<Login />}/>
          <Route path='/signUp' exact element={<SignUp />}/>
        </Routes>
      </Router>
    </div>
  )
}

// define the root compononet to handle the initial redirect

const Root = () => {
  //check if exists in localstorage

  const isAuthenticated = !!localStorage.getItem("token");

  //redirecct to dahsboard if authenticated,otherwise to login

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ):(
    <Navigate to="/login" />
  )
}

export default App

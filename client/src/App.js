import './App.css';
import {Fragment} from 'react'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import Login from './components/layout/Login'
import Register from './components/layout/Register'


function App() {
  return (
    <Router>
    <Fragment>
      <Navbar/>
      <Route exact path="/"  component={Landing}></Route>
      <section className="container">
        <Switch>
      <Route exact path="/login"  component={Login}></Route>
      <Route exact path="/register"  component={Register}></Route>
        </Switch>
      </section>
    </Fragment>
    </Router>
    
  );
}

export default App;

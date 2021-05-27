import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Router } from 'react-router';
import { Switch, Route, Link } from "react-router-dom";
import history from "./history";

import LoginForm from "./components/login.component";
import SignUpForm from "./components/signup.component";
import ResetForm from "./components/reset.component";
import Welcome from "./components/welcome.component";
import Success from "./components/success.component";
import Forgot from "./components/forgot.component";

import logo from "./assets/logo for website.png";

function App() {

  return (<Router history={history}>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
         <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <Link className="navbar-brand" to="/sign-in"><img className="photo" src = {logo} alt="logo" /></Link>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/sign-in">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sign-up">Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner">
            <Switch>
              <Route exact path="/"><LoginForm /></Route>
              <Route exact path="/sign-in"><LoginForm /></Route>
              <Route exact path="/sign-up"><SignUpForm /></Route>
              <Route exact path="/reset-password"><ResetForm /></Route>
              <Route exact path="/welcome" render={props=>(
                <Welcome {...props} />)}
              />
              <Route exact path="/success"><Success /></Route>
              <Route exact path="/forgot"><Forgot /></Route>
            </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;
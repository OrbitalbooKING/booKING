import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Router } from 'react-router';
import { Switch, Route, Link } from "react-router-dom";
import history from "./history";

import LoginForm from "./components/login.component";
import LoginSuccess from "./components/login success.component";
import SignUpForm from "./components/sign up.component";
import SignUpSuccess from "./components/sign up success.component";
import ResetForm from "./components/reset.component";
import ResetSuccess from "./components/reset success.component";

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
              <Route exact path="/sign-in-success" render={props=>(
                <LoginSuccess {...props} />)}
              />
              <Route exact path="/sign-up-success"><SignUpSuccess /></Route>
              <Route exact path="/reset-password-success"><ResetSuccess /></Route>
            </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;
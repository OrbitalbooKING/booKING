import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Router } from 'react-router';
import { Switch, Route } from "react-router-dom";
import history from "./history";

import Help from "./components/Help";
import HelpLoggedIn from "./components/HelpLoggedIn";
import LoginForm from "./components/Login";
import LoginSuccess from "./components/LoginSuccess";
import SignUpForm from "./components/SignUp";
import SignUpSuccess from "./components/SignUpSuccess";
import ResetForm from "./components/Reset";
import ResetSuccess from "./components/ResetSuccess";
import Home from "./components/Home";
import Booking from "./components/Booking";
import BookingOverview from "./components/BookingOverview";
import BookingSuccess from "./components/BookingSuccess";
import LogoutSuccess from "./components/LogoutSuccess";
import Profile from "./components/Profile";

function App() {

  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route exact path="/"><LoginForm /></Route>
          <Route exact path="/help"><Help /></Route>
          <Route exact path="/help-logged-in" render={props=>(
            <HelpLoggedIn {...props} />)}
          />
          <Route exact path="/sign-in"><LoginForm /></Route>
          <Route exact path="/sign-up"><SignUpForm /></Route>
          <Route exact path="/reset-password"><ResetForm /></Route>
          <Route exact path="/sign-in-success" render={props=>(
            <LoginSuccess {...props} />)}
          />
          <Route exact path="/sign-up-success" render={props=>(
            <SignUpSuccess {...props} />)}
          />
          <Route exact path="/reset-password-success" render={props=>(
            <ResetSuccess {...props} />)}
          />
          <Route exact path="/home" render={props=>(
            <Home {...props} />)}
          />
          <Route exact path="/booking" render={props=>(
            <Booking {...props} />)}
          />
          <Route exact path="/booking-overview" render={props=>(
            <BookingOverview {...props} />)}
          />
          <Route exact path="/booking-success" render={props=>(
            <BookingSuccess {...props} />)}
          />
          <Route exact path="/logout" render={props=>(
            <LogoutSuccess {...props} />)}
          />
          <Route exact path="/profile" render={props=>(
            <Profile {...props} />)}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
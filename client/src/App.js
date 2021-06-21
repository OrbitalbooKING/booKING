// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
// import { Router } from 'react-router';
// import { Switch, Route, Link } from "react-router-dom";
// import history from "./history";

// import LoginForm from "./components/Login";
// import LoginSuccess from "./components/LoginSuccess";
// import SignUpForm from "./components/SignUp";
// import SignUpSuccess from "./components/SignUpSuccess";
// import ResetForm from "./components/Reset";
// import ResetSuccess from "./components/ResetSuccess";

// import logo from "./assets/logo for website.png";

// function App() {

//   return (<Router history={history}>
//     <div className="App">
//       <nav className="navbar navbar-expand-lg navbar-light fixed-top">
//         <div className="container">
//          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
//           <Link className="navbar-brand" to="/sign-in"><img className="photo" src = {logo} alt="logo" /></Link>
//             <ul className="navbar-nav ml-auto">
//               <li className="nav-item">
//                 <Link className="nav-link" to="/sign-in">Login</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/sign-up">Sign up</Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       <div className="auth-wrapper">
//         <div className="auth-inner">
//             <Switch>
//               <Route exact path="/"><LoginForm /></Route>
//               <Route exact path="/sign-in"><LoginForm /></Route>
//               <Route exact path="/sign-up"><SignUpForm /></Route>
//               <Route exact path="/reset-password"><ResetForm /></Route>
//               <Route exact path="/sign-in-success" render={props=>(
//                 <LoginSuccess {...props} />)}
//               />
//               <Route exact path="/sign-up-success"><SignUpSuccess /></Route>
//               <Route exact path="/reset-password-success"><ResetSuccess /></Route>
//             </Switch>
//         </div>
//       </div>
//     </div></Router>
//   );
// }

// export default App;

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Router } from 'react-router';
import { Switch, Route } from "react-router-dom";
import history from "./history";

import Help from "./components/Help";
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

  return (<Router history={history}>
    <div className="App">
      {/* <div className="auth-wrapper">
        <div className="auth-inner"> */}
            <Switch>
              <Route exact path="/"><LoginForm /></Route>
              <Route exact path="/help"><Help /></Route>
              <Route exact path="/sign-in"><LoginForm /></Route>
              <Route exact path="/sign-up"><SignUpForm /></Route>
              <Route exact path="/reset-password"><ResetForm /></Route>
              <Route exact path="/sign-in-success" render={props=>(
                <LoginSuccess {...props} />)}
              />
              <Route exact path="/sign-up-success"><SignUpSuccess /></Route>
              <Route exact path="/reset-password-success"><ResetSuccess /></Route>
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
        {/* </div>
      </div> */}
    </div></Router>
  );
}

export default App;
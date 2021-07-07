import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

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

import HelpStaff from "./components/HelpStaff";
import StaffLoginSuccess from "./components/StaffLoginSuccess";
import StaffHome from "./components/StaffHome";
import StaffVenues from "./components/StaffVenues";
import StaffProfile from "./components/StaffProfile";
import ApprovalOverview from "./components/ApprovalOverview"
import ApprovalSuccess from "./components/ApprovalSuccess";
import ErrorPage from "./components/ErrorPage";

function App() {

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/"><LoginForm /></Route>
          <Route exact path="/help"><Help /></Route>
          <Route exact path="/help-logged-in"><HelpLoggedIn /></Route>
          <Route exact path="/sign-in"><LoginForm /></Route>
          <Route exact path="/sign-up"><SignUpForm /></Route>
          <Route exact path="/reset-password"><ResetForm /></Route>
          {/* <Route exact path="/sign-in-success"><LoginSuccess /></Route> */}
          <Route exact path="/sign-in-success" render={props=>(
            <LoginSuccess {...props} />)}
          />
          <Route exact path="/sign-up-success" render={props=>(
            <SignUpSuccess {...props} />)}
          />
          <Route exact path="/reset-password-success" render={props=>(
            <ResetSuccess {...props} />)}
          />
          <Route exact path="/home"><Home /></Route>
          <Route exact path="/booking"><Booking /></Route>
          <Route exact path="/booking-overview"><BookingOverview /></Route>
          <Route exact path="/booking-success"><BookingSuccess /></Route>
          <Route exact path="/logout" render={props=>(
            <LogoutSuccess {...props} />)}
          />
          <Route exact path="/profile"><Profile /></Route>
          <Route exact path="/help-staff"><HelpStaff /></Route>
          <Route exact path="/staff-sign-in-success"><StaffLoginSuccess /></Route>
          <Route exact path="/staff-home"><StaffHome /></Route>
          <Route exact path="/staff-venues"><StaffVenues /></Route>
          <Route exact path="/staff-profile"><StaffProfile /></Route>
          <Route exact path="/approval-overview"><ApprovalOverview /></Route>
          <Route exact path="/approval-success" render={props=>(
            <ApprovalSuccess {...props} />)}
          />
          <Route exact path="*"><ErrorPage /></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
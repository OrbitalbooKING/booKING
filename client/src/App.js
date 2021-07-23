import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Help from "./components/Help";
// import HelpLoggedIn from "./components/HelpLoggedIn";
import LoginForm from "./components/Login";
import LoginSuccess from "./components/LoginSuccess";
import SignUpForm from "./components/SignUp";
import SignUpSuccess from "./components/SignUpSuccess";
import ResetForm from "./components/Reset";
import ResetSuccess from "./components/ResetSuccess";
import Home from "./components/Home";
import StudentHome from "./components/StudentHome";
import Booking from "./components/Booking";
import BookingOverview from "./components/BookingOverview";
import BookingSuccess from "./components/BookingSuccess";
import LogoutSuccess from "./components/LogoutSuccess";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import EditStaffProfile from "./components/EditStaffProfile";
import EditProfileSuccess from "./components/EditProfileSuccess";

// import HelpStaff from "./components/HelpStaff";
// import StaffLoginSuccess from "./components/StaffLoginSuccess";
import StaffHome from "./components/StaffHome";
import AdminHome from "./components/AdminHome";
import CreationSuccess from "./components/CreationSuccess";
import StaffVenues from "./components/StaffVenues";
// import StaffProfile from "./components/StaffProfile";
import ApprovalOverview from "./components/ApprovalOverview";
import ApprovalSuccess from "./components/ApprovalSuccess";
import RejectionOverview from "./components/RejectionOverview";
import RejectionSuccess from "./components/RejectionSuccess";

import EditHome from "./components/EditHome";
import EditBooking from "./components/EditBooking";
import EditOverview from "./components/EditOverview";
import EditSuccess from "./components/EditSuccess";

import DeletionOverview from "./components/DeletionOverview";
import DeletionSuccess from "./components/DeletionSuccess";

import TransferPoints from "./components/TransferPoints";
import TransferSuccess from "./components/TransferSuccess";

import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <LoginForm />
          </Route>
          <Route exact path="/help">
            <Help />
          </Route>
          {/* <Route exact path="/help-logged-in">
            <HelpLoggedIn />
          </Route> */}
          <Route exact path="/sign-in">
            <LoginForm />
          </Route>
          <Route exact path="/sign-up">
            <SignUpForm />
          </Route>
          <Route exact path="/reset-password">
            <ResetForm />
          </Route>
          <Route
            exact
            path="/sign-in-success"
            render={(props) => <LoginSuccess {...props} />}
          />
          <Route
            exact
            path="/sign-up-success"
            render={(props) => <SignUpSuccess {...props} />}
          />
          <Route
            exact
            path="/reset-password-success"
            render={(props) => <ResetSuccess {...props} />}
          />

          <Route exact path="/student-home">
            <StudentHome />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/booking">
            <Booking />
          </Route>
          <Route exact path="/booking-overview">
            <BookingOverview />
          </Route>
          <Route
            exact
            path="/booking-success"
            render={(props) => <BookingSuccess {...props} />}
          />
          <Route
            exact
            path="/logout"
            render={(props) => <LogoutSuccess {...props} />}
          />
          <Route exact path="/profile">
            <Profile />
          </Route>

          <Route exact path="/edit-profile">
            <EditProfile />
          </Route>
          <Route exact path="/edit-staff-profile">
            <EditStaffProfile />
          </Route>
          <Route
            exact
            path="/edit-profile-success"
            render={(props) => <EditProfileSuccess {...props} />}
          />

          {/* <Route exact path="/help-staff">
            <HelpStaff />
          </Route> */}
          {/* <Route exact path="/staff-sign-in-success">
            <StaffLoginSuccess />
          </Route> */}
          <Route exact path="/staff-home">
            <StaffHome />
          </Route>
          <Route exact path="/admin-home">
            <AdminHome />
          </Route>
          <Route
            exact
            path="/creation-success"
            render={(props) => <CreationSuccess {...props} />}
          />
          <Route exact path="/staff-venues">
            <StaffVenues />
          </Route>
          {/* <Route exact path="/staff-profile">
            <StaffProfile />
          </Route> */}

          <Route exact path="/approval-overview">
            <ApprovalOverview />
          </Route>
          <Route
            exact
            path="/approval-success"
            render={(props) => <ApprovalSuccess {...props} />}
          />
          <Route exact path="/rejection-overview">
            <RejectionOverview />
          </Route>
          <Route
            exact
            path="/rejection-success"
            render={(props) => <RejectionSuccess {...props} />}
          />

          <Route exact path="/edit-home">
            <EditHome />
          </Route>
          <Route exact path="/edit-booking">
            <EditBooking />
          </Route>
          <Route exact path="/edit-overview">
            <EditOverview />
          </Route>
          <Route
            exact
            path="/edit-success"
            render={(props) => <EditSuccess {...props} />}
          />

          <Route exact path="/deletion-overview">
            <DeletionOverview />
          </Route>
          <Route
            exact
            path="/deletion-success"
            render={(props) => <DeletionSuccess {...props} />}
          />

          <Route exact path="/transfer-points">
            <TransferPoints />
          </Route>
          <Route
            exact
            path="/transfer-success"
            render={(props) => <TransferSuccess {...props} />}
          />

          <Route exact path="*">
            <ErrorPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

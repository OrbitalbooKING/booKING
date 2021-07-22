import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import { Link, useHistory } from "react-router-dom";

import logo from "../assets/logo for website.png";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import * as Cookies from "js-cookie";

function Layout3(props) {
  let history = useHistory();

  const getHelp = () => {
    history.push("/help-staff");
  };

  const getVenues = () => {
    history.push("/staff-venues");
  };

  const viewProfile = () => {
    history.push("/staff-profile");
  };

  const logout = () => {
    Cookies.remove("name", { sameSite: "None", secure: true });
    Cookies.remove("id", { sameSite: "None", secure: true });

    sessionStorage.removeItem("sessionExpiry");

    history.push({
      pathname: "/logout",
      state: {
        id: props.id,
        name: props.name,
      },
    });
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="sm" fixed="top">
        <Link className="navbar-brand" to="/home">
          <img
            className="logo"
            src={logo}
            alt="logo"
            style={{ float: "right", paddingLeft: 10 }}
          />
        </Link>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, 0%)",
          }}
        >
          {props.action === undefined ? "" : props.action}
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {/* <div className="container">
                        <Nav className="mr-auto">
                            <Nav.Link onClick={getVenues} style={{marginLeft: -30}}>Venues</Nav.Link>
                            <div style={{margin: '0 auto', alignSelf: 'center'}}>
                                {props.action === undefined ? "" : props.action}
                            </div>
                            <Nav.Link onClick={getHelp}>Help</Nav.Link>
                            <NavDropdown title={props.name !== "" ? props.name : props.id} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={viewProfile}>Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </div> */}
          <div className="container">
            <Nav className="mr-auto">
              <Nav.Link onClick={getVenues}>Venues</Nav.Link>
              <div style={{ margin: "0 auto", alignSelf: "center" }}></div>
              <Nav.Link onClick={getHelp}>Help</Nav.Link>
              <NavDropdown
                title={props.name !== "" ? props.name : props.id}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item onClick={viewProfile}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Navbar>
      <div>{props.children}</div>
    </div>
  );
}

export default Layout3;

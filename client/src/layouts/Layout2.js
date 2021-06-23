import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import history from '../history';
import { Link } from "react-router-dom";

import logo from "../assets/logo for website.png";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function Layout2(props) {

    const getHelp = () => {
        history.push({
            pathname: "/help-logged-in",
            state: { id: props.id }
        });
    };
    
    const viewProfile = () => {
        history.push({
            pathname: "/profile",
            state: { id: props.id }
        });
    };
    
    const logout = () => {
        history.push({
            pathname: "/logout",
            state: { id: props.id }
        });
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="sm" fixed="top">
                <Link className="navbar-brand" to="/home"><img className="logo" src = {logo} alt="logo" style={{float: 'right', paddingLeft: 10}}/></Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <div className="container">
                        <Nav className="mr-auto">
                            <div style={{margin: '0 auto', alignSelf: 'center'}}>
                                {props.action === undefined ? "" : props.action}
                            </div>
                            <Nav.Link onClick={getHelp}>Help</Nav.Link>
                            <NavDropdown title={props.id} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={viewProfile}>Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </div>
                </Navbar.Collapse>
            </Navbar>
            <div>
                {props.children}
            </div>
        </div>
    );
}

export default Layout2;
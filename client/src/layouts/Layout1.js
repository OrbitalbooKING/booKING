import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Link } from "react-router-dom";

import logo from "../assets/logo for website.png";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Layout1(props) {
    return (
        <div>
            <Navbar collapseOnSelect expand="sm" fixed="top" className="sticky-nav">
                <Link className="navbar-brand" to="/sign-in"><img className="logo" src = {logo} alt="logo" style={{float: 'right', paddingLeft: 10}}/></Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <div>
                        <Nav className="mr-auto">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/sign-in">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/sign-up">Sign up</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/help">Help</Link>
                                </li>
                            </ul>
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

export default Layout1;
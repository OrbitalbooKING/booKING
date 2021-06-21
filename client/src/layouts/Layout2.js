import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import history from '../history';

import logo from "../assets/logo for website.png";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function Layout2(props) {

    const logout = () => {
        history.push({
            pathname: "/logout",
            state: { id: props.id }
        });
    };

    const viewProfile = () => {
        history.push({
            pathname: "/profile",
            state: { id: props.id }
        });
    };

    return (
        <div className="">
            <Navbar bg="light" expand="lg" fixed="top"><div className="container">
            <Navbar.Brand href="/home"><img className="logo" src = {logo} alt="logo" /></Navbar.Brand>
            {/* <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/venues">Venues</Nav.Link>
                <Nav.Link href="#link">Search</Nav.Link>
                </Nav>
            </Navbar.Collapse> */}
            {props.action}
            <Nav className="mr-auto">
                <Nav.Link href="/help">Help</Nav.Link>
                <NavDropdown title={props.id} id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={viewProfile}>Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            </div>
            </Navbar>
            <div>{props.children}</div>
        </div>
    );
}

export default Layout2;
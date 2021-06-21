import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Link } from "react-router-dom";

import logo from "../assets/logo for website.png";

function Layout1(props) {
    return (
        <div className="">
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container">
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <Link className="navbar-brand" to="/sign-in"><img className="logo" src = {logo} alt="logo" /></Link>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/sign-in">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sign-up">Sign up</Link>
                        </li>
                    </ul>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarCollapse">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/help">Help</Link>
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            </nav>
            <div>{props.children}</div>
        </div>
    );
}

export default Layout1;
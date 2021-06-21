import { useState } from "react";
import { Link } from "react-router-dom";
import history from "../history";
import Axios from "axios";
import configData from "../config.json";

const style = {
    padding: 5
};

function SignUpForm() {

    const [details, setDetails] = useState({id: "", password: "", confirmPassword: ""});
    const [error, setError] = useState("Create your account!");

    const handleClick = e => {
        e.preventDefault();

        if (details.password !== details.confirmPassword) {
            setError("Passwords do not match!");
        } else if (details.id !== "" && details.password === "" && details.confirmPassword === "") {
            setError("Please enter a password!");
        } else if (details.password === details.confirmPassword && details.id !== "") {
            Axios.post(configData.LOCAL_HOST + "/register", {
                NUSNET_ID: details.id,
                password: details.password,
            }).then(response => {
                history.push("/sign-up-success");
            }).catch((error) => {
                if (error.response.status === 400) {
                    setError(error.response.data.message);
                } else {
                    setError("Query failed!");
                }
            });
        } else if (details.id === "" && details.password !== "" && details.confirmPassword !== "") {
            setError("Please enter your NUSNET ID!");
        } else {
            setError("Create your account!");
        }
    };

    return (
        <form>
            <h3>Sign Up</h3>

            <div className="error">
                <span>{error}</span>
            </div>

            <div className="form-group" style={style}>
                <input type="text" className="form-control" placeholder="NUSNET ID"  onChange={e => setDetails({...details, id: e.target.value})} value={details.id} />
            </div>

            <div className="form-group" style={style}>
                <input type="password" className="form-control" placeholder="Password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password} />
            </div>

            <div className="form-group" style={style}>
                <input type="password" className="form-control" placeholder="Re-enter password" onChange={e => setDetails({...details, confirmPassword: e.target.value})} value={details.confirmPassword} />
            </div>

            <div style={style}>
                <p className="forgot-password text-right">
                    Already registered? <Link to="/sign-in">Sign in</Link>
                </p>
                <button type="submit" className="btn btn-primary btn-block" onClick={handleClick}>Sign Up</button>
            </div>
        </form>
    );
}

export default SignUpForm;

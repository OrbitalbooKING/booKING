import { useState } from "react";
import { Link } from "react-router-dom";
import history from "../history";
import Axios from "axios";
import configData from "../config.json";

const style = {
    padding: 5
};

function LoginForm() {

    const [details, setDetails] = useState({id: "", password: ""});
    const [error, setError] = useState("Please enter your NUSNET ID and password!");

    const handleClick = e => {
        e.preventDefault();

        Axios.post(configData.LOCAL_HOST + "/login", {
            NUSNET_ID: details.id,
            password: details.password,
        }).then(response => { 
            history.push({
                pathname: "/welcome",
                state: { id: details.id }
            });
        }).catch((error) => {
            if (error.response.status === 400) {
                setError(error.response.data.message);
            } else {
                setError("Query failed!");
            }
        });
    };

    return (
        <form>
            <h3>Sign In</h3>

            <div className="error">
                <span>{error}</span>
            </div>

            <div className="form-group" style={style}>
                <input type="text" className="form-control" placeholder="NUSNET ID" onChange={e => setDetails({...details, id: e.target.value})} value={details.id} />
            </div>

            <div className="form-group" style={style}>
                <input type="password" className="form-control" placeholder="Password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password} />
            </div>

            <div style={style}>
                <p className="forgot-password text-right">
                    <Link to="/reset-password">Forgot password?</Link>
                </p>
                <button type="submit" className="btn btn-primary btn-block" onClick={handleClick}>Sign In</button>
            </div>
        </form>
    );
}

export default LoginForm;

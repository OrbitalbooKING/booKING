import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout1 from "../layouts/Layout1";
import Home from "./Home"

import * as Cookies from "js-cookie";

const style = {
    padding: 5
};

function LoginForm() {

    let history = useHistory();

    const [details, setDetails] = useState({id: "", password: ""});
    const [error, setError] = useState("Please enter your NUSNET ID and password!");

    const handleClick = e => {
        e.preventDefault();

        Axios.post(configData.LOCAL_HOST + "/login", {
            NUSNET_ID: details.id,
            password: details.password,
        }).then(response => {

            let inThreeHours = 0.125;
            // let inThreeHours = 0.0006944444;
            Cookies.set("name", response.data.message.Name, {
                sameSite: 'None', secure: true,
                expires: inThreeHours
            });
            Cookies.set("id", response.data.message.Nusnetid, {
                sameSite: 'None', secure: true,
                expires: inThreeHours
            });

            let expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + 1);
            sessionStorage.setItem("sessionExpiry", expiration.toUTCString());

            history.push({
                pathname: "/sign-in-success",
                state: { 
                    id: response.data.message.Nusnetid,
                    name: response.data.message.Name
                }
            });
            
        }).catch((error) => {
            if (error.response) {
                console.log("response");
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 400) {
                    setError(error.response.data.message);
                }
            } else if (error.request) {
                console.log("request");
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                setError("Query failed!");
            }
        });
    };

    return (
        <>
        {Cookies.get("name") === undefined && Cookies.get("id") === undefined
            ? <Layout1>
                <div className="parent">
                    <div className="content">
                        <form>
                            <h3>Sign In</h3>

                            <div className="error">
                                <span className="message">{error}</span>
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
                                <button style={{float: 'left', margin: 5}} type="submit" className="btn btn-primary btn-block" onClick={handleClick}>Sign In</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout1>
            : <Home />
        }
    </>
    );
}

export default LoginForm;
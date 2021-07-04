import { useHistory } from "react-router-dom";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function LoginSuccess() {

    let history = useHistory();

    const Home = () => {
        // history.push({
        //     pathname: "/home",
        //     state: { 
        //         id: props.location.state.id,
        //         name: props.location.state.name
        //     }
        // });
        history.push("/home");
    };

    return (
        <>
            {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined
                ? <Layout2 id={Cookies.get("id")} name={Cookies.get("name")} action="Logged in!">
                        <div className="parent">
                            <div className="welcome-page">
                                <h2>Welcome {Cookies.get("name") !== "" ? Cookies.get("name") : Cookies.get("id")}!</h2>
                                <div>
                                    <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Home}>Home</button> 
                                </div>
                            </div>
                        </div>
                    </Layout2>
                : <Unauthorised />
            }
        </>
    );
}

export default LoginSuccess;
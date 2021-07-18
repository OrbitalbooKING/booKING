import { useHistory } from "react-router-dom";
import Layout1 from "../layouts/Layout1";
import Unauthorised from "./Unauthorised";

function LogoutSuccess(props) {

    let history = useHistory();

    const Login = () => {
        console.log(window.sessionStorage.getItem("sessionExpiry") !== null)
        history.push("/sign-in");
    };

    return (
        <>
            {props.location.state !== undefined 
                ? <Layout1>
                        <div className="parent">
                            <div className="welcome-page">
                                <h2>Goodbye {props.location.state.name !== "" ? props.location.state.name : props.location.state.id}!</h2>
                                <div>
                                    <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button> 
                                </div>
                            </div>
                        </div>
                    </Layout1>
                : <Unauthorised />
            }
        </>
    );
}

export default LogoutSuccess;
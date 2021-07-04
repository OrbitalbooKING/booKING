import { useHistory } from "react-router-dom";
import Layout1 from "../layouts/Layout1";

function Unauthorised() {

    let history = useHistory();

    const Login = () => {
        history.push("/sign-in");
    };

    return (
        <Layout1>
            <div className="parent">
                <div className="welcome-page">
                    <div> 
                        <h2>Please login!</h2>
                        <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
                    </div>
                </div>
            </div>
        </Layout1>
    );
}

export default Unauthorised;
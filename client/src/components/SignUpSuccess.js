import history from "../history";
import Layout1 from "../layouts/Layout1";

function SignUpSuccess(props) {

    const Login = () => {
        history.push("/sign-in");
    };

    return (
        <Layout1>
            <div className="parent">
                <div className="welcome-page">
                    <h2>{props.location.state.message}</h2>
                    <div>
                        <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button> 
                    </div>
                </div>
            </div>
        </Layout1>
    );
}

export default SignUpSuccess;
import history from "../history";
// import Layout1 from "../layouts/Layout1";
import Layout1 from "../layouts/Layout1";
import Unauthorised from "./Unauthorised";

const style = {
    padding: 5
};

function LogoutSuccess(props) {

    // const Home = () => {
    //     history.push({
    //         pathname: "/home",
    //         state: { id: props.location.state.id }
    //     });
    // };

    const Login = () => {
        history.push("/sign-in");
    };

    return (
        <div className="auth-wrapper">
        <div className="auth-inner">
        <div className="welcome" style={style}>
            {props.location.state !== undefined 
                ? <Layout1 id={props.location.state.id} action="Logged out!">
                        <div>
                            <h2>Goodbye {props.location.state.id}!</h2>
                            <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button> 
                        </div>
                    </Layout1>
                : <Unauthorised />
            }
        </div></div></div>
    );
}

export default LogoutSuccess;
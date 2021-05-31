import history from "../history";

const style = {
    padding: 5
};

function LoginSuccess(props) {

    const Logout = () => {
        history.push("/sign-in");
    };

    const Login = () => {
        history.push("/sign-in");
    };

    return (
        <div className="welcome" style={style}>
            {props.location.state !== undefined 
                ? <div>
                    <h2>Welcome {props.location.state.id}!</h2>
                    <button type="submit" className="btn btn-primary btn-block" onClick={Logout}>Logout</button> 
                </div> 
                : <div> 
                    <h2>Invalid entry!</h2>
                    <button type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
                </div>
            }
        </div>
    );
}

export default LoginSuccess;
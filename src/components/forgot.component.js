import history from "../history";

const style = {
    padding: 5
};

function Forgot() {

    const Login = () => {
        history.push("/sign-in");
    };

    return (
        <div className="welcome" style={style}>
            <h2>You have successfully resetted your password!</h2>
            <button type="login" className="btn btn-primary btn-block" onClick={Login}>Login</button>
        </div>
    );
}

export default Forgot;
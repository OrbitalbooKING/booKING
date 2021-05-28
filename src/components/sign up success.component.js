import history from "../history";

const style = {
    padding: 5
};

function SignUpSuccess() {

    const Login = () => {
        history.push("/sign-in");
    };

    return (
        <div className="welcome" style={style}>
            <h2>You have successfully registered!</h2>
            <button type="submit" className="btn btn-primary btn-block" onClick={Login}>Login</button>
        </div>
    );
}

export default SignUpSuccess;
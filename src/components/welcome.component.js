import history from "../history";

const style = {
    padding: 5
};

function Welcome(props) {

    const id = props.location.state.id;

    const Logout = () => {
        history.push("/sign-in");
    };

    return (
        <div className="welcome" style={style}>
            <h2>Welcome {id}!</h2>
            <button type="logout" className="btn btn-primary btn-block" onClick={Logout}>Logout</button>
        </div>
    );
}

export default Welcome;
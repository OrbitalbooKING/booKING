import history from "../history";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

function LoginSuccess(props) {

    const Home = () => {
        history.push({
            pathname: "/home",
            state: { 
                id: props.location.state.id,
                name: props.location.state.name
            }
        });
    };

    return (
        <>
            {props.location.state !== undefined 
                ? <Layout2 id={props.location.state.id} name={props.location.state.name} action="Logged in!">
                        <div className="parent">
                            <div className="welcome-page">
                                <h2>Welcome {props.location.state.name !== "" ? props.location.state.name : props.location.state.id}!</h2>
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
import history from "../history";
// import Layout1 from "../layouts/Layout1";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

const style = {
    padding: 5
};

function BookingSuccess(props) {

    const Home = () => {
        history.push({
            pathname: "/home",
            state: { id: props.location.state.id }
        });
    };

    // const Login = () => {
    //     history.push("/sign-in");
    // };

    return (
        <div className="auth-wrapper">
        <div className="auth-inner">
        <div className="welcome" style={style}>
            {props.location.state !== undefined 
                ? <Layout2 id={props.location.state.id} action="Booking success!">
                        <div>
                            <h2>You have successfully made your bookings!</h2>
                            <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Home}>Home</button> 
                        </div>
                    </Layout2>
                : <Unauthorised />
            }
        </div></div></div>
    );
}

export default BookingSuccess;
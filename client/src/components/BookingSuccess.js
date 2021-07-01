import { useHistory } from "react-router-dom";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

function BookingSuccess(props) {

    let history = useHistory();

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
                ? <Layout2 id={props.location.state.id} name={props.location.state.name} action="Booking success!">
                        <div className="parent">
                            <div className="welcome-page">
                                <h2>You have successfully made your bookings!</h2>
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

export default BookingSuccess;
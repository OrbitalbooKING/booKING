import { useHistory } from "react-router-dom";
import Layout3 from "../layouts/Layout3";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function StaffLoginSuccess() {

    let history = useHistory();

    const goHome = () => {
        // history.push({
        //     pathname: "/home",
        //     state: { 
        //         id: props.location.state.id,
        //         name: props.location.state.name
        //     }
        // });
        history.push("/staff-home");
    };

    return (
        <>
            {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined
                ? <Layout3 id={Cookies.get("id")} name={Cookies.get("name")} action="Logged in!">
                        <div className="parent">
                            <div className="welcome-page">
                                <h2>Welcome {Cookies.get("name") !== "" ? Cookies.get("name") : Cookies.get("id")}!</h2>
                                <div>
                                    <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={goHome}>Home</button> 
                                </div>
                            </div>
                        </div>
                    </Layout3>
                : <Unauthorised />
            }
        </>
    );
}

export default StaffLoginSuccess;
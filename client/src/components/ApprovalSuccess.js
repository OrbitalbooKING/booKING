import { useHistory } from "react-router-dom";
import Layout3 from "../layouts/Layout3";
import StaffHome from "./StaffHome";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function ApprovalSuccess(props) {

    let history = useHistory();

    const Home = () => {
        history.push("/staff-home");
    };

    return (
        <>
            {props.location.state !== undefined 
                ? <Layout3 id={Cookies.get("id")} name={Cookies.get("name")} action="Approval success!">
                        <div className="parent">
                            <div className="welcome-page">
                                <h2>{props.location.state.message}</h2>
                                <div>
                                    <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={Home}>Home</button> 
                                </div>
                            </div>
                        </div>
                    </Layout3>
                : Cookies.get("name") !== undefined && Cookies.get("id") !== undefined
                    ? <StaffHome />
                    : <Unauthorised />
            }
        </>
    );
}

export default ApprovalSuccess;
import { useHistory } from "react-router-dom";
import Layout3 from "../layouts/Layout3";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function RejectionSuccess(props) {
  let history = useHistory();

  const goHome = () => {
    // redirects user back to home
    history.push("/home");
  };

  return (
    <>
      {props.location.state !== undefined &&
      Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Staff" ? (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Rejection success!"
        >
          <div className="parent">
            <div className="welcome-page">
              <h2>{props.location.state.message}</h2>
              <div>
                <button
                  style={{ float: "left" }}
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={goHome}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </Layout3>
      ) : Cookies.get("name") !== undefined &&
        Cookies.get("id") !== undefined &&
        Cookies.get("account") !== undefined ? (
        <Home />
      ) : (
        <Unauthorised />
      )}
    </>
  );
}

export default RejectionSuccess;

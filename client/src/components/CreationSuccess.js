import { useHistory } from "react-router-dom";
import Layout3 from "../layouts/Layout3";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function CreationSuccess(props) {
  let history = useHistory();

  const goHome = () => {
    history.push("/home");
  };

  return (
    <>
      {props.location.state.success &&
      Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Admin" ? (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Creation success!"
        >
          <div className="parent">
            <div className="welcome-page">
              <h2>
                Staff account successfully created! Temporary password sent to
                registered staff's email
              </h2>
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

export default CreationSuccess;

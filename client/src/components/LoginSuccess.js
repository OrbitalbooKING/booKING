import { useHistory } from "react-router-dom";
import Home from "./Home";
import Layout2 from "../layouts/Layout2";
import Layout3 from "../layouts/Layout3";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function LoginSuccess(props) {
  let history = useHistory();

  const goHome = () => {
    history.push("/home");
  };

  return (
    <>
      {props.location.state !== undefined &&
      Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Student" ? (
        <Layout2
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Logged in!"
        >
          <div className="parent">
            <div className="welcome-page">
              <h2>
                Welcome{" "}
                {Cookies.get("name") !== ""
                  ? Cookies.get("name")
                  : Cookies.get("id")}
                !
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
        </Layout2>
      ) : props.location.state !== undefined &&
        Cookies.get("name") !== undefined &&
        Cookies.get("id") !== undefined &&
        Cookies.get("account") !== undefined ? (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Logged in!"
        >
          <div className="parent">
            <div className="welcome-page">
              <h2>
                Welcome{" "}
                {Cookies.get("name") !== ""
                  ? Cookies.get("name")
                  : Cookies.get("id")}
                !
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

export default LoginSuccess;

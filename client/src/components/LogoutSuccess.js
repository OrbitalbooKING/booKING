import { useHistory } from "react-router-dom";
import Layout1 from "../layouts/Layout1";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function LogoutSuccess(props) {
  let history = useHistory();

  const goLogin = () => {
    // redirects user to login page
    history.push("/sign-in");
  };

  return (
    <>
      {props.location.state !== undefined ? (
        <Layout1>
          <div className="parent">
            <div className="welcome-page">
              <h2>
                Goodbye{" "}
                {props.location.state.name !== ""
                  ? props.location.state.name
                  : props.location.state.id}
                !
              </h2>
              <div>
                <button
                  style={{ float: "left" }}
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={goLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </Layout1>
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

export default LogoutSuccess;

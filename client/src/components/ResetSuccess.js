import { useHistory } from "react-router-dom";
import Layout1 from "../layouts/Layout1";
import Home from "./Home";
import LoginForm from "./Login";

import * as Cookies from "js-cookie";

function ResetSuccess(props) {
  let history = useHistory();

  const goLogin = () => {
    history.push("/sign-in");
  };

  return (
    <>
      {props.location.state !== undefined ? (
        <Layout1>
          <div className="parent">
            <div className="welcome-page">
              <h2>{props.location.state.message}</h2>
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
        <LoginForm />
      )}
    </>
  );
}

export default ResetSuccess;

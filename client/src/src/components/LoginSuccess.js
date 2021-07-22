import { useHistory } from "react-router-dom";
import Layout2 from "../layouts/Layout2";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function LoginSuccess(props) {
  let history = useHistory();

  const goHome = () => {
    // history.push({
    //     pathname: "/home",
    //     state: {
    //         id: props.location.state.id,
    //         name: props.location.state.name
    //     }
    // });

    history.push("/home");
  };

  return (
    <>
      {props.location.state !== undefined ? (
        <Layout2
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Logged in!"
        >
          <div className="parent">
            <div className="welcome-page">
              <h2>
                Welcome{" "}
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
                  onClick={goHome}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </Layout2>
      ) : Cookies.get("name") !== undefined &&
        Cookies.get("id") !== undefined ? (
        <Home />
      ) : (
        <Unauthorised />
      )}
    </>
  );
}

export default LoginSuccess;

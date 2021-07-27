import { useHistory } from "react-router-dom";
import Layout2 from "../layouts/Layout2";
import Layout3 from "../layouts/Layout3";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

function EditProfileSuccess(props) {
  let history = useHistory();

  const goProfile = () => {
    // redirects user back to profile
    history.push("/profile");
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
          action="Edit profile success!"
        >
          <div className="parent">
            <div className="welcome-page">
              <h2>You have successfully updated your profile!</h2>
              <div>
                <button
                  style={{ float: "left" }}
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={goProfile}
                >
                  Profile
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
          action="Edit profile success!"
        >
          <div className="parent">
            <div className="welcome-page">
              <h2>You have successfully updated your profile!</h2>
              <div>
                <button
                  style={{ float: "left" }}
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={goProfile}
                >
                  Profile
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

export default EditProfileSuccess;

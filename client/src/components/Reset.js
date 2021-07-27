import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout1 from "../layouts/Layout1";
import Home from "./Home";

import * as Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

const style = {
  padding: 5,
};

function ResetForm() {
  let history = useHistory();

  const [id, setId] = useState();
  const [error, setError] = useState(
    "Enter your NUSNET ID to reset your password!"
  );
  const [loading, setLoading] = useState(false);

  const resetPassword = (e) => {
    // user clicks on login
    e.preventDefault();

    setLoading(true);

    Axios.post(configData.LOCAL_HOST + "/trigger_password_reset", {
      NUSNET_ID: id,
    })
      .then((response) => {
        history.push({
          pathname: "/reset-password-success",
          state: {
            message: response.data.message,
            success: true,
          },
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log("response");
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 400) {
            setError(error.response.data.message);
            setLoading(false);
          }
        } else if (error.request) {
          console.log("request");
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the
          // browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          setLoading(false);
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("Query failed!");
          setLoading(false);
        }
      });
  };

  return (
    <>
      {Cookies.get("name") === undefined &&
      Cookies.get("id") === undefined &&
      Cookies.get("account") === undefined ? (
        <Layout1>
          <div className="parent">
            <div className="content">
              <form>
                <h3>Reset Password</h3>
                <div className="error">
                  <span className="message">{error}</span>
                </div>
                <div className="form-group" style={style}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="NUSNET ID"
                    onChange={(e) => setId(e.target.value)}
                    value={id}
                  />
                </div>
                <div style={style}>
                  <p className="forgot-password text-right">
                    <Link to="/sign-in">Sign in</Link>
                  </p>
                  <button
                    style={{ float: "left" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={resetPassword}
                  >
                    Reset
                  </button>
                  {loading ? (
                    <Spinner
                      animation="border"
                      role="status"
                      style={{ float: "left", margin: 5 }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            </div>
          </div>
        </Layout1>
      ) : (
        <Home />
      )}
    </>
  );
}

export default ResetForm;

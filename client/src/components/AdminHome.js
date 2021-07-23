import { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout3 from "../layouts/Layout3";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";

const style = {
  padding: 5,
};

function AdminHome() {
  let history = useHistory();

  const [username, setUsername] = useState("");
  const [id, setId] = useState("");

  const submitForm = (e) => {
    e.preventDefault();

    Axios.post(configData.LOCAL_HOST + "/create_staff", {
      name: username,
      NUSNET_ID: id,
    })
      .then((response) => {
        history.push({
          pathname: "/creation-success",
          state: { success: true },
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log("response");
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 400) {
            console.log(error.response.data.message);
          }
        } else if (error.request) {
          console.log("request");
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the
          // browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Query failed!");
        }
      });
  };

  return (
    <>
      {Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Admin" ? (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Create staff account"
        >
          <div className="parent">
            <div className="sign-up">
              <form>
                <h3>Create Staff Account</h3>

                <div className="form-group" style={style}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />
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
                  <button
                    style={{ float: "left" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={submitForm}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Layout3>
      ) : (
        <Unauthorised />
      )}
    </>
  );
}

export default AdminHome;

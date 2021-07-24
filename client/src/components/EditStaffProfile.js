import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout3 from "../layouts/Layout3";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import * as Cookies from "js-cookie";
import FormData from "form-data";

import DefaultPic from "../assets/profile.png";

const style = {
  padding: 5,
};

function EditStaffProfile() {
  let history = useHistory();

  const [profileInfo, setProfileInfo] = useState();

  const getProfile = () => {
    let search = new URLSearchParams();

    search.append("NUSNET_ID", Cookies.get("id"));

    Axios.get(configData.LOCAL_HOST + "/get_profile", {
      params: search,
    })
      .then((response) => {
        setProfileInfo(response.data.data);
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

  const [username, setUsername] = useState();
  const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [error, setError] = useState("Edit your profile!");

  const [profilePic, setProfilePic] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setProfilePic(img);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (password.new !== password.confirm) {
      setError("Passwords do not match!");
    } else if (password.new === password.confirm) {
      let bodyFormData = new FormData();

      bodyFormData.append("name", username);
      bodyFormData.append("NUSNET_ID", Cookies.get("id"));
      if (profilePic !== null) {
        bodyFormData.append("profilePic", profilePic);
      }

      Axios.put(configData.LOCAL_HOST + "/edit_profile", bodyFormData)
        .then((response) => {
          if (
            password.old === "" &&
            password.new === "" &&
            password.confirm === ""
          ) {
            history.push({
              pathname: "/edit-profile-success",
              state: { success: true },
            });
          } else {
            Axios.patch(configData.LOCAL_HOST + "/reset_password", {
              NUSNET_ID: Cookies.get("id"),
              oldPassword: password.old,
              newPassword: password.new,
            })
              .then((response) => {
                history.push({
                  pathname: "/edit-profile-success",
                  state: { success: true },
                });
              })
              .catch((error) => {
                if (error.response) {
                  console.log("response");
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  if (error.response.status === 400) {
                    setError(error.response.data.message);
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
                  setError("Query failed!");
                }
              });
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log("response");
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 400) {
              setError(error.response.data.message);
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
            setError("Query failed!");
          }
        });
    } else {
      setError("Edit your profile!");
    }
  };

  useEffect(() => {
    if (profileInfo !== undefined) {
      setUsername(profileInfo.Name);
    }
  }, [profileInfo]);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      (Cookies.get("account") === "Staff" ||
        Cookies.get("account") === "Admin") ? (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Editing profile"
        >
          <div className="parent">
            <div className="sign-up">
              {profileInfo === undefined ? (
                <div>
                  <h2 style={{ textAlign: "center", alignContent: "center" }}>
                    Loading...{" "}
                  </h2>
                </div>
              ) : (
                <form>
                  <h3>Update Profile</h3>

                  <div className="error">
                    <span className="message">{error}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                      paddingBottom: 5,
                    }}
                  >
                    {profilePic === null &&
                    profileInfo.ProfilepicURL !== undefined &&
                    profileInfo.ProfilepicURL !== null ? (
                      <img
                        src={profileInfo.ProfilepicURL}
                        style={{ width: 100, height: 100 }}
                        alt="profilePic"
                      />
                    ) : profilePic !== null ? (
                      <img
                        src={URL.createObjectURL(profilePic)}
                        style={{ width: 100, height: 100 }}
                        alt="profilePic"
                      />
                    ) : (
                      <img
                        src={DefaultPic}
                        style={{ width: 100, height: 100 }}
                        alt="profilePic"
                      />
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "auto",
                        margin: "0 auto",
                        justifyContent: "center",
                      }}
                    >
                      <input
                        type="file"
                        id="upload"
                        style={{ display: "none" }}
                        accept="image/png, image/jpeg"
                        onChange={onImageChange}
                      />
                      <label htmlFor="upload">Replace image</label>
                    </div>
                  </div>

                  <div className="form-group" style={style}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                      defaultValue={profileInfo.Name}
                    />
                  </div>

                  <div className="form-group" style={style}>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Old password"
                      onChange={(e) =>
                        setPassword({ ...password, old: e.target.value })
                      }
                      value={password.old}
                    />
                  </div>

                  <div className="form-group" style={style}>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="New password"
                      onChange={(e) =>
                        setPassword({ ...password, new: e.target.value })
                      }
                      value={password.new}
                    />
                  </div>

                  <div className="form-group" style={style}>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-enter new password"
                      onChange={(e) =>
                        setPassword({ ...password, confirm: e.target.value })
                      }
                      value={password.confirm}
                    />
                  </div>

                  <div style={style}>
                    <button
                      style={{ float: "left" }}
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={submitForm}
                    >
                      Update
                    </button>
                  </div>
                </form>
              )}
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

export default EditStaffProfile;

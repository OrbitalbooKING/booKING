import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";

import * as Cookies from "js-cookie";
import FormData from "form-data";

import DefaultPic from "../assets/profile.png";

const style = {
  padding: 5,
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 100,
  },
  formControl2: {
    minWidth: 300,
  },
  menuPaper: {
    maxHeight: 200,
  },
}));

function EditProfile() {
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

  const classes = useStyles();

  const currentYear = new Date().getFullYear();

  const [username, setUsername] = useState();
  const [gradYear, setGradYear] = useState();
  const [faculty, setFaculty] = useState();
  const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [error, setError] = useState("Edit your profile!");

  const handleGradYearChange = (event) => {
    setGradYear(event.target.value);
  };

  const handleFacultyChange = (event) => {
    setFaculty(event.target.value);
  };

  const [facultyList, setFacultyList] = useState();

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
      let facultyId = "";
      for (let i = 0; i < facultyList.length; i++) {
        if (faculty === facultyList[i].Facultydescription) {
          facultyId = facultyList[i].ID;
          continue;
        }
      }

      let bodyFormData = new FormData();

      bodyFormData.append("name", username);
      bodyFormData.append("NUSNET_ID", Cookies.get("id"));
      bodyFormData.append("faculty", facultyId);
      bodyFormData.append("gradYear", gradYear);
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

  const getFacultyList = (e) => {
    Axios.get(configData.LOCAL_HOST + "/get_faculty")
      .then((response) => {
        setFacultyList(response.data.data);
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

  useEffect(() => {
    if (profileInfo !== undefined && facultyList !== undefined) {
      setUsername(profileInfo.Name);
      setGradYear(profileInfo.Gradyear);
      setFaculty(profileInfo.Facultydescription);
    }
  }, [profileInfo, facultyList]);

  useEffect(() => {
    getProfile();
    getFacultyList();
  }, []);

  return (
    <>
      {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined ? (
        <Layout2
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
                      style={{ width: "60%", float: "left" }}
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                      defaultValue={profileInfo.Name}
                    />
                    <div>
                      <FormControl style={{ width: "40%", float: "left" }}>
                        <InputLabel id="demo-simple-select-label">
                          Grad. year
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={gradYear === undefined ? "" : gradYear}
                          onChange={handleGradYearChange}
                          input={<Input />}
                          MenuProps={{ classes: { paper: classes.menuPaper } }}
                        >
                          {Array.from(
                            { length: 10 / 1 },
                            (_, i) => currentYear + i
                          ).map((val, key) => {
                            return (
                              <MenuItem value={val} key={key}>
                                {val}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <FormControl style={{ width: "95%", paddingBottom: 5 }}>
                    <InputLabel id="demo-simple-select-label">
                      Faculty
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={faculty === undefined ? "" : faculty}
                      onChange={handleFacultyChange}
                      input={<Input />}
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                    >
                      {facultyList === undefined
                        ? ""
                        : Object.entries(facultyList)
                            .sort()
                            .map((val, key) => {
                              return (
                                <MenuItem
                                  value={val[1].Facultydescription}
                                  key={key}
                                >
                                  {val[1].Facultydescription}
                                </MenuItem>
                              );
                            })}
                    </Select>
                  </FormControl>

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
        </Layout2>
      ) : (
        <Unauthorised />
      )}
    </>
  );
}

export default EditProfile;

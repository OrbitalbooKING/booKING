import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Home from "./Home";
import Layout1 from "../layouts/Layout1";
import DefaultPic from "../assets/profile.png";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import * as Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";
import FormData from "form-data";

const style = {
  padding: 5,
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 100,
  },
  formControl2: {
    minWidth: 320,
  },
  menuPaper: {
    maxHeight: 200,
  },
}));

function SignUpForm() {
  let history = useHistory();

  const classes = useStyles();

  const currentYear = new Date().getFullYear();
  const [details, setDetails] = useState({
    id: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [gradYear, setGradYear] = useState();
  const [faculty, setFaculty] = useState();
  const [error, setError] = useState("Create your account!");
  const [loading, setLoading] = useState(false);
  const [facultyList, setFacultyList] = useState();
  const [profilePic, setProfilePic] = useState(null);

  const handleGradYearChange = (event) => {
    // changes graduation year based on selected graduation year
    setGradYear(event.target.value);
  };

  const handleFacultyChange = (event) => {
    // changes faculty based on selected faculty
    setFaculty(event.target.value);
  };

  const onImageChange = (event) => {
    // changes profile pic based on selected profile pic
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setProfilePic(img);
    }
  };

  const removeImage = () => {
    // removes profile pic
    setProfilePic(null);
  };

  const submitForm = (e) => {
    // user clicks on sign up
    e.preventDefault();

    setLoading(true);

    if (details.password !== details.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
    } else if (
      details.id !== "" &&
      details.password === "" &&
      details.confirmPassword === ""
    ) {
      setError("Please enter a password!");
      setLoading(false);
    } else if (
      details.password === details.confirmPassword &&
      details.id !== ""
    ) {
      let facultyId = "";
      for (let i = 0; i < facultyList.length; i++) {
        if (faculty === facultyList[i].Facultydescription) {
          facultyId = facultyList[i].ID;
          continue;
        }
      }

      let bodyFormData = new FormData();

      bodyFormData.append("name", details.username);
      bodyFormData.append("NUSNET_ID", details.id);
      bodyFormData.append("faculty", facultyId);
      bodyFormData.append("gradYear", gradYear);
      bodyFormData.append("password", details.password);
      if (profilePic !== null) {
        bodyFormData.append("profilePic", profilePic);
      }

      Axios.post(configData.LOCAL_HOST + "/register", bodyFormData)
        .then((response) => {
          history.push({
            pathname: "/sign-up-success",
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
    } else if (
      details.id === "" &&
      details.password !== "" &&
      details.confirmPassword !== ""
    ) {
      setError("Please enter your NUSNET ID!");
      setLoading(false);
    } else {
      setError("Create your account!");
      setLoading(false);
    }
  };

  const getFacultyList = () => {
    //get list of faculties for users to select
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
    getFacultyList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Cookies.get("name") === undefined &&
      Cookies.get("id") === undefined &&
      Cookies.get("account") === undefined ? (
        <Layout1>
          <div className="parent">
            <div className="sign-up">
              <form>
                <h3>Sign Up</h3>
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
                  {profilePic === null ? (
                    <img
                      src={DefaultPic}
                      style={{ width: 100, height: 100 }}
                      alt="profilePic"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(profilePic)}
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
                    <label htmlFor="upload">Upload image</label>
                    <input
                      type="button"
                      id="remove"
                      style={{ display: "none" }}
                      onClick={removeImage}
                    />
                    {profilePic === null ? (
                      ""
                    ) : (
                      <label htmlFor="remove">Remove image</label>
                    )}
                  </div>
                </div>
                <div className="form-group" style={style}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    onChange={(e) =>
                      setDetails({ ...details, username: e.target.value })
                    }
                    value={details.username}
                  />
                </div>
                <div className="form-group" style={style}>
                  <input
                    style={{ width: "60%", float: "left" }}
                    type="text"
                    className="form-control"
                    placeholder="NUSNET ID"
                    onChange={(e) =>
                      setDetails({ ...details, id: e.target.value })
                    }
                    value={details.id}
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
                <FormControl style={{ width: "95%" }}>
                  <InputLabel id="demo-simple-select-label">Faculty</InputLabel>
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
                    placeholder="Password"
                    onChange={(e) =>
                      setDetails({ ...details, password: e.target.value })
                    }
                    value={details.password}
                  />
                </div>
                <div className="form-group" style={style}>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter password"
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        confirmPassword: e.target.value,
                      })
                    }
                    value={details.confirmPassword}
                  />
                </div>
                <div style={style}>
                  <p className="forgot-password text-right">
                    Already registered? <Link to="/sign-in">Sign in</Link>
                  </p>
                  <button
                    style={{ float: "left" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={submitForm}
                  >
                    Sign Up
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

export default SignUpForm;

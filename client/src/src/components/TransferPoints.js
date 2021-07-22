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

function TransferPoints() {
  let history = useHistory();

  const getPoints = () => {
    let search = new URLSearchParams();

    search.append("NUSNET_ID", Cookies.get("id"));

    Axios.get(configData.LOCAL_HOST + "/get_profile", {
      params: search,
    })
      .then((response) => {
        setPointsLeft(response.data.data.Points);
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

  const [target, setTarget] = useState("");
  const [points, setPoints] = useState("");
  const [pointsLeft, setPointsLeft] = useState();
  const [error, setError] = useState("Transfer your points to your friends!");

  const submitForm = (e) => {
    e.preventDefault();

    Axios.post(configData.LOCAL_HOST + "/transfer_points", {
      user: Cookies.get("id"),
      target: target,
      points: points,
    })
      .then((response) => {
        history.push({
          pathname: "/transfer-success",
          state: { message: response.data.message },
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
  };

  useEffect(() => {
    getPoints();
  }, []);

  return (
    <>
      {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined ? (
        <Layout2
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Tranfer points"
        >
          <div className="parent">
            <div className="sign-up">
              {pointsLeft === undefined ? (
                <div>
                  <h2 style={{ textAlign: "center", alignContent: "center" }}>
                    Loading...{" "}
                  </h2>
                </div>
              ) : (
                <form>
                  <h3>Transfer Points</h3>

                  <div className="error">
                    <span className="message">{error}</span>
                  </div>

                  <div className="form-group" style={style}>
                    <input
                      //   style={{ width: "60%", float: "left" }}
                      type="text"
                      className="form-control"
                      placeholder="Target recipient of points"
                      onChange={(e) => setTarget(e.target.value)}
                      value={target}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: 5,
                    }}
                  >
                    <input
                      style={{ width: "70%", float: "left" }}
                      type="text"
                      className="form-control"
                      placeholder="Points to transfer"
                      onChange={(e) => setPoints(e.target.value)}
                      value={points}
                    />
                    <div
                      style={{
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                    >
                      Points Left: {pointsLeft}
                    </div>
                  </div>

                  <div style={style}>
                    <button
                      style={{ float: "left" }}
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={submitForm}
                    >
                      Transfer
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

export default TransferPoints;

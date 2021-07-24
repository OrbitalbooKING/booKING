import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout3 from "../layouts/Layout3";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";

import moment from "moment";

import * as Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    maxHeight: 200,
  },
}));

function StaffHome() {
  let history = useHistory();

  const classes = useStyles();

  const [bookingsList, setBookingsList] = useState();

  const [status, setStatus] = useState("All");
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const getBookings = () => {
    Axios.get(configData.LOCAL_HOST + "/get_booking_requests")
      .then((response) => {
        setBookingsList(response.data.data);
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

  const approveBooking = (val) => () => {
    let inThreeHours = 0.125;

    Cookies.set("bookingId", val.BookingID, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });

    history.push("/approval-overview");
  };

  const rejectBooking = (val) => () => {
    let inThreeHours = 0.125;

    Cookies.set("bookingId", val.BookingID, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });

    history.push("/rejection-overview");
  };

  const dateConverter = (date) => {
    let endHour = Number(date.substring(11, 13)) + 1;

    let tempDate = date.substring(0, 13);

    return (
      moment(tempDate, "YYYY-MM-DDThh").format("Do MMMM YYYY hh:mm a") +
      " to " +
      moment(endHour, "hh").format("h:mm a")
    );
  };

  useEffect(() => {
    getBookings(); //get booking requests from API

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Staff" ? (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Booking requests"
        >
          <div className="parent">
            <div className="home-page">
              <div className="bookings-list">
                <div className="display-bookings-header">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingRight: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 100,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Requestor{" "}
                    </div>
                    <div
                      style={{
                        width: 100,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Requestor's faculty{" "}
                    </div>
                    <div
                      style={{
                        width: 80,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Booking id{" "}
                    </div>
                    <div
                      style={{
                        width: 180,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Venue name{" "}
                    </div>
                    <div
                      style={{
                        width: 100,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Location{" "}
                    </div>
                    <div
                      style={{
                        width: 150,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Date{" "}
                    </div>
                    <div
                      style={{
                        width: 70,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Pax{" "}
                    </div>
                    <div
                      style={{
                        width: 80,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Sharing?{" "}
                    </div>
                    <FormControl style={{ width: 100 }}>
                      <InputLabel id="demo-simple-select-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        onChange={handleStatusChange}
                        input={<Input />}
                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                      >
                        <MenuItem value={"All"} key={"All"}>
                          All
                        </MenuItem>
                        <MenuItem value={"Pending"} key={"Pending"}>
                          Pending
                        </MenuItem>
                        <MenuItem value={"Approved"} key={"Approved"}>
                          Approved
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div style={{ overflowY: "auto", height: 400 }}>
                  {bookingsList === undefined ? (
                    <div
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : bookingsList.length === 0 ? (
                    <div className="display-selected-booking">
                      <div
                        style={{
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        <h3>No bookings to display</h3>
                      </div>
                    </div>
                  ) : status === "All" ? (
                    bookingsList.map((val, key) => {
                      return (
                        <div key={key}>
                          <div
                            className="display-selected-booking"
                            style={{ height: "auto" }}
                          >
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <div
                                style={{
                                  width: 100,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Nusnetid}{" "}
                              </div>
                              <div
                                style={{
                                  width: 100,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Facultydescription}{" "}
                              </div>
                              <div
                                style={{
                                  width: 80,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.BookingID.substring(0, 4)}
                              </div>
                              <div
                                style={{
                                  width: 180,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Venuename}{" "}
                              </div>
                              <div
                                style={{
                                  width: 100,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Buildingname} {val.Unit}{" "}
                              </div>
                              <div
                                style={{
                                  width: 150,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {dateConverter(val.Eventstart)}{" "}
                              </div>
                              <div
                                style={{
                                  width: 70,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Pax}{" "}
                              </div>
                              <div
                                style={{
                                  width: 80,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Sharable ? "Yes" : "No"}{" "}
                              </div>
                              <div
                                style={{
                                  width: 100,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Bookingstatusdescription}{" "}
                              </div>
                              <div
                                style={{
                                  width: 60,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                <DropdownButton
                                  id="dropdown-basic-button"
                                  title="Handle"
                                >
                                  <Dropdown.Item onClick={approveBooking(val)}>
                                    Approve
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={rejectBooking(val)}>
                                    Reject
                                  </Dropdown.Item>
                                </DropdownButton>
                              </div>
                            </div>
                          </div>
                          <br />
                        </div>
                      );
                    })
                  ) : status === "Pending" ? (
                    bookingsList
                      .filter(
                        (data) =>
                          data.Bookingstatusdescription === "Pending approval"
                      )
                      .map((val, key) => {
                        return (
                          <div key={key}>
                            <div
                              className="display-selected-booking"
                              style={{ height: "auto" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div
                                  style={{
                                    width: 100,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Nusnetid}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 100,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Facultydescription}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 80,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.BookingID.substring(0, 4)}
                                </div>
                                <div
                                  style={{
                                    width: 180,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Venuename}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 100,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Buildingname} {val.Unit}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 150,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {dateConverter(val.Eventstart)}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 70,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Pax}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 80,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Sharable ? "Yes" : "No"}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 100,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Bookingstatusdescription}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 60,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  <DropdownButton
                                    id="dropdown-basic-button"
                                    title="Handle"
                                  >
                                    <Dropdown.Item
                                      onClick={approveBooking(val)}
                                    >
                                      Approve
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={rejectBooking(val)}>
                                      Reject
                                    </Dropdown.Item>
                                  </DropdownButton>
                                </div>
                              </div>
                            </div>
                            <br />
                          </div>
                        );
                      })
                  ) : bookingsList.filter(
                      (data) =>
                        data.Bookingstatusdescription === "Pending approval"
                    ).length === 0 ? (
                    <div className="display-selected-booking">
                      <div
                        style={{
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        <h3>No bookings to display</h3>
                      </div>
                    </div>
                  ) : status === "Pending" ? (
                    bookingsList
                      .filter(
                        (data) =>
                          data.Bookingstatusdescription === "Pending approval"
                      )
                      .map((val, key) => {
                        return (
                          <div key={key}>
                            <div
                              className="display-selected-booking"
                              style={{ height: "auto" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div
                                  style={{
                                    width: 100,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Nusnetid}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 100,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Facultydescription}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 80,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.BookingID.substring(0, 4)}
                                </div>
                                <div
                                  style={{
                                    width: 180,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Venuename}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 100,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Buildingname} {val.Unit}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 150,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {dateConverter(val.Eventstart)}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 70,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Pax}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 80,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Sharable ? "Yes" : "No"}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 100,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Bookingstatusdescription}{" "}
                                </div>
                                <div
                                  style={{
                                    width: 60,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  <DropdownButton
                                    id="dropdown-basic-button"
                                    title="Handle"
                                  >
                                    <Dropdown.Item
                                      onClick={approveBooking(val)}
                                    >
                                      Approve
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={rejectBooking(val)}>
                                      Reject
                                    </Dropdown.Item>
                                  </DropdownButton>
                                </div>
                              </div>
                            </div>
                            <br />
                          </div>
                        );
                      })
                  ) : (
                    <div className="display-selected-booking">
                      <div
                        style={{
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        <h3>No bookings to display</h3>
                      </div>
                    </div>
                  )}
                </div>
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

export default StaffHome;

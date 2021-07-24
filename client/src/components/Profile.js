import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Layout3 from "../layouts/Layout3";
import Unauthorised from "./Unauthorised";

import moment from "moment";

import DefaultPic from "../assets/profile.png";
import * as Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";

function Profile() {
  let history = useHistory();

  const [profileInfo, setProfileInfo] = useState();
  const [bookings, setBookings] = useState();

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

  const getBookings = () => {
    let search = new URLSearchParams();

    search.append("NUSNET_ID", Cookies.get("id"));

    Axios.get(configData.LOCAL_HOST + "/get_bookings", {
      params: search,
    })
      .then((response) => {
        setBookings(response.data.data);
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

  const dateConverter = (date) => {
    let endHour = Number(date.substring(11, 13)) + 1;
    let tempDate = date.substring(0, 13);

    return (
      moment(tempDate, "YYYY-MM-DDThh").format("Do MMMM YYYY hh:mm a") +
      " to " +
      moment(endHour, "hh").format("h:mm a")
    );
  };

  const deleteBooking = (val) => () => {
    let inThreeHours = 0.125;

    Cookies.set("bookingId", val.Bookingid, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });

    history.push("/deletion-overview");
  };

  const editBooking = (val) => () => {
    let inThreeHours = 0.125;

    Cookies.set("oldBookingId", val.Bookingid, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });
    Cookies.set("oldBuildingId", val.Buildingid, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });
    Cookies.set("oldUnit", val.Unit, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });

    history.push("/edit-home");
  };

  const editProfile = () => {
    history.push("/edit-profile");
  };

  const editStaffProfile = () => {
    history.push("/edit-staff-profile");
  };

  useEffect(() => {
    getProfile(); //populates list of venues from API
    getBookings(); //get venue details for filtering from API

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Student" ? (
        <Layout2
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Viewing profile"
        >
          <div className="parent-home">
            <div className="home-page">
              <div className="profile">
                <h3>Profile</h3>
                <div
                  className="display-selected-venue"
                  style={{ height: "auto" }}
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ alignSelf: "center" }}>
                      {profileInfo === undefined ? (
                        <img
                          src={DefaultPic}
                          style={{ width: 100, height: 100 }}
                          alt="profilePic"
                        />
                      ) : (
                        <img
                          src={profileInfo.ProfilepicURL}
                          style={{ width: 100, height: 100 }}
                          alt="profilePic"
                        />
                      )}
                    </div>
                    <div style={{ paddingLeft: 20, flex: 1 }}>
                      <div>
                        <div>
                          Username:{" "}
                          {profileInfo === undefined ? "" : profileInfo.Name}
                        </div>
                        <div>
                          NUSNET ID:{" "}
                          {profileInfo === undefined
                            ? ""
                            : profileInfo.NUSNET_ID}
                        </div>
                        <div>
                          Graduation year:{" "}
                          {profileInfo === undefined
                            ? ""
                            : profileInfo.Gradyear}
                        </div>
                        <div>
                          Faculty:{" "}
                          {profileInfo === undefined
                            ? ""
                            : profileInfo.Facultydescription}
                        </div>
                        <div>
                          Points:{" "}
                          {profileInfo === undefined
                            ? ""
                            : Math.round(profileInfo.Points * 10) / 10}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: 60,
                        textAlign: "right",
                        alignSelf: "center",
                      }}
                    >
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        onClick={editProfile}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                <br />
                <h3>Bookings</h3>
                <div className="display-selected-venue-header">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingRight: 20,
                    }}
                  >
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
                        width: 220,
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
                    <div
                      style={{
                        width: 80,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Status{" "}
                    </div>
                  </div>
                </div>
                <div style={{ overflowY: "auto", height: 200 }}>
                  {bookings === undefined ? (
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
                  ) : bookings.length === 0 ? (
                    <div className="display-selected-venue">
                      <div style={{ textAlign: "center", alignSelf: "center" }}>
                        <h3>No bookings to display</h3>
                      </div>
                    </div>
                  ) : (
                    bookings.map((val, key) => {
                      return (
                        <div key={key}>
                          <div
                            className="display-selected-venue"
                            style={{ height: "auto" }}
                          >
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <div
                                style={{
                                  width: 80,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Bookingid.substring(0, 4)}{" "}
                              </div>
                              <div
                                style={{
                                  width: 220,
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
                                  width: 80,
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
                                {val.Bookingstatusdescription === "Rejected" ? (
                                  <DropdownButton
                                    id="dropdown-basic-button"
                                    title="Edit"
                                    disabled
                                  >
                                    <Dropdown.Item onClick={editBooking(val)}>
                                      Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={deleteBooking(val)}>
                                      Delete
                                    </Dropdown.Item>
                                  </DropdownButton>
                                ) : (
                                  <DropdownButton
                                    id="dropdown-basic-button"
                                    title="Edit"
                                  >
                                    <Dropdown.Item onClick={editBooking(val)}>
                                      Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={deleteBooking(val)}>
                                      Delete
                                    </Dropdown.Item>
                                  </DropdownButton>
                                )}
                              </div>
                            </div>
                          </div>
                          <br />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="profile-mobile">
                <div
                  style={{
                    width: "auto",
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  <h3>Profile</h3>
                </div>
                <div style={{ overflowY: "auto", height: 230 }}>
                  <div style={{ display: "flex", flex: 1 }}>
                    <div style={{ margin: "0 auto" }}>
                      {profileInfo === undefined ? (
                        <img
                          src={DefaultPic}
                          style={{ width: 100, height: 100 }}
                          alt="profilePic"
                        />
                      ) : (
                        <img
                          src={profileInfo.ProfilepicURL}
                          style={{ width: 100, height: 100 }}
                          alt="profilePic"
                        />
                      )}
                    </div>
                  </div>

                  <div className="display-old-header">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Username{" "}
                    </div>
                  </div>
                  <div className="display-old">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {profileInfo === undefined ? "" : profileInfo.Name}{" "}
                    </div>
                  </div>
                  <div className="display-old-header">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      NUSNET ID{" "}
                    </div>
                  </div>
                  <div className="display-old">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {profileInfo === undefined ? "" : profileInfo.NUSNET_ID}{" "}
                    </div>
                  </div>
                  <div className="display-old-header">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Graduation year{" "}
                    </div>
                  </div>
                  <div className="display-old">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {profileInfo === undefined ? "" : profileInfo.Gradyear}{" "}
                    </div>
                  </div>
                  <div className="display-old-header">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Faculty{" "}
                    </div>
                  </div>
                  <div className="display-old">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {profileInfo === undefined
                        ? ""
                        : profileInfo.Facultydescription}{" "}
                    </div>
                  </div>
                  <div className="display-old-header">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Points{" "}
                    </div>
                  </div>
                  <div className="display-old">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {profileInfo === undefined
                        ? ""
                        : Math.round(profileInfo.Points * 10) / 10}{" "}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "auto",
                      textAlign: "center",
                      alignSelf: "center",
                      paddingTop: 10,
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={editProfile}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <br />
              <div className="venue-list-mobile">
                <div
                  style={{
                    width: "auto",
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  <h3>Bookings</h3>
                </div>
                <div style={{ overflowY: "auto", height: 230 }}>
                  {bookings === undefined ? (
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
                  ) : bookings.length === 0 ? (
                    <div className="display-selected-venue">
                      <div
                        style={{
                          width: 220,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        <h3>No bookings to display</h3>
                      </div>
                    </div>
                  ) : (
                    bookings.map((val, key) => {
                      return (
                        <div key={key}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Booking id{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Bookingid.substring(0, 4)}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Venue name{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Venuename}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Location{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Buildingname} {val.Unit}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Date{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {dateConverter(val.Eventstart)}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Pax{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Pax}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Status{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Bookingstatusdescription}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Sharing{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Sharable ? "Yes" : "No"}{" "}
                                </div>
                              </div>

                              <div
                                style={{
                                  width: "auto",
                                  textAlign: "center",
                                  alignSelf: "center",
                                  paddingTop: 10,
                                }}
                              >
                                {val.Bookingstatusdescription === "Rejected" ? (
                                  <DropdownButton
                                    id="dropdown-basic-button"
                                    title="Edit"
                                    disabled
                                  >
                                    <Dropdown.Item onClick={editBooking(val)}>
                                      Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={deleteBooking(val)}>
                                      Delete
                                    </Dropdown.Item>
                                  </DropdownButton>
                                ) : (
                                  <DropdownButton
                                    id="dropdown-basic-button"
                                    title="Edit"
                                  >
                                    <Dropdown.Item onClick={editBooking(val)}>
                                      Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={deleteBooking(val)}>
                                      Delete
                                    </Dropdown.Item>
                                  </DropdownButton>
                                )}
                              </div>
                              <hr />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </Layout2>
      ) : Cookies.get("name") !== undefined &&
        Cookies.get("id") !== undefined &&
        Cookies.get("account") !== undefined ? (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Viewing profile"
        >
          <div className="parent-home">
            <div className="home-page">
              <div className="display-selected-venue-header">
                <h3>Profile</h3>
                <div
                  className="display-selected-venue"
                  style={{ height: "auto" }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "row", flex: 1 }}
                  >
                    <div style={{ alignSelf: "center" }}>
                      {profileInfo === undefined ? (
                        <img
                          src={DefaultPic}
                          style={{ width: 100, height: 100 }}
                          alt="profilePic"
                        />
                      ) : (
                        <img
                          src={profileInfo.ProfilepicURL}
                          style={{ width: 100, height: 100 }}
                          alt="profilePic"
                        />
                      )}
                    </div>
                    <div style={{ paddingLeft: 20 }}>
                      <div>
                        <div>
                          Username:{" "}
                          {profileInfo === undefined ? "" : profileInfo.Name}
                        </div>
                        <div>
                          NUSNET ID:{" "}
                          {profileInfo === undefined
                            ? ""
                            : profileInfo.NUSNET_ID}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "65%",
                        textAlign: "right",
                        alignSelf: "center",
                      }}
                    >
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        onClick={editStaffProfile}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout3>
      ) : (
        <Unauthorised />
      )}
    </>
  );
}

export default Profile;

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import moment from "moment";
import * as Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

function EditOverview() {
  let history = useHistory();

  const [bookingInfo, setBookingInfo] = useState();
  const [oldVenueInfo, setOldVenueInfo] = useState();
  const [venueInfo, setVenueInfo] = useState();
  const [cart, setCart] = useState();
  const [loading, setLoading] = useState(false);

  const getOldBooking = () => {
    // get booking details for currently editing booking
    let search = new URLSearchParams();

    search.append("bookingID", Cookies.get("oldBookingId"));

    Axios.get(configData.LOCAL_HOST + "/check_booking", {
      params: search,
    })
      .then((response) => {
        setBookingInfo(response.data.data);
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

  const getOldVenue = () => {
    // get booking details for currently editing booking
    let search = new URLSearchParams();

    search.append("buildingName", Cookies.get("oldBuildingId"));
    search.append("unitNo", Cookies.get("oldUnit"));

    Axios.get(configData.LOCAL_HOST + "/search", {
      params: search,
    })
      .then((response) => {
        setOldVenueInfo(response.data.data);
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

  const venueSearch = () => {
    // get venue details for selected venue
    let search = new URLSearchParams();

    search.append("buildingName", Cookies.get("buildingId"));
    search.append("unitNo", Cookies.get("unit"));

    Axios.get(configData.LOCAL_HOST + "/search", {
      params: search,
    })
      .then((response) => {
        setVenueInfo(response.data.data);
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

  const getCartItems = () => {
    // whenever the user changes date or capacity
    let search = new URLSearchParams();

    search.append("NUSNET_ID", Cookies.get("id"));

    Axios.get(configData.LOCAL_HOST + "/get_pending_booking", {
      params: search,
    })
      .then((response) => {
        setCart(response.data.data.PendingBookings);
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

  const confirmBooking = () => {
    // user confirms the booking
    if (cart !== undefined) {
      setLoading(true);
      let tempArr = [];

      for (let i = 0; i < cart.length; i++) {
        tempArr.push(cart[i].Bookingid);
      }

      Axios.put(configData.LOCAL_HOST + "/make_booking", {
        bookingID: tempArr,
      })
        .then((response) => {
          let search = new URLSearchParams();
          search.append("bookingID", Cookies.get("oldBookingId"));

          Axios.delete(configData.LOCAL_HOST + "/delete_confirmed_bookings", {
            params: search,
          })
            .then((response) => {
              history.push({
                pathname: "/edit-success",
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
                console.log("Query failed!");
                setLoading(false);
              }
            });
        })
        .catch((error) => {
          if (error.response) {
            console.log("response");
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 400) {
              console.log(error.response.data.message);
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
            console.log("Query failed!");
            setLoading(false);
          }
        });
    }
  };

  const dateConverter = (givenDate) => {
    // display the time slot
    let endHour = Number(givenDate.substring(11, 13)) + 1;
    let tempDate = givenDate.substring(0, 13);

    return (
      moment(tempDate, "YYYY-MM-DDThh").format("Do MMMM YYYY hh:mm a") +
      " to " +
      moment(endHour, "hh").format("h:mm a")
    );
  };

  useEffect(() => {
    getOldBooking();
    getOldVenue();
    venueSearch();
    getCartItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Student" &&
      Cookies.get("oldBookingId") !== undefined &&
      Cookies.get("oldBuildingId") !== undefined &&
      Cookies.get("oldUnit") !== undefined &&
      Cookies.get("buildingName") !== undefined &&
      Cookies.get("buildingId") !== undefined &&
      Cookies.get("unit") !== undefined ? (
        <Layout2
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Editing overview"
        >
          <div className="parent-edit-home">
            <div className="home-page">
              <div className="edit-home">
                <div className="column">
                  {oldVenueInfo === undefined || bookingInfo === undefined ? (
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
                  ) : (
                    oldVenueInfo.map((val, key) => {
                      return (
                        <div key={key}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div
                              style={{
                                width: 220,
                                textAlign: "center",
                                alignSelf: "center",
                              }}
                            >
                              <h3>Currently editing:</h3>
                            </div>
                            <div className="edit-column-booking">
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Venue type{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Roomtypename}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: 220,
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
                                    width: 220,
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
                                    width: 220,
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
                                    width: 220,
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
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Max capacity{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {val.Maxcapacity}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Equipment{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div>
                                    {val.Facilitiesdict.Projector ===
                                      undefined &&
                                    val.Facilitiesdict.Screen === undefined &&
                                    val.Facilitiesdict.Desktop === undefined &&
                                    val.Facilitiesdict.Whiteboard === undefined
                                      ? "Nil"
                                      : ""}
                                  </div>
                                  <div>
                                    {val.Facilitiesdict.Projector === undefined
                                      ? ""
                                      : val.Facilitiesdict.Projector === 1
                                      ? val.Facilitiesdict.Projector +
                                        " projector"
                                      : val.Facilitiesdict.Projector +
                                        " projectors"}
                                  </div>
                                  <div>
                                    {val.Facilitiesdict.Screen === undefined
                                      ? ""
                                      : val.Facilitiesdict.Screen === 1
                                      ? val.Facilitiesdict.Screen + " screen"
                                      : val.Facilitiesdict.Screen + " screens"}
                                  </div>
                                  <div>
                                    {val.Facilitiesdict.Desktop === undefined
                                      ? ""
                                      : val.Facilitiesdict.Desktop === 1
                                      ? val.Facilitiesdict.Desktop + " desktop"
                                      : val.Facilitiesdict.Desktop +
                                        " desktops"}
                                  </div>
                                  <div>
                                    {val.Facilitiesdict.Whiteboard === undefined
                                      ? ""
                                      : val.Facilitiesdict.Whiteboard === 1
                                      ? val.Facilitiesdict.Whiteboard +
                                        " whiteboard"
                                      : val.Facilitiesdict.Whiteboard +
                                        " whiteboards"}
                                  </div>
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Booking time{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {dateConverter(bookingInfo.Eventstart)}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Pax booked{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {bookingInfo.Pax}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Sharing?{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {bookingInfo.Sharable ? "Yes" : "No"}{" "}
                                </div>
                              </div>
                              <div className="display-old-header">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  Booking status{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    width: 220,
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {bookingInfo.Bookingstatusdescription}{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="booking-selector">
                  <div className="display-selected-venue-header">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          width: 240,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Venue type{" "}
                      </div>
                      <div
                        style={{
                          width: 260,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Venue name{" "}
                      </div>
                      <div
                        style={{
                          width: 150,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Location{" "}
                      </div>
                      <div
                        style={{
                          width: 80,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Max capacity{" "}
                      </div>
                      <div
                        style={{
                          width: 120,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Equipment{" "}
                      </div>
                    </div>
                  </div>
                  {venueInfo === undefined ? (
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
                  ) : venueInfo.length === 0 ? (
                    <div className="display-selected-venue">
                      <div style={{ textAlign: "center", alignSelf: "center" }}>
                        <h3>No details to display</h3>
                      </div>
                    </div>
                  ) : (
                    venueInfo.map((val, key) => {
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
                                  width: 240,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Roomtypename}{" "}
                              </div>
                              <div
                                style={{
                                  width: 260,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Venuename}{" "}
                              </div>
                              <div
                                style={{
                                  width: 150,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Buildingname} {val.Unit}{" "}
                              </div>
                              <div
                                style={{
                                  width: 80,
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                {val.Maxcapacity}{" "}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: 120,
                                  textAlign: "center",
                                  alignSelf: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div>
                                  {val.Facilitiesdict.Projector === undefined &&
                                  val.Facilitiesdict.Screen === undefined &&
                                  val.Facilitiesdict.Desktop === undefined &&
                                  val.Facilitiesdict.Whiteboard === undefined
                                    ? "Nil"
                                    : ""}
                                </div>
                                <div>
                                  {val.Facilitiesdict.Projector === undefined
                                    ? ""
                                    : val.Facilitiesdict.Projector === 1
                                    ? val.Facilitiesdict.Projector +
                                      " projector"
                                    : val.Facilitiesdict.Projector +
                                      " projectors"}
                                </div>
                                <div>
                                  {val.Facilitiesdict.Screen === undefined
                                    ? ""
                                    : val.Facilitiesdict.Screen === 1
                                    ? val.Facilitiesdict.Screen + " screen"
                                    : val.Facilitiesdict.Screen + " screens"}
                                </div>
                                <div>
                                  {val.Facilitiesdict.Desktop === undefined
                                    ? ""
                                    : val.Facilitiesdict.Desktop === 1
                                    ? val.Facilitiesdict.Desktop + " desktop"
                                    : val.Facilitiesdict.Desktop + " desktops"}
                                </div>
                                <div>
                                  {val.Facilitiesdict.Whiteboard === undefined
                                    ? ""
                                    : val.Facilitiesdict.Whiteboard === 1
                                    ? val.Facilitiesdict.Whiteboard +
                                      " whiteboard"
                                    : val.Facilitiesdict.Whiteboard +
                                      " whiteboards"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      Currently selected time slots:
                    </div>
                    <div
                      style={{
                        margin: "0 auto",
                        overflowY: "auto",
                        height: 260,
                        marginBottom: 10,
                      }}
                    >
                      {cart === undefined ? (
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
                      ) : cart.length === 0 ? (
                        <div>
                          <div
                            style={{ textAlign: "center", alignSelf: "center" }}
                          >
                            <h3>Add a time slot</h3>
                          </div>
                        </div>
                      ) : (
                        cart.map((val, key) => {
                          return (
                            <div key={key}>
                              <hr />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                    paddingRight: 10,
                                  }}
                                >
                                  Pax: {val.Pax} | Timing:{" "}
                                  {dateConverter(val.Eventstart)}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <br />
                    <div style={{ textAlign: "right" }}>
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        onClick={confirmBooking}
                      >
                        Confirm
                      </button>
                      {loading ? (
                        <Spinner
                          animation="border"
                          role="status"
                          style={{ float: "right", margin: 5 }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="booking-selector-mobile">
                <div
                  style={{
                    width: "auto",
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  <h3>Currently selected venue:</h3>
                </div>
                <div style={{ overflowY: "auto", height: 250 }}>
                  {venueInfo === undefined ? (
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
                  ) : venueInfo.length === 0 ? (
                    <div className="display-selected-venue">
                      <div style={{ textAlign: "center", alignSelf: "center" }}>
                        <h3>No details to display</h3>
                      </div>
                    </div>
                  ) : (
                    venueInfo.map((val, key) => {
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
                                  Venue type{" "}
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
                                  {val.Roomtypename}{" "}
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
                                  Max capacity{" "}
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
                                  {val.Maxcapacity}{" "}
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
                                  Equipment{" "}
                                </div>
                              </div>
                              <div className="display-old">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div>
                                    {val.Facilitiesdict.Projector ===
                                      undefined &&
                                    val.Facilitiesdict.Screen === undefined &&
                                    val.Facilitiesdict.Desktop === undefined &&
                                    val.Facilitiesdict.Whiteboard === undefined
                                      ? "Nil"
                                      : ""}
                                  </div>
                                  <div>
                                    {val.Facilitiesdict.Projector === undefined
                                      ? ""
                                      : val.Facilitiesdict.Projector === 1
                                      ? val.Facilitiesdict.Projector +
                                        " projector"
                                      : val.Facilitiesdict.Projector +
                                        " projectors"}
                                  </div>
                                  <div>
                                    {val.Facilitiesdict.Screen === undefined
                                      ? ""
                                      : val.Facilitiesdict.Screen === 1
                                      ? val.Facilitiesdict.Screen + " screen"
                                      : val.Facilitiesdict.Screen + " screens"}
                                  </div>
                                  <div>
                                    {val.Facilitiesdict.Desktop === undefined
                                      ? ""
                                      : val.Facilitiesdict.Desktop === 1
                                      ? val.Facilitiesdict.Desktop + " desktop"
                                      : val.Facilitiesdict.Desktop +
                                        " desktops"}
                                  </div>
                                  <div>
                                    {val.Facilitiesdict.Whiteboard === undefined
                                      ? ""
                                      : val.Facilitiesdict.Whiteboard === 1
                                      ? val.Facilitiesdict.Whiteboard +
                                        " whiteboard"
                                      : val.Facilitiesdict.Whiteboard +
                                        " whiteboards"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <br />
              <div className="booking-selector-mobile">
                <div
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <div style={{ textAlign: "center" }}>
                    Currently selected time slots:
                  </div>
                  <div
                    style={{
                      margin: "0 auto",
                      overflowY: "auto",
                      height: 250,
                      marginBottom: 10,
                    }}
                  >
                    {cart === undefined ? (
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
                    ) : cart.length === 0 ? (
                      <div>
                        <div
                          style={{ textAlign: "center", alignSelf: "center" }}
                        >
                          <h3>Add a time slot</h3>
                        </div>
                      </div>
                    ) : (
                      cart.map((val, key) => {
                        return (
                          <div key={key}>
                            <hr />
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <div
                                style={{
                                  width: "auto",
                                  textAlign: "center",
                                  alignSelf: "center",
                                  paddingRight: 10,
                                }}
                              >
                                Pax: {val.Pax} | Timing:{" "}
                                {dateConverter(val.Eventstart)}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={confirmBooking}
                    >
                      Confirm
                    </button>
                    {loading ? (
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ float: "right", margin: 5 }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout2>
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

export default EditOverview;

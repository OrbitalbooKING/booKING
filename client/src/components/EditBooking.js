import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Calendar, DateObject } from "react-multi-date-picker";
import moment from "moment";
import * as Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 90,
  },
  menuPaper: {
    maxHeight: 200,
  },
}));

function EditBooking() {
  let history = useHistory();

  const classes = useStyles();

  const [errorMessage, setErrorMessage] = useState();
  const [bookingInfo, setBookingInfo] = useState();
  const [oldVenueInfo, setOldVenueInfo] = useState();
  const [bookable, setBookable] = useState();
  const [cost, setCost] = useState();
  const [points, setPoints] = useState();
  const [venueInfo, setVenueInfo] = useState();
  const [date, setDate] = useState(new DateObject());
  const [sharing, setSharing] = useState();
  const [capacity, setCapacity] = useState(0);
  const [timings, setTimings] = useState([]);
  const [availability, setAvailability] = useState();
  const [selected, setSelected] = useState();
  const [cart, setCart] = useState();
  const [loading, setLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

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

  const getPoints = () => {
    // get user's points and cart details
    // whenever user adds a new item to cart, this function will be called to refetch the cart details
    let search = new URLSearchParams();

    search.append("NUSNET_ID", Cookies.get("id"));
    search.append("OldBookingID", Cookies.get("oldBookingId"));

    Axios.get(configData.LOCAL_HOST + "/get_user_with_temp_points", {
      params: search,
    })
      .then((response) => {
        setPoints(response.data.data.UserPoints);
        setCost(response.data.data.TotalCost);
        setBookable(response.data.data.ValidCheckout);
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

  const handleDateChange = (selected) => {
    // changes current date based on selected date on calendar
    setDate(selected);
  };

  const handleCapacityChange = (event) => {
    // changes capacity based on selected capacity
    setCapacity(event.target.value);
  };

  const handleSharingChange = (event) => {
    // changes sharing option based on selected sharing option
    setSharing(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    // called everytime user selects/deselects a checkbox
    let selectedHour = Number(event.target.name.substring(4, 6));

    let selectedStart = toIsoString(
      new Date(
        date.year,
        date.month.number - 1,
        date.day,
        selectedHour,
        0,
        0,
        0
      )
    );
    let selectedEnd = toIsoString(
      new Date(
        date.year,
        date.month.number - 1,
        date.day,
        selectedHour + 1,
        0,
        0,
        0
      )
    );

    if (event.target.checked) {
      // user selected checkbox
      addToCart(selectedStart, selectedEnd);
    } else {
      // user unselected checkbox
      removeFromCart(selectedStart, selectedEnd);
    }
  };

  const getTimings = () => {
    // get bookings for selected date
    // every capacity/date change should call this function to update the booking list
    let search = new URLSearchParams();

    let eventStart = new Date(
      date.year,
      date.month.number - 1,
      date.day,
      0,
      0,
      0,
      0
    );
    let eventEnd = new Date(
      date.year,
      date.month.number - 1,
      date.day + 1,
      0,
      0,
      0,
      0
    );

    search.append("eventStart", toIsoString(eventStart));
    search.append("eventEnd", toIsoString(eventEnd));
    search.append("buildingName", Cookies.get("buildingName"));
    search.append("unitNo", Cookies.get("unit"));
    search.append("pax", capacity);
    if (sharing !== undefined) {
      search.append("sharable", sharing);
    }

    Axios.get(configData.LOCAL_HOST + "/timings", {
      params: search,
    })
      .then((response) => {
        setTimings(response.data.data);
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

  const populateCheckbox = () => {
    //populates checkbox for selecting time slots
    let availabilityState = {};
    let selectedState = {};
    for (let i = 0; i < timings.length; i++) {
      let key = "";
      key = "time" + timings[i].EventStart.substring(11, 13).toString() + "00";
      availabilityState[key] = timings[i].Available;
      selectedState[key] = false;
    }

    setAvailability(availabilityState);
    setSelected(selectedState);

    // check against cart and set selected as necessary
    if (cart !== undefined) {
      for (let i = 0; i < cart.length; i++) {
        if (
          date.format("MM/DD/YYYY") ===
          moment(cart[i].Eventstart.substring(0, 13), "YYYY-MM-DDThh").format(
            "MM/DD/YYYY"
          )
        ) {
          // if current date = date in cart
          let key = "";
          key = "time" + cart[i].Eventstart.substring(11, 13).toString() + "00";
          selectedState[key] = true;
        }
      }
    }
  };

  const getCartItems = () => {
    // whenever the user changes date or capacity
    let search = new URLSearchParams();

    search.append("NUSNET_ID", Cookies.get("id"));
    search.append("OldBookingID", Cookies.get("oldBookingId"));

    Axios.get(configData.LOCAL_HOST + "/get_user_with_temp_points", {
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

  const addToCart = (start, end) => {
    // whenever the user checks a checkbox
    if (cart !== undefined) {
      let changeInCapacity = false;
      for (let i = 0; i < cart.length; i++) {
        if (!sharing && cart[i].Pax === venueInfo[0].Maxcapacity) {
          changeInCapacity = false;
        } else if (capacity !== cart[i].Pax) {
          changeInCapacity = true;
          continue;
        }
      }
      if (changeInCapacity) {
        removeAllFromCart();
      }
    }

    let data = {};
    data["NUSNET_ID"] = Cookies.get("id");
    data["unitNo"] = Cookies.get("unit");
    data["buildingName"] = Cookies.get("buildingName");
    data["pax"] = capacity;
    data["eventStart"] = start;
    data["eventEnd"] = end;
    data["sharable"] = sharing;

    Axios.post(configData.LOCAL_HOST + "/make_pending_booking", [data])
      .then((response) => {
        getTimings();
        getCartItems();
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

  const removeFromCart = (start, end) => {
    // whenever the user unchecks a checkbox
    for (let i = 0; i < cart.length; i++) {
      if (start.substring(0, 13) === cart[i].Eventstart.substring(0, 13)) {
        let search = new URLSearchParams();

        search.append("bookingID", cart[i].Bookingid);

        Axios.delete(configData.LOCAL_HOST + "/delete_pending_bookings", {
          params: search,
        })
          .then((response) => {
            getTimings();
            getCartItems();
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
        continue;
      }
    }
  };

  const removeTimeSlot = (value) => () => {
    // removes selected time slot
    let search = new URLSearchParams();
    search.append("bookingID", value.Bookingid);

    Axios.delete(configData.LOCAL_HOST + "/delete_pending_bookings", {
      params: search,
    })
      .then((response) => {
        getTimings();
        getCartItems();
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

  const removeAllFromCart = () => {
    // removes all bookings in cart
    if (cart !== undefined) {
      setClearLoading(true);

      let search = new URLSearchParams();
      for (let i = 0; i < cart.length; i++) {
        search.append("bookingID", cart[i].Bookingid);
      }
      Axios.delete(configData.LOCAL_HOST + "/delete_pending_bookings", {
        params: search,
      })
        .then((response) => {
          setClearLoading(false);
          getTimings();
          getCartItems();
        })
        .catch((error) => {
          if (error.response) {
            console.log("response");
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 400) {
              console.log(error.response.data.message);
              setClearLoading(false);
            }
          } else if (error.request) {
            console.log("request");
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the
            // browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            setClearLoading(false);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Query failed!");
            setClearLoading(false);
          }
        });
    }
  };

  const checkoutCart = () => {
    // redirects user to confirmation page
    setLoading(true);
    history.push("/edit-overview");
  };

  const DisplayTimings = () => {
    // displays checkboxes for users to select timeslots
    return (
      <div>
        <div style={{ overflowY: "auto", height: 200, paddingLeft: 5 }}>
          <FormGroup>
            {availability === undefined || timings.length === 0 ? (
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
              Object.entries(availability).map((val, key) => {
                if (
                  date.format("MM/DD/YYYY") === moment().format("MM/DD/YYYY") ||
                  sharing === undefined ||
                  (capacity === 0 && sharing)
                ) {
                  return (
                    <FormControlLabel
                      disabled
                      control={
                        <Checkbox
                          checked={selected[val[0]]}
                          onChange={handleCheckboxChange}
                          name={val[0]}
                        />
                      }
                      label={formatter(val[0])}
                      key={key}
                    />
                  );
                } else if (val[1]) {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selected[val[0]]}
                          onChange={handleCheckboxChange}
                          name={val[0]}
                        />
                      }
                      label={formatter(val[0])}
                      key={key}
                    />
                  );
                } else {
                  for (let i = 0; i < cart.length; i++) {
                    if (
                      cart[i].Eventstart ===
                      toIsoString(
                        new Date(
                          date.year,
                          date.month.number - 1,
                          date.day,
                          val[0].substring(4, 6),
                          0,
                          0,
                          0
                        )
                      ).substring(0, 19) +
                        "Z"
                    ) {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selected[val[0]]}
                              onChange={handleCheckboxChange}
                              name={val[0]}
                            />
                          }
                          label={formatter(val[0])}
                          key={key}
                        />
                      );
                    }
                  }
                  return (
                    <FormControlLabel
                      disabled
                      control={
                        <Checkbox
                          checked={selected[val[0]]}
                          onChange={handleCheckboxChange}
                          name={val[0]}
                        />
                      }
                      label={formatter(val[0])}
                      key={key}
                    />
                  );
                }
              })
            )}
          </FormGroup>
        </div>
        <div className="calendar-error">
          <span className="message">{errorMessage}</span>
        </div>
      </div>
    );
  };

  const formatter = (timing) => {
    // formats timings for checkbox logic
    let start = Number(timing.substring(4, 6));
    let end = Number(timing.substring(4, 6)) + 1;

    if (start < 11) {
      return (
        start +
        ":" +
        timing.substring(6, 9) +
        " am to " +
        end +
        ":" +
        timing.substring(6, 9) +
        " am"
      );
    } else if (start === 11) {
      return (
        start +
        ":" +
        timing.substring(6, 9) +
        " am to " +
        end +
        ":" +
        timing.substring(6, 9) +
        " pm"
      );
    } else if (start === 12) {
      return (
        start +
        ":" +
        timing.substring(6, 9) +
        " pm to " +
        (end - 12) +
        ":" +
        timing.substring(6, 9) +
        " pm"
      );
    } else {
      return (
        start -
        12 +
        ":" +
        timing.substring(6, 9) +
        " pm to " +
        (end - 12) +
        ":" +
        timing.substring(6, 9) +
        " pm"
      );
    }
  };

  const toIsoString = (date) => {
    // converts given date to ISO format
    let tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? "0" : "") + norm;
      };

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ":" +
      pad(tzo % 60)
    );
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

  const findMaxCapacity = (max, points, sharing) => {
    //get maximum capacity user can select
    if (sharing) {
      if (max < Math.floor(points * 1.2)) {
        return max;
      } else {
        return Math.floor(points * 1.2);
      }
    } else {
      if (max < Math.floor(points)) {
        return max;
      } else {
        return Math.floor(points);
      }
    }
  };

  useEffect(() => {
    getOldBooking();
    getOldVenue();
    getPoints();
    venueSearch();
    getCartItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTimings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    getTimings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capacity]);

  useEffect(() => {
    getTimings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharing]);

  useEffect(() => {
    if (date.format("MM/DD/YYYY") === moment().format("MM/DD/YYYY")) {
      setErrorMessage("Please select a date!");
    } else if (
      ((capacity > 1 && sharing) || !sharing) &&
      sharing !== undefined
    ) {
      setErrorMessage("");
    } else if (availability !== undefined && timings.length !== 0) {
      if (sharing === undefined) {
        setErrorMessage("Please indicate if sharing!");
      } else if (capacity === 0) {
        setErrorMessage("Please select a capacity!");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capacity, sharing, availability, timings]);

  useEffect(() => {
    populateCheckbox();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timings]);

  useEffect(() => {
    // wipe old cart bookings when booking for a new venue
    if (cart !== undefined) {
      let changeInVenue = false;
      for (let i = 0; i < cart.length; i++) {
        if (
          Cookies.get("unit") !== cart[i].Unitno &&
          Cookies.get("buildingName") !== cart[i].Buildingname
        ) {
          changeInVenue = true;
          continue;
        }
      }
      if (changeInVenue) {
        removeAllFromCart();
      }
    }
    populateCheckbox();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  useEffect(() => {
    getPoints();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

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
          action="Make a new booking"
        >
          <div className="parent-edit">
            <div className="home-page">
              <div className="edit-home">
                <div className="column">
                  {oldVenueInfo === undefined ? (
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
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingRight: 10,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id="demo-simple-select-label">
                            Sharing?
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sharing === undefined ? "" : sharing}
                            onChange={handleSharingChange}
                            input={<Input />}
                            MenuProps={{
                              classes: { paper: classes.menuPaper },
                            }}
                          >
                            <MenuItem value={true} key={"Yes"}>
                              Yes
                            </MenuItem>
                            <MenuItem value={false} key={"No"}>
                              No
                            </MenuItem>
                          </Select>
                        </FormControl>

                        {sharing ? (
                          <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">
                              Capacity
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={capacity === 0 ? "" : capacity}
                              onChange={handleCapacityChange}
                              input={<Input />}
                              MenuProps={{
                                classes: { paper: classes.menuPaper },
                              }}
                            >
                              {venueInfo === undefined || points === undefined
                                ? null
                                : Array.from(
                                    {
                                      length: findMaxCapacity(
                                        venueInfo[0].Maxcapacity,
                                        points,
                                        sharing
                                      ),
                                    },
                                    (v, i) => 1 + i
                                  ).map((val, key) => {
                                    return (
                                      <MenuItem value={val} key={key}>
                                        {val}
                                      </MenuItem>
                                    );
                                  })}
                            </Select>
                          </FormControl>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        <Calendar
                          mapDays={({ date }) => {
                            let currentTime = new DateObject();

                            if (date < currentTime)
                              return {
                                disabled: true,
                                style: { color: "#ccc" },
                                onClick: () =>
                                  alert("Date has already passed!"),
                              };
                          }}
                          value={date}
                          onChange={handleDateChange}
                          format="DD/MM/YYYY HH:mm"
                          plugins={[<DisplayTimings />]}
                        ></Calendar>
                      </div>
                    </div>
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
                          overflowY: "auto",
                          height: 240,
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
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          </div>
                        ) : cart.length === 0 ? (
                          <div>
                            <div
                              style={{
                                textAlign: "center",
                                alignSelf: "center",
                              }}
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
                                  <div
                                    style={{
                                      width: "auto",
                                      textAlign: "center",
                                      alignSelf: "center",
                                    }}
                                  >
                                    <button
                                      type="submit"
                                      className="btn btn-primary btn-sm"
                                      onClick={removeTimeSlot(val)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <br />
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div
                          style={{
                            width: "50%",
                            textAlign: "left",
                            alignSelf: "center",
                          }}
                        >
                          Points left: {Math.round(points * 10) / 10}
                        </div>
                        <div
                          style={{
                            width: "50%",
                            textAlign: "right",
                            alignSelf: "center",
                          }}
                        >
                          Points needed: {Math.round(cost * 10) / 10}
                        </div>
                      </div>
                      <br />
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div
                          style={{
                            width: "50%",
                            textAlign: "left",
                            alignSelf: "center",
                          }}
                        >
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            onClick={removeAllFromCart}
                          >
                            Clear cart
                          </button>
                          {clearLoading ? (
                            <Spinner
                              animation="border"
                              role="status"
                              style={{ float: "left", margin: 5 }}
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          ) : (
                            ""
                          )}
                        </div>
                        <div
                          style={{
                            width: "50%",
                            textAlign: "right",
                            alignSelf: "center",
                          }}
                        >
                          {cart === undefined ? (
                            <button
                              type="submit"
                              className="btn btn-primary btn-block"
                              disabled
                            >
                              Checkout
                            </button>
                          ) : bookable && cart.length > 0 ? (
                            <>
                              <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                onClick={checkoutCart}
                              >
                                Checkout
                              </button>
                              {loading ? (
                                <Spinner
                                  animation="border"
                                  role="status"
                                  style={{ float: "right", margin: 5 }}
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            <button
                              type="submit"
                              className="btn btn-primary btn-block"
                              disabled
                            >
                              Checkout
                            </button>
                          )}
                        </div>
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
                        <div
                          style={{ textAlign: "center", alignSelf: "center" }}
                        >
                          <h3>No details to display</h3>
                        </div>
                      </div>
                    ) : (
                      venueInfo.map((val, key) => {
                        return (
                          <div key={key}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
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
                                      val.Facilitiesdict.Desktop ===
                                        undefined &&
                                      val.Facilitiesdict.Whiteboard ===
                                        undefined
                                        ? "Nil"
                                        : ""}
                                    </div>
                                    <div>
                                      {val.Facilitiesdict.Projector ===
                                      undefined
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
                                        : val.Facilitiesdict.Screen +
                                          " screens"}
                                    </div>
                                    <div>
                                      {val.Facilitiesdict.Desktop === undefined
                                        ? ""
                                        : val.Facilitiesdict.Desktop === 1
                                        ? val.Facilitiesdict.Desktop +
                                          " desktop"
                                        : val.Facilitiesdict.Desktop +
                                          " desktops"}
                                    </div>
                                    <div>
                                      {val.Facilitiesdict.Whiteboard ===
                                      undefined
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
                  <div style={{ width: 260 }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">
                          Sharing?
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={sharing === undefined ? "" : sharing}
                          onChange={handleSharingChange}
                          input={<Input />}
                          MenuProps={{ classes: { paper: classes.menuPaper } }}
                        >
                          <MenuItem value={true} key={"Yes"}>
                            Yes
                          </MenuItem>
                          <MenuItem value={false} key={"No"}>
                            No
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {sharing ? (
                        <FormControl className={classes.formControl}>
                          <InputLabel id="demo-simple-select-label">
                            Capacity
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={capacity === 0 ? "" : capacity}
                            onChange={handleCapacityChange}
                            input={<Input />}
                            MenuProps={{
                              classes: { paper: classes.menuPaper },
                            }}
                          >
                            {venueInfo === undefined || points === undefined
                              ? null
                              : Array.from(
                                  {
                                    length: findMaxCapacity(
                                      venueInfo[0].Maxcapacity,
                                      points,
                                      sharing
                                    ),
                                  },
                                  (v, i) => 1 + i
                                ).map((val, key) => {
                                  return (
                                    <MenuItem value={val} key={key}>
                                      {val}
                                    </MenuItem>
                                  );
                                })}
                          </Select>
                        </FormControl>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <Calendar
                    mapDays={({ date }) => {
                      let currentTime = new DateObject();

                      if (date < currentTime)
                        return {
                          disabled: true,
                          style: { color: "#ccc" },
                          onClick: () => alert("Date has already passed!"),
                        };
                    }}
                    value={date}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY HH:mm"
                  ></Calendar>
                  <DisplayTimings />
                </div>
                <br />
                <div className="booking-selector-mobile">
                  <div style={{ width: 260 }}>
                    <div style={{ textAlign: "center" }}>
                      Currently selected time slots:
                    </div>
                    <div style={{ overflowY: "auto", height: 200 }}>
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
                                  }}
                                >
                                  Pax: {val.Pax} | Timing:{" "}
                                  {dateConverter(val.Eventstart)}
                                </div>
                                <div
                                  style={{
                                    width: "auto",
                                    textAlign: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    onClick={removeTimeSlot(val)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <br />
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          width: "45%",
                          textAlign: "left",
                          alignSelf: "center",
                        }}
                      >
                        Points left: {Math.round(points * 10) / 10}
                      </div>
                      <div
                        style={{
                          width: "55%",
                          textAlign: "right",
                          alignSelf: "center",
                        }}
                      >
                        Points needed: {Math.round(cost * 10) / 10}
                      </div>
                    </div>
                    <br />
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          width: "50%",
                          textAlign: "left",
                          alignSelf: "center",
                        }}
                      >
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          onClick={removeAllFromCart}
                        >
                          Clear cart
                        </button>
                        {clearLoading ? (
                          <Spinner
                            animation="border"
                            role="status"
                            style={{
                              float: "left",
                              margin: 5,
                              width: 20,
                              height: 20,
                            }}
                          >
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        ) : (
                          ""
                        )}
                      </div>
                      <div
                        style={{
                          width: "50%",
                          textAlign: "right",
                          alignSelf: "center",
                        }}
                      >
                        {cart === undefined ? (
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled
                          >
                            Checkout
                          </button>
                        ) : bookable && cart.length > 0 ? (
                          <>
                            <button
                              type="submit"
                              className="btn btn-primary btn-block"
                              onClick={checkoutCart}
                            >
                              Checkout
                            </button>
                            {loading ? (
                              <Spinner
                                animation="border"
                                role="status"
                                style={{
                                  float: "right",
                                  margin: 5,
                                  width: 20,
                                  height: 20,
                                }}
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled
                          >
                            Checkout
                          </button>
                        )}
                      </div>
                    </div>
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

export default EditBooking;

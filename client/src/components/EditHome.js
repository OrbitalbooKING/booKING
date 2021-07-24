import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import moment from "moment";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import DatePicker from "react-datepicker";
import subDays from "date-fns/subDays";
import "react-datepicker/dist/react-datepicker.css";

import * as Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    maxHeight: 200,
  },
}));

function EditHome() {
  let history = useHistory();

  const classes = useStyles();

  const [bookingInfo, setBookingInfo] = useState();
  const [venueInfo, setVenueInfo] = useState();

  const [searchResults, setSearchResults] = useState();
  const [venuesList, setVenuesList] = useState();

  // 4 forms
  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [unit, setUnit] = useState("");

  const [capacity, setCapacity] = useState(0);

  const [equipment, setEquipment] = useState([]);
  const equipmentList = ["Projector", "Screen", "Desktop", "Whiteboard"];

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };
  const handleEquipmentChange = (event) => {
    setEquipment(event.target.value);
  };

  const filterStartTime = (time) => {
    if (endDate !== null) {
      const currentDate = new Date();
      const selectedDate = new Date(time);
      return (
        currentDate.getTime() < selectedDate.getTime() &&
        selectedDate.getTime() < endDate.getTime()
      );
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(time);
      return currentDate.getTime() < selectedDate.getTime();
    }
  };

  const filterEndTime = (time) => {
    if (startDate !== null) {
      const selectedDate = new Date(time);
      return startDate.getTime() < selectedDate.getTime();
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(time);
      return currentDate.getTime() < selectedDate.getTime();
    }
  };

  const getOldBooking = () => {
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
    let search = new URLSearchParams();

    search.append("buildingName", Cookies.get("oldBuildingId"));
    search.append("unitNo", Cookies.get("oldUnit"));

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

  const getVenues = () => {
    Axios.get(configData.LOCAL_HOST + "/home")
      .then((response) => {
        setVenuesList(response.data.data);
        // setVenuesList(MOCKDATA);
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
    let search = new URLSearchParams();
    for (let i = 0; i < equipment.length; i++) {
      search.append("equipment", `${equipment[i]}`);
    }
    search.append("capacity", capacity);
    if (buildingName !== "") {
      let buildingNameId = "";
      for (let i = 0; i < searchResults.length; i++) {
        if (buildingName === searchResults[i].Buildingname) {
          buildingNameId = searchResults[i].Buildingid;
          continue;
        }
      }
      search.append("buildingName", buildingNameId);
    }

    if (unit !== "") {
      search.append("unitNo", unit);
    }
    if (venueType !== "") {
      let venueTypeId = "";
      for (let i = 0; i < searchResults.length; i++) {
        if (venueType === searchResults[i].Roomtypename) {
          venueTypeId = searchResults[i].Roomtypeid;
          continue;
        }
      }
      search.append("roomType", venueTypeId);
    }
    if (venueName !== "") {
      search.append("venueName", venueName);
    }

    if (startDate !== null) {
      search.append("startHour", toIsoString(startDate));
    }
    if (endDate !== null) {
      search.append("endHour", toIsoString(endDate));
    }

    Axios.get(configData.LOCAL_HOST + "/search", {
      params: search,
    })
      .then((response) => {
        setSearchResults(response.data.data);
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

  const book = (val) => () => {
    let inThreeHours = 0.125;

    Cookies.set("buildingName", val.Buildingname, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });
    Cookies.set("buildingId", val.Buildingid, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });
    Cookies.set("unit", val.Unit, {
      sameSite: "None",
      secure: true,
      expires: inThreeHours,
    });

    history.push("/edit-booking");
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

  const toIsoString = (date) => {
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

  useEffect(() => {
    getOldBooking();
    getOldVenue();
    venueSearch(); //populates list of venues from API
    getVenues(); //get venue details for filtering from API

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (startDate !== null) {
      setTempDate(startDate);
    } else {
      setTempDate(new Date());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  return (
    <>
      {Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Student" &&
      Cookies.get("oldBookingId") !== undefined &&
      Cookies.get("oldBuildingId") !== undefined &&
      Cookies.get("oldUnit") !== undefined ? (
        <Layout2
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Editing booking"
        >
          <div className="parent">
            <div className="home-page">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingRight: 20,
                }}
              >
                <div className="column">
                  {venueInfo === undefined || bookingInfo === undefined ? (
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
                    venueInfo.map((val, key) => {
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
                              <h3>Currently selected:</h3>
                            </div>
                            <div style={{ overflowY: "auto", height: 470 }}>
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
                <div>
                  <div className="searchbar">
                    <div
                      style={{
                        width: "auto",
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      <h3>Search for a venue:</h3>
                    </div>
                    <div className="stack-searchbar">
                      <div>
                        <div className="stack-searchbar">
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Autocomplete
                              id="free-solo-demo"
                              freeSolo
                              options={
                                venuesList === undefined
                                  ? []
                                  : venuesList
                                      .filter((dataName) =>
                                        dataName.Venuename.toLowerCase().includes(
                                          venueName.toLowerCase()
                                        )
                                      )
                                      .filter((dataBuilding) =>
                                        dataBuilding.Buildingname.toLowerCase().includes(
                                          buildingName.toLowerCase()
                                        )
                                      )
                                      .filter((dataUnit) =>
                                        dataUnit.Unit.toLowerCase().includes(
                                          unit.toLowerCase()
                                        )
                                      )
                                      .map((dataType) => dataType.Roomtypename)
                                      .filter(
                                        (item, i, s) =>
                                          s.lastIndexOf(item) === i
                                      )
                                      .sort()
                              }
                              onBlur={(e) => setVenueType(e.target.value)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Venue type"
                                  style={{
                                    width: 240,
                                    paddingBottom: 10,
                                    paddingRight: 10,
                                  }}
                                />
                              )}
                            />
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Autocomplete
                              id="free-solo-demo"
                              freeSolo
                              options={
                                venuesList === undefined
                                  ? []
                                  : venuesList
                                      .filter((dataType) =>
                                        dataType.Roomtypename.toLowerCase().includes(
                                          venueType.toLowerCase()
                                        )
                                      )
                                      .filter((dataBuilding) =>
                                        dataBuilding.Buildingname.toLowerCase().includes(
                                          buildingName.toLowerCase()
                                        )
                                      )
                                      .filter((dataUnit) =>
                                        dataUnit.Unit.toLowerCase().includes(
                                          unit.toLowerCase()
                                        )
                                      )
                                      .map((dataName) => dataName.Venuename)
                                      .filter(
                                        (item, i, s) =>
                                          s.lastIndexOf(item) === i
                                      )
                                      .sort()
                              }
                              onBlur={(e) => setVenueName(e.target.value)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Venue name "
                                  style={{
                                    width: 240,
                                    paddingBottom: 10,
                                    paddingRight: 10,
                                  }}
                                />
                              )}
                            />
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Autocomplete
                              id="free-solo-demo"
                              freeSolo
                              options={
                                venuesList === undefined
                                  ? []
                                  : venuesList
                                      .filter((dataName) =>
                                        dataName.Venuename.toLowerCase().includes(
                                          venueName.toLowerCase()
                                        )
                                      )
                                      .filter((dataType) =>
                                        dataType.Roomtypename.toLowerCase().includes(
                                          venueType.toLowerCase()
                                        )
                                      )
                                      .filter((dataUnit) =>
                                        dataUnit.Unit.toLowerCase().includes(
                                          unit.toLowerCase()
                                        )
                                      )
                                      .map(
                                        (dataBuilding) =>
                                          dataBuilding.Buildingname
                                      )
                                      .filter(
                                        (item, i, s) =>
                                          s.lastIndexOf(item) === i
                                      )
                                      .sort()
                              }
                              onBlur={(e) => setBuildingName(e.target.value)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Building"
                                  style={{
                                    width: 90,
                                    paddingBottom: 10,
                                    paddingRight: 10,
                                  }}
                                />
                              )}
                            />
                            <Autocomplete
                              id="free-solo-demo"
                              freeSolo
                              options={
                                venuesList === undefined
                                  ? []
                                  : venuesList
                                      .filter((dataName) =>
                                        dataName.Venuename.toLowerCase().includes(
                                          venueName.toLowerCase()
                                        )
                                      )
                                      .filter((dataType) =>
                                        dataType.Roomtypename.toLowerCase().includes(
                                          venueType.toLowerCase()
                                        )
                                      )
                                      .filter((dataBuilding) =>
                                        dataBuilding.Buildingname.toLowerCase().includes(
                                          buildingName.toLowerCase()
                                        )
                                      )
                                      .map((dataUnit) => dataUnit.Unit)
                                      .filter(
                                        (item, i, s) =>
                                          s.lastIndexOf(item) === i
                                      )
                                      .sort()
                              }
                              onBlur={(e) => setUnit(e.target.value)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Unit"
                                  style={{
                                    width: 100,
                                    paddingBottom: 10,
                                    paddingRight: 10,
                                  }}
                                />
                              )}
                            />
                            <FormControl style={{ width: 85 }}>
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
                                {Array.from({ length: 101 }, (v, i) => i).map(
                                  (val, key) => {
                                    if (val === 0) {
                                      return (
                                        <MenuItem value={val} key={key}>
                                          Default
                                        </MenuItem>
                                      );
                                    } else {
                                      return (
                                        <MenuItem value={val} key={key}>
                                          {val}
                                        </MenuItem>
                                      );
                                    }
                                  }
                                )}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <div className="stack-searchbar">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              paddingRight: 10,
                            }}
                          >
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              showTimeSelect
                              minDate={subDays(new Date(), 0)}
                              filterTime={filterStartTime}
                              timeFormat="HH:mm"
                              timeIntervals={60}
                              timeCaption="time"
                              dateFormat="MMMM d, yyyy h:mm aa"
                              placeholderText="Select start time"
                              isClearable
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              paddingRight: 10,
                            }}
                          >
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              showTimeSelect
                              minDate={subDays(tempDate, 0)}
                              filterTime={filterEndTime}
                              timeFormat="HH:mm"
                              timeIntervals={60}
                              timeCaption="time"
                              dateFormat="MMMM d, yyyy h:mm aa"
                              placeholderText="Select end time"
                              isClearable
                            />
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <FormControl style={{ width: 280 }}>
                              <InputLabel id="demo-mutiple-checkbox-label">
                                Select your equipment
                              </InputLabel>
                              <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                multiple
                                value={equipment}
                                onChange={handleEquipmentChange}
                                input={<Input />}
                                renderValue={(selected) => selected.join(", ")}
                              >
                                {equipmentList.map((name) => (
                                  <MenuItem key={name} value={name}>
                                    <Checkbox
                                      checked={equipment.indexOf(name) > -1}
                                    />
                                    <ListItemText primary={name} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: 110,
                          textAlign: "center",
                          alignSelf: "center",
                          paddingTop: 10,
                        }}
                      >
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          onClick={venueSearch}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="venue-list">
                    <div className="display-selected-venue-header">
                      <div style={{ textAlign: "center", alignSelf: "center" }}>
                        <h3>Select a venue:</h3>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div
                          style={{
                            width: 205,
                            textAlign: "center",
                            alignSelf: "center",
                          }}
                        >
                          Venue type{" "}
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
                        <div
                          style={{
                            width: 80,
                            textAlign: "center",
                            alignSelf: "center",
                          }}
                        >
                          {" "}
                        </div>
                      </div>
                    </div>
                    <div style={{ overflowY: "auto", height: 200 }}>
                      {searchResults === undefined ? (
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
                      ) : searchResults.length === 0 ? (
                        <div className="display-selected-venue">
                          <div
                            style={{ textAlign: "center", alignSelf: "center" }}
                          >
                            <h3>No details to display</h3>
                          </div>
                        </div>
                      ) : (
                        searchResults.map((val, key) => {
                          return (
                            <div key={key}>
                              <div className="display-selected-venue">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 205,
                                      textAlign: "center",
                                      alignSelf: "center",
                                    }}
                                  >
                                    {val.Roomtypename}{" "}
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
                                  <div
                                    style={{
                                      width: 80,
                                      textAlign: "center",
                                      alignSelf: "center",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-block"
                                      onClick={book(val)}
                                    >
                                      Book
                                    </button>
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

export default EditHome;

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from "@material-ui/core/styles";

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { Calendar, DateObject } from "react-multi-date-picker";

import moment from "moment";

import * as Cookies from "js-cookie";

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    menuPaper: {
      maxHeight: 200
    }
}));

function EditBooking() {

    let history = useHistory();

    const classes = useStyles();

    const [errorMessage, setErrorMessage] = useState();

    const [oldVenueInfo, setOldVenueInfo] = useState();
    const [venueInfo, setVenueInfo] = useState();

    const [date, setDate] = useState(new DateObject());
    const [capacity, setCapacity] = useState(0);

    const [timings, setTimings] = useState([]);
    const [availability, setAvailability] = useState();
    const [selected, setSelected] = useState();
    const [cart, setCart] = useState();

    const getOldVenue = () => {
        
        let search = new URLSearchParams();

        search.append("buildingName", Cookies.get("oldBuildingId"));
        search.append("unitNo", Cookies.get("oldUnit"));

        Axios.get(configData.LOCAL_HOST + "/search", 
        {
            params: search,
        }
        ).then(response => {
            // console.log(response.data.data[0]);
            setOldVenueInfo(response.data.data);
        }).catch((error) => {
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

        search.append("buildingName", Cookies.get("buildingId"));
        search.append("unitNo", Cookies.get("unit"));

        Axios.get(configData.LOCAL_HOST + "/search", 
        {
            params: search,
        }
        ).then(response => {
            // console.log(response.data.data[0]);
            setVenueInfo(response.data.data);
        }).catch((error) => {
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

    const handleDateChange = (selected) => { // changes current date based on selected date on calendar
        setDate(selected);
    };

    const handleCapacityChange = (event) => {
        setCapacity(event.target.value);
    };

    const handleCheckboxChange = (event) => {

        let selectedHour = Number(event.target.name.substring(4,6));

        let selectedStart = toIsoString(new Date(date.year, date.month.number - 1, date.day, selectedHour, 0, 0, 0));
        let selectedEnd = toIsoString(new Date(date.year, date.month.number - 1, date.day, selectedHour + 1, 0, 0, 0));

        if (event.target.checked) { // user selected checkbox
            addToCart(selectedStart, selectedEnd);
            setSelected({ ...selected, [event.target.name]: event.target.checked });
        } else { // user unselected checkbox
            removeFromCart(selectedStart, selectedEnd);
            setSelected({ ...selected, [event.target.name]: event.target.checked });
        }
    };

    const getTimings = () => { // get bookings for selected date

        // every capacity/date change should call this API

        let search = new URLSearchParams();

        let eventStart = new Date(date.year, date.month.number - 1, date.day, 0, 0, 0, 0);
        let eventEnd = new Date(date.year, date.month.number - 1, date.day + 1, 0, 0, 0, 0);

        search.append("eventStart", toIsoString(eventStart));
        search.append("eventEnd", toIsoString(eventEnd));
        search.append("buildingName", Cookies.get("buildingName"));
        search.append("unitNo", Cookies.get("unit"));
        search.append("pax", capacity);
        
        Axios.get(configData.LOCAL_HOST + "/timings", 
        {
            params: search,
        }
        ).then(response => { 
            setTimings(response.data.data);
        }).catch((error) => {
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
        let availabilityState = {};
        let selectedState = {};
        for (let i = 0; i < timings.length; i++) {
            let key = "";
            key = "time" + timings[i].EventStart.substring(11,13).toString() + "00";
            availabilityState[key] = timings[i].Available;
            selectedState[key] = false;
        }

        setAvailability(availabilityState);
        setSelected(selectedState);

        // check against cart and set selected as necessary
        if (cart !== undefined) {
            for (let i = 0; i < cart.length; i++) {
                if (date.format("MM/DD/YYYY") === moment(cart[i].Eventstart.substring(0,13), 'YYYY-MM-DDThh').format('MM/DD/YYYY')) { // if current date = date in cart
                    let key = "";
                    key = "time" + cart[i].Eventstart.substring(11,13).toString() + "00";
                    selectedState[key] = true;
                }
            }
        }
    }

    const getCartItems = () => { // whenever the user changes date or capacity
        
        let search = new URLSearchParams();

        search.append("NUSNET_ID", Cookies.get("id"));
        
        Axios.get(configData.LOCAL_HOST + "/get_pending_booking", 
        {
            params: search,
        }
        ).then(response => { 
            setCart(response.data.data);
        }).catch((error) => {
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

    const addToCart = (start, end) => { // whenever the user checks a checkbox

        if (cart !== undefined) {
            let changeInCapacity = false;
            for (let i = 0; i < cart.length; i++) {
                if (capacity !== cart[i].Pax) {
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
        
        Axios.post(configData.LOCAL_HOST + "/make_pending_booking", [data]).then(response => {
            getCartItems();
        }).catch((error) => {
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

    const removeFromCart = (start, end) => { // whenever the user unchecks a checkbox

        for (let i = 0; i < cart.length; i++) {
            if (start.substring(0,13) === cart[i].Eventstart.substring(0,13)) {
                let search = new URLSearchParams();

                search.append("bookingID", cart[i].Bookingid);
                
                Axios.delete(configData.LOCAL_HOST + "/delete_bookings", 
                {
                    params: search,
                }
                ).then(response => { 
                    getCartItems();
                }).catch((error) => {
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
    
    const removeTimeslot = (value) => () => { // removes selected timeslot

        let search = new URLSearchParams();
        search.append("bookingID", value.Bookingid);               

        Axios.delete(configData.LOCAL_HOST + "/delete_bookings", 
        {
            params: search,
        }
        ).then(response => { 
            getCartItems();
        }).catch((error) => {
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
        if (cart !== undefined) {
            let search = new URLSearchParams();
            for (let i = 0; i < cart.length; i++) {

                search.append("bookingID", cart[i].Bookingid);               
                
            }
            Axios.delete(configData.LOCAL_HOST + "/delete_bookings", 
            {
                params: search,
            }
            ).then(response => { 
                getCartItems();
            }).catch((error) => {
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
        } 
    };

    const checkoutCart = () => {
        if (cart !== undefined) {
            history.push("/edit-overview");       
        }
    };
    
    const DisplayTimings = () => { // displays checkboxes for users to select timeslots

        return (
            <div>
                <div style={{overflowY: "auto", height: 200}}>            
                    <FormGroup>
                        {availability === undefined || timings.length === 0
                            ? "Loading..." 
                            : Object.entries(availability).map((val, key) => {
                                if (capacity === 0 || date.format("MM/DD/YYYY") === moment().format('MM/DD/YYYY')) {
                                    return <FormControlLabel disabled control={<Checkbox checked={selected[val[0]]} onChange={handleCheckboxChange} name={val[0]} />} label={formatter(val[0])} key={key} />;
                                } else if (val[1]) {
                                    return <FormControlLabel control={<Checkbox checked={selected[val[0]]} onChange={handleCheckboxChange} name={val[0]} />} label={formatter(val[0])} key={key} />;
                                } else {
                                    return <FormControlLabel disabled control={<Checkbox checked={selected[val[0]]} onChange={handleCheckboxChange} name={val[0]} />} label={formatter(val[0])} key={key} />;
                                }
                            })
                        }
                    </FormGroup>
                </div>
                {/* Loading... */}
                <div className="error">
                    <span className="message">{errorMessage}</span>
                </div>
            </div>
        );
    };  

    const formatter = (timing) => {

        let start = Number(timing.substring(4, 6));
        let end = Number(timing.substring(4, 6)) + 1;

        if (start < 11) {
            return start + ":" + timing.substring(6, 9) + " am to " + end + ":" + timing.substring(6, 9) + " am";
        } else if (start === 11) {
            return start + ":" + timing.substring(6, 9) + " am to " + end + ":" + timing.substring(6, 9) + " pm";
        } else if (start === 12) {
            return start + ":" + timing.substring(6, 9) + " pm to " + (end - 12) + ":" + timing.substring(6, 9) + " pm";
        } else {
            return (start - 12) + ":" + timing.substring(6, 9) + " pm to " + (end - 12) + ":" + timing.substring(6, 9) + " pm";
        }
        
    };

    const toIsoString = (date) => {
        let tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                var norm = Math.floor(Math.abs(num));
                return (norm < 10 ? '0' : '') + norm;
            };
      
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);
    };

    const dateConverter = (givenDate) => {

        let endHour = Number(givenDate.substring(11,13)) + 1;
        let tempDate = givenDate.substring(0, 13);

        return moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a') + " to " + moment(endHour, 'hh').format('h:mm a');
    };

    useEffect(() => {
        getOldVenue();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        venueSearch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
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
        if (date.format("MM/DD/YYYY") === moment().format('MM/DD/YYYY')) {
            setErrorMessage("Please select a date!");
        } else if (capacity > 1) {
            setErrorMessage("");
        } else if (availability !== undefined && timings.length !== 0) {
            setErrorMessage("Please select a capacity!");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [capacity, availability, timings]);

    useEffect(() => {
        populateCheckbox();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timings]);

    useEffect(() => {
        populateCheckbox();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart]);

    return (
        <>
            {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined
                ? <Layout2 id={Cookies.get("id")} name={Cookies.get("name")} action="Make a new booking">
                        <div className="parent">
                            <div className="home-page">
                                <div style={{display: 'flex', flexDirection: 'row', paddingRight: 20}}>
                                    <div className="column">
                                        {oldVenueInfo === undefined ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> : oldVenueInfo.map((val, key) => {
                                            return (<div key={key}>
                                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                                    <div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}><h3>Currently selected:</h3></div>
                                                    <div style={{overflowY: "auto", height: 440}}>
                                                        <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Venue type </div></div>
                                                        <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Roomtypename} </div></div>
                                                        <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Venue name </div></div>
                                                        <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div></div>
                                                        <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Location </div></div>
                                                        <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div></div>
                                                        <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Max capacity </div></div>
                                                        <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Maxcapacity} </div></div>
                                                        <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Equipment </div></div>
                                                        <div className="display-old"><div style={{display: 'flex', width: 220, textAlign: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                                                            {val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}
                                                            <br />{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}
                                                            <br />{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}
                                                            <br />{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}
                                                        </div></div>
                                                    </div>
                                                </div>
                                            </div>);
                                        })}
                                    </div>
                                    <div>
                                        <div className="booking-selector">
                                            <div className="display-selected-venue-header">
                                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                                    <div style={{width: 240, textAlign: 'center', alignSelf: 'center'}}>Venue type </div>
                                                    <div style={{width: 260, textAlign: 'center', alignSelf: 'center'}}>Venue name </div>
                                                    <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>Location </div>
                                                    <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Max capacity </div>
                                                    <div style={{width: 120, textAlign: 'center', alignSelf: 'center'}}>Equipment </div>
                                                </div>
                                            </div>
                                            {venueInfo === undefined ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> : venueInfo.map((val, key) => {
                                                return (<div key={key}>
                                                    <div className="display-selected-venue" style={{height: 'auto'}}>
                                                        {/* <div style={{display: 'flex', flexDirection: 'row'}}>
                                                            <div style={{width: 240, textAlign: 'center', alignSelf: 'center'}}>{Cookies.get("venueType")} </div>
                                                            <div style={{width: 260, textAlign: 'center', alignSelf: 'center'}}>{Cookies.get("venueName")} </div>
                                                            <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>{Cookies.get("buildingName")} {Cookies.get("unit")} </div>
                                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{Cookies.get("capacity")} </div>
                                                            <div style={{display: 'flex', width: 120, textAlign: 'center', alignSelf: 'center'}}>
                                                                <br />{(Cookies.get("projector") === "undefined" || Cookies.get("projector") === undefined) ? "" : Cookies.get("projector") === 1 ? Cookies.get("projector") + " projector" : Cookies.get("projector") + " projectors"}
                                                                <br />{(Cookies.get("screen") === "undefined" || Cookies.get("screen") === undefined) ? "" : Cookies.get("screen") === 1 ? Cookies.get("screen") + " screen" : Cookies.get("screen") + " screens"}
                                                                <br />{(Cookies.get("desktop") === "undefined" || Cookies.get("desktop") === undefined) ? "" : Cookies.get("desktop") === 1 ? Cookies.get("desktop") + " desktop" : Cookies.get("desktop") + " desktops"}
                                                                <br />{(Cookies.get("whiteboard") === "undefined" || Cookies.get("whiteboard") === undefined) ? "" : Cookies.get("whiteboard") === 1 ? Cookies.get("whiteboard") + " whiteboard" : Cookies.get("whiteboard") + " whiteboards"}
                                                            </div>
                                                        </div> */}
                                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                                            <div style={{width: 240, textAlign: 'center', alignSelf: 'center'}}>{val.Roomtypename} </div>
                                                            <div style={{width: 260, textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div>
                                                            <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div>
                                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Maxcapacity} </div>
                                                            <div style={{display: 'flex', width: 120, textAlign: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                                                                {val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}
                                                                <br />{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}
                                                                <br />{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}
                                                                <br />{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>);
                                            })}
                                            <div style={{float: 'left'}}>
                                                <FormControl style={{width: 85}} className={classes.formControl}>
                                                    <InputLabel id="demo-simple-select-label">Capacity</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={capacity === 0 ? "" : capacity}
                                                        onChange={handleCapacityChange}
                                                        input={<Input />}
                                                        MenuProps={{ classes: { paper: classes.menuPaper } }}
                                                    >
                                                    {venueInfo === undefined ? null : Array.from({length: venueInfo[0].Maxcapacity + 1}, (v, i) => i).map((val, key) => {
                                                        if (val === 0) {
                                                            return <MenuItem value={val} key={key}>Please select</MenuItem>;
                                                        } else {
                                                            return <MenuItem value={val} key={key}>{val}</MenuItem>;
                                                        }
                                                    })}
                                                    </Select>
                                                </FormControl>

                                                <Calendar 
                                                    mapDays={({ date }) => {
                                                        let currentTime = new DateObject();
                                                        
                                                        if (date < currentTime) return {
                                                        disabled: true,
                                                        style: { color: "#ccc" },
                                                        onClick: () => alert("Date has already passed!")
                                                        }
                                                    }}
                                                    value={date}
                                                    onChange={handleDateChange}
                                                    format="DD/MM/YYYY HH:mm"
                                                    plugins={[
                                                        <DisplayTimings />, 
                                                    ]}                                   
                                                >
                                                </Calendar>
                                            </div>
                                            <div style={{float: 'left', height: 300, width: 550, paddingLeft: 20}}><div style={{textAlign: 'center'}}>Currently selected Timeslots:</div>
                                                <div style = {{overflowY: "auto", height: 250}}>
                                                    {cart === undefined ? "" : cart.map((val, key) => {
                                                        return (<div key={key}>
                                                            <hr />
                                                            <div style={{height: 32, position:'relative'}}>
                                                                <div style = {{paddingLeft: 3, paddingTop: 4}}>Pax: {val.Pax} | Timing: {dateConverter(val.Eventstart)}</div>
                                                                <button style={{position: 'absolute', top: 0, right: 0}} type="submit" className="btn btn-primary btn-sm" onClick={removeTimeslot(val)}>Remove</button>
                                                            </div>
                                                        </div>);
                                                    })}
                                                </div>
                                                <br />
                                                <button style={{float: 'left'}} type="submit" className="btn btn-primary btn-block" onClick={removeAllFromCart}>Clear timeslots</button>
                                                <button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={checkoutCart}>Checkout</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Layout2>
                : <Unauthorised />
            }
        </>
    );
}

export default EditBooking;
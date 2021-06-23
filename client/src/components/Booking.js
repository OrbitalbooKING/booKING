import { useState, useEffect } from "react";
import history from "../history";
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

function Booking(props) {

    const classes = useStyles();

    const [date, setDate] = useState(new DateObject());

    const [capacity, setCapacity] = useState(0);  

    const [errorMessage, setErrorMessage] = useState("Please select a capacity!");

    const [timings, setTimings] = useState([]);

    const getTimings = () => { // get bookings for selected date

        // every capacity/date change should call this API

        let search = new URLSearchParams();

        let eventStart = new Date(date.year, date.month.number - 1, date.day, 0, 0, 0, 0);
        let eventEnd = new Date(date.year, date.month.number - 1, date.day + 1, 0, 0, 0, 0);

        search.append("eventStart", toIsoString(eventStart));
        search.append("eventEnd", toIsoString(eventEnd));
        search.append("buildingName", props.location.state.buildingName);
        search.append("unitNo", props.location.state.unit);
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

    useEffect(() => {
        getTimings();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    useEffect(() => {
        getTimings();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [capacity]);

    useEffect(() => {
        populateCheckbox();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timings]);

    const [availability, setAvailability] = useState();

    const [selected, setSelected] = useState();

    const [cart, setCart] = useState();

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

        search.append("NUSNET_ID", props.location.state.id);
        
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

    useEffect(() => {
        getCartItems();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        populateCheckbox();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart]);

    useEffect(() => {
        if (capacity > 1) {
            setErrorMessage("");
        } else {
            setErrorMessage("Please select a capacity!");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [capacity]);
    
    
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
        data["NUSNET_ID"] = props.location.state.id;
        data["unitNo"] = props.location.state.unit;
        data["buildingName"] = props.location.state.buildingName;
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
                
                Axios.delete(configData.LOCAL_HOST + "/delete_pending_booking", 
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

    const removeAllFromCart = () => {
        if (cart !== undefined) {
            let search = new URLSearchParams();
            for (let i = 0; i < cart.length; i++) {

                search.append("bookingID", cart[i].Bookingid);               
                
            }
            Axios.delete(configData.LOCAL_HOST + "/delete_pending_booking", 
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
            history.push({
                pathname: "/booking-overview",
                state: { 
                    id: props.location.state.id,
                    venueType: props.location.state.venueType,
                    venueName: props.location.state.venueName,
                    buildingName: props.location.state.buildingName,
                    unit: props.location.state.unit,
                    capacity: props.location.state.capacity,
                    equipment: props.location.state.equipment
                }
            });
        }
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

    const DisplayTimings = () => { // displays checkboxes for users to select timeslots

        return (
            <div>
                <div style={{overflowY: "auto", height: 200}}>            
                    <FormGroup>
                        {availability === undefined
                            ? "Loading..." 
                            : Object.entries(availability).map((val, key) => {
                                if (capacity === 0) {
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
                <div className="error">
                    <span className="message">{errorMessage}</span>
                </div>
            </div>
        );
    };      

    const removeTimeslot = (value) => () => { // removes selected timeslot

        let search = new URLSearchParams();
        search.append("bookingID", value.Bookingid);               

        Axios.delete(configData.LOCAL_HOST + "/delete_pending_booking", 
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

    return (
        <>
            {props.location.state !== undefined 
                ? <Layout2 id={props.location.state.id} action="Make a booking">
                        <div className="parent">
                            <div className="home-page">
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
                                    <div className="display-selected-venue" style={{height: 'auto'}}>
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            <div style={{width: 240, textAlign: 'center', alignSelf: 'center'}}>{props.location.state.venueType} </div>
                                            <div style={{width: 260, textAlign: 'center', alignSelf: 'center'}}>{props.location.state.venueName} </div>
                                            <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>{props.location.state.buildingName} {props.location.state.unit} </div>
                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{props.location.state.capacity} </div>
                                            <div style={{display: 'flex', width: 120, textAlign: 'center', alignSelf: 'center'}}>
                                                <br />{props.location.state.equipment.Projector === undefined ? "" : props.location.state.equipment.Projector === 1 ? props.location.state.equipment.Projector + " projector" : props.location.state.equipment.Projector + " projectors"}
                                                <br />{props.location.state.equipment.Screen === undefined ? "" : props.location.state.equipment.Screen === 1 ? props.location.state.equipment.Screen + " screen" : props.location.state.equipment.Screen + " screens"}
                                                <br />{props.location.state.equipment.Desktop === undefined ? "" : props.location.state.equipment.Desktop === 1 ? props.location.state.equipment.Desktop + " desktop" : props.location.state.equipment.Desktop + " desktops"}
                                                <br />{props.location.state.equipment.Whiteboard === undefined ? "" : props.location.state.equipment.Whiteboard === 1 ? props.location.state.equipment.Whiteboard + " whiteboard" : props.location.state.equipment.Whiteboard + " whiteboards"}
                                            </div>
                                        </div>
                                    </div>
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
                                            {Array.from({length: props.location.state.capacity + 1}, (v, i) => i).map((val, key) => {
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
                                                onClick: () => alert("date has already passed!")
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
                    </Layout2>
                : <Unauthorised />
            }
        </>
    );
}

export default Booking;
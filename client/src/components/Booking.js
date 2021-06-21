// import { useState, useEffect } from "react";
// import history from "../history";
// import Axios from "axios";
// import configData from "../config.json";
// import Layout2 from "../layouts/Layout2";
// import Unauthorised from "./Unauthorised";

// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import Checkbox from '@material-ui/core/Checkbox';

// import { makeStyles } from "@material-ui/core/styles";

// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';

// import { Calendar, DateObject } from "react-multi-date-picker";

// import moment from "moment";


// const style = {
//     padding: 5
// };

// const useStyles = makeStyles(theme => ({
//     formControl: {
//       margin: theme.spacing(1),
//       minWidth: 120
//     },
//     selectEmpty: {
//       marginTop: theme.spacing(2)
//     },
//     menuPaper: {
//       maxHeight: 200
//     }
// }));

// function Booking(props) {

//     const classes = useStyles();

//     const [date, setDate] = useState(new DateObject());

//     const [searchResults, setSearchResults] = useState();
//     const [capacity, setCapacity] = useState(0);  
       
//     const [operatingHours, setOperatingHours] = useState([]);
//     const [timeslots, setTimeslots] = useState([]);
//     const [tempTimings, setTempTimings] = useState([]);

//     const [errorMessage, setErrorMessage] = useState("");

//     const [state, setState] = useState({});
//     const [remainingCapacity, setRemainingCapacity] = useState();

//     const getTimings = () => { // get bookings for selected date

//         let search = new URLSearchParams();

//         let eventStart = new Date(date.year, date.month.number - 1, date.day, 0, 0, 0, 0);
//         let eventEnd = new Date(date.year, date.month.number - 1, date.day + 1, 0, 0, 0, 0);

//         search.append("eventStart", toIsoString(eventStart));
//         search.append("eventEnd", toIsoString(eventEnd));
//         search.append("buildingName", props.location.state.buildingName);
//         search.append("unitNo", props.location.state.unit);
        
//         Axios.get(configData.LOCAL_HOST + "/timings", 
//         {
//             params: search,
//         }
//         ).then(response => { 
//             setSearchResults(response.data.data);
//         }).catch((error) => {
//             if (error.response.status === 400) {
//                 console.log(error.response.data.message);
//             } else {
//                 console.log("Query failed!");
//             }
//         });
//     };

//     const getOperatingHours = () => { // get operating hours + remaining capacity for selected date

//         if (searchResults !== undefined) {

//             if (searchResults[0] !== undefined) { // if there are bookings for selected date

//                 let startTime = Number(searchResults[0].Starthour.substring(11,13));
//                 let endTime = Number(searchResults[0].Endhour.substring(11,13));

//                 let tempOperatingHours = Array.from({length: (endTime - startTime) / 1}, (_, i) => startTime + (i * 1));

//                 setOperatingHours(tempOperatingHours);
//                 setState(initObj(tempOperatingHours, false));

//                 let bookedHours = Array.from({length: (endTime - startTime) / 1}, (_, i) => startTime + (i * 1));
//                 let hourlyCapacity = initObj(bookedHours, props.location.state.capacity);
                
//                 for (let i = 0; i < searchResults.length; i++) {
//                     let key = "";
//                     if (searchResults[i].Eventstart.substring(11,13) < 10) {
//                             key = "time0" + searchResults[i].Eventstart.substring(11,13).toString() + "00";
//                     } else {
//                             key = "time" + searchResults[i].Eventstart.substring(11,13).toString() + "00";
//                     }
//                     hourlyCapacity[key] = hourlyCapacity[key] - searchResults[i].Pax;
//                 }

//                 setRemainingCapacity(hourlyCapacity);

//             } else { // if there are no bookings for selected date, only operating hours will be given and initialiased

//                 let startTime = Number(searchResults.Starthour.substring(11,13));
//                 let endTime = Number(searchResults.Endhour.substring(11,13));

//                 let tempOperatingHours = Array.from({ length: (endTime - startTime) / 1}, (_, i) => startTime + (i * 1));

//                 setOperatingHours(tempOperatingHours);
//                 setState(initObj(tempOperatingHours, false));

//                 let bookedHours = Array.from({ length: (endTime - startTime) / 1}, (_, i) => startTime + (i * 1));
//                 let hourlyCapacity = initObj(bookedHours, props.location.state.capacity);
                
//                 let key = "";
//                 if (searchResults.Eventstart.substring(11,13) < 10) {
//                     key = "time0" + searchResults.Eventstart.substring(11,13).toString() + "00";
//                 } else {
//                     key = "time" + searchResults.Eventstart.substring(11,13).toString() + "00";
//                 }
//                 hourlyCapacity[key] = hourlyCapacity[key] - searchResults.Pax;

//                 setRemainingCapacity(hourlyCapacity);

//             }
//         }
//     };

//     const populateTimings = () => {

//         if (operatingHours !== []) {

//             if (timeslots.length > 0) { // if user has already selected some timeslots

//                 for (let i = 0; i < timeslots.length; i++) {

//                     let newDate = new Date(date.year, date.month.number - 1, date.day, 0, 0, 0, 0);

//                     if (moment(timeslots[i].date).format("MM/DD/YYYY") === moment(newDate).format("MM/DD/YYYY")) {
//                         setTempTimings(prevTimings => [...prevTimings, timeslots[i].date.getHours()]); // copy selected timeslots to new array
//                     } 
//                 }
//             } else {
//                 setState(initObj(operatingHours, false));
//             }
//         }
//     };

//     const initObj = (array, state) => { // initialises array to object based on given state (can be boolean/value)

//         let newState = {};
        
//         for (let i = 0; i < array.length; i++) {
//             let key = "";
//             if (array[i] < 10) {
//                  key = "time0" + array[i].toString() + "00";
//             } else {
//                  key = "time" + array[i].toString() + "00";
//             }
//             newState[key] = state;
//         }
//         return newState;
//     };

//     const arrToTrue = (array) => { // initialises array to object of true values

//         let newState = initObj(operatingHours, false); // sets whole object to false

//         for (let i = 0; i < array.length; i++) { // replace certain items with true depending on given array
//             let key = "";
//             if (array[i] < 10) {
//                  key = "time0" + array[i].toString() + "00";
//             } else {
//                  key = "time" + array[i].toString() + "00";
//             }
//             newState[key] = true;
//         }
//         return newState;
//     };

//     const handleDateChange = (selected) => { // changes current date based on selected date on calendar
//         setDate(selected);
//     };

//     const handleCapacityChange = (event) => {
//         setCapacity(event.target.value);
//     };

//     const handleCheckboxChange = (event) => {
//         setState({ ...state, [event.target.name]: event.target.checked });
//     };

    

//     const select = () => {

//         if (timeslots !== undefined) {
//             for (let i = 0; i < timeslots.length; i++) {
//                 if (capacity !== timeslots[i].capacity) {
//                     setTimeslots([]);
//                     continue;
//                 }
//             }
//         }

//         if (state !== undefined && capacity > 0) {

//             for (let [key, value] of Object.entries(state)) { //loop through the states (timeXXXX - timeYYYY)

//                 if (value) {

//                     let newHour = key.substring(4, 6);
//                     let newDate = new Date(date.year, date.month.number - 1, date.day, newHour, 0, 0, 0);

//                     if (timeslots.length > 0) { // if user has already selected some timeslots

//                         let exists = false;
//                         for (let i = 0; i < timeslots.length; i++) {
                            
//                             if (moment(timeslots[i].date).format("MMMM Do YYYY, h:mm:ss a") === moment(newDate).format("MMMM Do YYYY, h:mm:ss a")) { // checks for duplicates in current state and selected timeslots
//                                 exists = true;
//                             }
//                         }
//                         if (!exists) { // selected state not inside selected timeslots
//                             let tempObj = {
//                                 "date": newDate,
//                                 "capacity": capacity,
//                             };
//                             setTimeslots(prevTimeslots => [...prevTimeslots, tempObj]); // adds state + capacity to timeslots
//                         }
//                     } else { // selected timeslots is empty
//                         let tempObj = {
//                             "date": newDate,
//                             "capacity": capacity,
//                         };
//                         setTimeslots(prevTimeslots => [...prevTimeslots, tempObj]); // adds state + capacity to timeslots
//                     }
//                 } else {

//                     let newHour = key.substring(4, 6);
//                     let newDate = new Date(date.year, date.month.number - 1, date.day, newHour, 0, 0, 0);

//                     if (timeslots.length > 0) {
//                         for (let i = 0; i < timeslots.length; i++) {
//                             if (moment(timeslots[i].date).format("MMMM Do YYYY, h:mm:ss a") === moment(newDate).format("MMMM Do YYYY, h:mm:ss a")) { // checks if previously selected states were removed
//                                 let newTimeslots = timeslots.filter((item) => moment(item.date).format("MMMM Do YYYY, h:mm:ss a") !== moment(newDate).format("MMMM Do YYYY, h:mm:ss a"));
//                                 setTimeslots(newTimeslots);
//                             }
//                         }                    
//                     }
//                 }
//             }
//         } else if (capacity === 0) { // invalid selection
//             setErrorMessage("Please choose a capacity!");
//         }
//     };

//     const deselect = () => { // removes all selections
//         setDate(new DateObject());
//         setCapacity(0);
//         setTempTimings([]);
//         setTimeslots([]);
//     };

//     const DisplayTimings = () => { // displays checkboxes for users to select timeslots

//         return (
//             <div>
//                 <div style={{overflowY: "auto", height: 200}}>            
//                     <FormGroup>
//                         {state === undefined && remainingCapacity === undefined 
//                             ? "Loading..." 
//                             : Object.entries(state).map((val, key) => {

//                                 if (date.format("MM/DD/YYYY") < moment(new Date()).format("MM/DD/YYYY")) { // selected date has past

//                                     return <FormControlLabel disabled control={<Checkbox checked={val[1]} onChange={handleCheckboxChange} name={val[0]} />} label={formatter(val[0])} key={key} />;

//                                 } else if (date.format("MM/DD/YYYY") === moment(new Date()).format("MM/DD/YYYY")) { // selected date is today's date

//                                     if (new Date().getHours() + 1 >= val[0].substring(4,6)) { // blocks out timeslots less than 1 hour in the future

//                                         return <FormControlLabel disabled control={<Checkbox checked={val[1]} onChange={handleCheckboxChange} name={val[0]} />} label={formatter(val[0])} key={key} />;

//                                     } else {

//                                         return <FormControlLabel control={<Checkbox checked={val[1]} onChange={handleCheckboxChange} name={val[0]} />} label={formatter(val[0])} key={key} />;

//                                     }
//                                 } else if (capacity <= remainingCapacity[val[0]] && capacity !== 0) {

//                                     return <FormControlLabel control={<Checkbox checked={val[1]} onChange={handleCheckboxChange} name={val[0]} />} label={formatter(val[0])} key={key} />;

//                                 } else { // either capacity chosen > remaining capacity or capacity is not specified

//                                     return <FormControlLabel disabled control={<Checkbox checked={val[1]} onChange={handleCheckboxChange} name={val[0]} />} label={formatter(val[0])} key={key} />;

//                                 }
//                             })
//                         }
//                     </FormGroup>
//                 </div>
//                 <div className="error">
//                     <span className="message">{errorMessage}</span>
//                 </div>
//                 <button onClick={select}>SELECT</button>
//             </div>
//             );
//     };      

//     const submitBooking = () => { // submit selected timeslots

//         let tempArr = [];
        
//         for (let i = 0; i < timeslots.length; i++) {
//             let tempObj = {
//                 "NUSNET_ID": props.location.state.id,
//                 "unitNo": props.location.state.unit,
//                 "buildingName":props.location.state.buildingName,
//                 "pax": timeslots[i].capacity,
//                 "eventStart": toIsoString(timeslots[i].date),
//                 "eventEnd": toIsoString(new Date(timeslots[i].date.getFullYear(), timeslots[i].date.getMonth(), timeslots[i].date.getDate(), timeslots[i].date.getHours() + 1, 0, 0, 0))
//             };
//             tempArr.push(tempObj);
//         }
//         console.log(tempArr);

//         // Axios.post(configData.LOCAL_HOST + "/make_booking", tempArr).then(response => { 
//         //     console.log(response);
//         //     history.push({
//         //         pathname: "/booking-success",
//         //         state: { 
//         //             id: props.location.state.id
//         //         }
//         //     });
//         // }).catch((error) => {
//         //     if (error.response.status === 400) {
//         //         console.log(error.response.data.message);
//         //     } else {
//         //         console.log("Query failed!");
//         //     }
//         // });      
//     };

//     const removeTimeslot = (value) => () => { // removes selected timeslot

//         if (date.format("MM/DD/YYYY") === moment(value).format("MM/DD/YYYY")) {
//             let key = "";
//             if (value.getHours() < 10) {
//                 key = "time0" + value.getHours() + "00";
//            } else {
//                 key = "time" + value.getHours() + "00";
//            }
//            setState({...state, [key]: false}); // sets removed timeslot to false if it is the currently selected date
//         }
//         setTimeslots(timeslots.filter(item => item.date !== value)); // remove timeslot
//     };

//     const converter = (timing) => {
//         if (timing < 11) {
//             return (timing + 1) + ":00 am"
//         } else if (timing === 11) {
//             return "12:00 pm"
//         } else {
//             return (timing - 11) + ":00 pm"
//         }
//     };

//     const formatter = (timing) => {

//         let start = Number(timing.substring(4, 6));
//         let end = Number(timing.substring(4, 6)) + 1;

//         if (start < 11) {
//             return start + ":" + timing.substring(6, 9) + " am to " + end + ":" + timing.substring(6, 9) + " am";
//         } else if (start === 11) {
//             return start + ":" + timing.substring(6, 9) + " am to " + end + ":" + timing.substring(6, 9) + " pm";
//         } else if (start === 12) {
//             return start + ":" + timing.substring(6, 9) + " pm to " + (end - 12) + ":" + timing.substring(6, 9) + " pm";
//         } else {
//             return (start - 12) + ":" + timing.substring(6, 9) + " pm to " + (end - 12) + ":" + timing.substring(6, 9) + " pm";
//         }
        
//     };

//     const toIsoString = (date) => {
//         let tzo = -date.getTimezoneOffset(),
//             dif = tzo >= 0 ? '+' : '-',
//             pad = function(num) {
//                 var norm = Math.floor(Math.abs(num));
//                 return (norm < 10 ? '0' : '') + norm;
//             };
      
//         return date.getFullYear() +
//             '-' + pad(date.getMonth() + 1) +
//             '-' + pad(date.getDate()) +
//             'T' + pad(date.getHours()) +
//             ':' + pad(date.getMinutes()) +
//             ':' + pad(date.getSeconds()) +
//             dif + pad(tzo / 60) +
//             ':' + pad(tzo % 60);
//     };

//     useEffect(() => {
//         select();

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [timeslots]);

//     useEffect(() => {
//         setTempTimings([]);
//         getTimings();
        
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [date]);

//     useEffect(() => {
//         setState(arrToTrue(tempTimings));

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [tempTimings]);

//     useEffect(() => {
//         getOperatingHours();

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [searchResults]);

//     useEffect(() => {
//         populateTimings();

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [operatingHours]);

//     useEffect(() => {
//         console.log(timeslots);

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [timeslots]);

//     useEffect(() => {
//         if (capacity > 0) {
//             setErrorMessage("");
//         } else {
//             setErrorMessage("Please choose a capacity!");
//         }

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [capacity]);

//     useEffect(() => {
//         console.log(searchResults);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [searchResults]);
    
//     return (
//         <div className="auth-wrapper">
//             {props.location.state !== undefined 
//                 ? <div>
//                     <Layout2 id={props.location.state.id} action="Make a booking">
//                         <div className="calendar">
//                             <div style={{height: 48}}>
//                                 <div style={{display: 'inline-block', width: 355, textAlign: 'center', position: 'relative'}}>Venue type </div>
//                                 <div style={{display: 'inline-block', width: 200, textAlign: 'center', position: 'relative'}}>Venue name </div>
//                                 <div style={{display: 'inline-block', width: 160, textAlign: 'center', position: 'relative'}}>Location </div>
//                                 <div style={{display: 'inline-block', width: 70, textAlign: 'center'}}>Max capacity </div>
//                                 <div style={{display: 'inline-block', paddingLeft: 15, position: 'relative'}}> Equipment available </div>
//                             </div>
//                             <br />
//                             <div className="display-venues" style={{height: 'auto'}}>
//                                 <div style={{display: 'inline-block', paddingRight: 20}}>
//                                     <div style={{float: 'left', width: 240, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{props.location.state.venueType} </div>
//                                     <div style={{float: 'left', width: 260, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{props.location.state.venueName} </div>
//                                     <div style={{float: 'left', width: 150, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{props.location.state.buildingName} {props.location.state.unit} </div>
//                                     <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{props.location.state.capacity} </div>
//                                     <div style={{display: 'inline-flex'}}> 
//                                         <br />{props.location.state.equipment.Projector === undefined ? "" : props.location.state.equipment.Projector === 1 ? props.location.state.equipment.Projector + " projector" : props.location.state.equipment.Projector + " projectors"}
//                                         <br />{props.location.state.equipment.Screen === undefined ? "" : props.location.state.equipment.Screen === 1 ? props.location.state.equipment.Screen + " screen" : props.location.state.equipment.Screen + " screens"}
//                                         <br />{props.location.state.equipment.Desktop === undefined ? "" : props.location.state.equipment.Desktop === 1 ? props.location.state.equipment.Desktop + " desktop" : props.location.state.equipment.Desktop + " desktops"}
//                                         <br />{props.location.state.equipment.Whiteboard === undefined ? "" : props.location.state.equipment.Whiteboard === 1 ? props.location.state.equipment.Whiteboard + " whiteboard" : props.location.state.equipment.Whiteboard + " whiteboards"}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div style=
//                             // {{display: 'inline-block'}}
//                             {{float: 'left'}}
//                             >
//                                 <FormControl style={{width: 85}} className={classes.formControl}>
//                                     <InputLabel id="demo-simple-select-label">Capacity</InputLabel>
//                                     <Select
//                                         labelId="demo-simple-select-label"
//                                         id="demo-simple-select"
//                                         value={capacity === 0 ? "" : capacity}
//                                         onChange={handleCapacityChange}
//                                         input={<Input />}
//                                         MenuProps={{ classes: { paper: classes.menuPaper } }}
//                                     >
//                                     {Array.from({length: props.location.state.capacity + 1}, (v, i) => i).map((val, key) => {
//                                         if (val === 0) {
//                                             return <MenuItem value={val} key={key}>Please select</MenuItem>;
//                                         } else {
//                                             return <MenuItem value={val} key={key}>{val}</MenuItem>;
//                                         }
//                                     })}
//                                     </Select>
//                                 </FormControl>

//                                 <Calendar 
//                                     value={date}
//                                     onChange={handleDateChange}
//                                     format="DD/MM/YYYY HH:mm"
//                                     plugins={[
//                                         <DisplayTimings />, 
//                                     ]}                                   
//                                 >
                                
//                                 </Calendar>
                                
//                             </div>
//                             <div style={{float: 'left', height: 300, width: 550, paddingLeft: 20}}><div style={{textAlign: 'center'}}><u>Selected Timeslots:</u></div>
//                                 <div style = 
//                                 // {{display: 'inline-block'}}
//                                 // {{float: 'left', paddingLeft: 20}}
//                                 {{overflowY: "auto", height: 270}}
//                                 >
//                                     {timeslots.map((val, key) => {
//                                         return (<div key={key}>
//                                             <div style = {{float: 'left', paddingLeft: 3, paddingTop: 7}}>Pax: {val.capacity} | Timing: {moment(val.date).format("Do MMMM YYYY, h:mm a")} to {converter(val.date.getHours())}</div>
//                                             <button
//                                                 style={{ margin: "5px", float: 'left' }}
//                                                 onClick={removeTimeslot(val.date)}
//                                             >REMOVE
//                                             </button>
//                                             </div>);
//                                     })}
//                                 </div>
//                                 <button
//                                     style={{ margin: "5px" }}
//                                     onClick={deselect}
//                                 >DESELECT ALL
//                                 </button>
//                                 <button
//                                     style={{float: 'right', margin: "5px" }}
//                                     onClick={submitBooking}
//                                 >SUBMIT
//                                 </button>
//                             </div>
//                         </div>                                
//                     </Layout2>
//                 </div>              
//                 : <div className="display">
//                     <div style={style}>
//                     <Unauthorised />
//                     </div>
//                 </div>
//             }
//         </div>
//     );
// }

// export default Booking;

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


const style = {
    padding: 5
};

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
        <div className="auth-wrapper">
            {props.location.state !== undefined 
                ? <div>
                    <Layout2 id={props.location.state.id} action="Make a booking">
                        <div className="calendar">
                            <div style={{height: 48}}>
                                <div style={{display: 'inline-block', width: 355, textAlign: 'center', position: 'relative'}}>Venue type </div>
                                <div style={{display: 'inline-block', width: 200, textAlign: 'center', position: 'relative'}}>Venue name </div>
                                <div style={{display: 'inline-block', width: 160, textAlign: 'center', position: 'relative'}}>Location </div>
                                <div style={{display: 'inline-block', width: 70, textAlign: 'center'}}>Max capacity </div>
                                <div style={{display: 'inline-block', paddingLeft: 15, position: 'relative'}}> Equipment available </div>
                            </div>
                            <br />
                            <div className="display-venues" style={{height: 'auto'}}>
                                <div style={{display: 'inline-block', paddingRight: 20}}>
                                    <div style={{float: 'left', width: 240, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{props.location.state.venueType} </div>
                                    <div style={{float: 'left', width: 260, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{props.location.state.venueName} </div>
                                    <div style={{float: 'left', width: 150, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{props.location.state.buildingName} {props.location.state.unit} </div>
                                    <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{props.location.state.capacity} </div>
                                    <div style={{display: 'inline-flex'}}> 
                                        <br />{props.location.state.equipment.Projector === undefined ? "" : props.location.state.equipment.Projector === 1 ? props.location.state.equipment.Projector + " projector" : props.location.state.equipment.Projector + " projectors"}
                                        <br />{props.location.state.equipment.Screen === undefined ? "" : props.location.state.equipment.Screen === 1 ? props.location.state.equipment.Screen + " screen" : props.location.state.equipment.Screen + " screens"}
                                        <br />{props.location.state.equipment.Desktop === undefined ? "" : props.location.state.equipment.Desktop === 1 ? props.location.state.equipment.Desktop + " desktop" : props.location.state.equipment.Desktop + " desktops"}
                                        <br />{props.location.state.equipment.Whiteboard === undefined ? "" : props.location.state.equipment.Whiteboard === 1 ? props.location.state.equipment.Whiteboard + " whiteboard" : props.location.state.equipment.Whiteboard + " whiteboards"}
                                    </div>
                                </div>
                            </div>
                            <div style=
                            {{float: 'left'}}
                            >
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
                                <div style = 
                                {{overflowY: "auto", height: 250}}
                                >
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
                    </Layout2>
                </div>              
                : <div className="display">
                    <div style={style}>
                    <Unauthorised />
                    </div>
                </div>
            }
        </div>
    );
}

export default Booking;
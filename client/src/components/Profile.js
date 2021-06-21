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
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from "@material-ui/core/styles";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import DatePicker from 'react-datepicker' ;
import 'react-datepicker/dist/react-datepicker.css';

import moment from "moment";

import profilePic from "../assets/profile.png";

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
  

function Profile(props) {

    const [searchFields, setSearchFields] = useState({unitNo: "", capacity: 0, date: "", equipment: []});
    const [searchResults, setSearchResults] = useState();
    const [venuesList, setVenuesList] = useState();
    const [venue, setVenue] = useState("");

    // 4 forms
    const [venueName, setVenueName] = useState("");
    const [venueType, setVenueType] = useState("");
    const [buildingName, setBuildingName] = useState("");
    const [unit, setUnit] = useState("");

    const [capacity, setCapacity] = useState(0);

    const [equipment, setEquipment] = useState([]);
    const equipmentList = [
        "Projector",
        "Screen",
        "Desktop",
        "Whiteboard",
    ];

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
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
        
            return (currentDate.getTime() < selectedDate.getTime()) && (selectedDate.getTime() < endDate.getTime());
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
    
    const getProfile = () => {
        // Axios.get(configData.LOCAL_HOST + "/profile").then(response => {
        //     setVenuesList(response.data.data);
        //     // setVenuesList(MOCKDATA);
        // }).catch((error) => {
        //     if (error.response.status === 400) {
        //         console.log(error.response.data.message);
        //     } else {
        //         console.log("Query failed!");
        //     }
        // });
        setProfileInfo({
            Name: "John",
            Nusnetid: "E123",
            Gradyear: 2024,
            Faculty: "Computing",
            Password: "****",

        });
    };

    const getBookings = () => {
        // Axios.get(configData.LOCAL_HOST + "/bookings").then(response => {
        //     setVenuesList(response.data.data);
        //     // setVenuesList(MOCKDATA);
        // }).catch((error) => {
        //     if (error.response.status === 400) {
        //         console.log(error.response.data.message);
        //     } else {
        //         console.log("Query failed!");
        //     }
        // });
        setBookings([{
            Venuename: "ARTIFICIAL INTELLIGENCE Lab 1: Adaptive Computing",
            Buildingname: "COM1",
            Unit: "01-22",
            Eventstart: "2021-06-18T10:00:00.000Z",
            Eventend: "2021-06-18T11:00:00.000Z",
            Pax: 3,
            Bookingid: "0001",
            Status: "Approved",
            Sharing: true
        }]);
    };

    const dateConverter = (date) => {
    
        let endHour = Number(date.substring(11,13)) + 1;

        let tempDate = date.substring(0, 13);

        console.log(moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a'));
        console.log(moment(endHour, 'hh').format('hh:mm a'));

        return moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a') + " to " + moment(endHour, 'hh').format('h:mm a');
    };

    const [profileInfo, setProfileInfo] = useState();

    const [bookings, setBookings] = useState();

    const Search = () => {
        
        // let buildingSearch = (buildingName === "" ? null : buildingName);
        // let unitSearch = (unit === "" ? null : unit);
        // let typeSearch = (venueType === "" ? null : venueType);
        // let nameSearch = (venueName === "" ? null : venueName);

        // let startTime = (startDate === null ? null : startDate.toISOString());
        // let endTime = (endDate === null ? null : endDate.toISOString());

        let search = new URLSearchParams();
        for (let i = 0; i < equipment.length; i++) {
            search.append("equipment", `${equipment[i]}`);
        }
        search.append("capacity", capacity);
        if (buildingName !== "") {
            search.append("buildingName", buildingName);
        }
        if (unit !== "") {
            search.append("unitNo", unit);
        }
        if (venueType !== "") {
            let venueTypeId = "";
            for (let i = 0; i < searchResults.length; i++) {
                if (venueType === searchResults[i].Roomtypename) {
                    console.log("match")
                    venueTypeId = searchResults[i].Roomtypeid;
                }
            }
            console.log(venueTypeId);
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

        // Axios.post(configData.LOCAL_HOST + "/search", {

        //     equipment: equipment,
        //     capacity: capacity,
        //     buildingName: buildingSearch,
        //     unitNo: unitSearch,
        //     roomType: typeSearch,
        //     venueName: nameSearch,

        //     //startHour: startTime,
        //     //endHour: endTime,

        // })

        
        Axios.get(configData.LOCAL_HOST + "/search", 
        {
            params: search,
        }
        // request
        ).then(response => { 
            // console.log(response);
            setSearchResults(response.data.data);
        }).catch((error) => {
            if (error.response.status === 400) {
                console.log(error.response.data.message);
            } else {
                console.log("Query failed!");
            }
        });
    };

    const editBooking = (val) => () => {
        // history.push({
        //     pathname: "/booking",
        //     state: { 
        //         id: props.location.state.id,
        //         buildingName: val.Buildingname,
        //         unit: val.Unit,
        //         capacity: val.Maxcapacity
        //     }
        // });
    };

    const classes = useStyles();

    function toIsoString(date) {
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
    }

    useEffect(() => {
        getProfile(); //populates list of venues from API
        getBookings(); //get venue details for filtering from API
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(searchResults);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchResults]);
    
    return (
        <div className="auth-wrapper">
            {props.location.state !== undefined 
                ? <div>
                    <Layout2 id={props.location.state.id} action="Viewing profile">
                             
                        <div className="profile">
                            <h3>Profile</h3>
                            <div className="display-bookings" style={{height: 'auto'}}>
                                <div 
                                // style={{display: 'inline-flex', justifyContent: 'center'}}
                                style={{height: 90, display: 'inline-block' , paddingLeft: 10}}
                                >
                                    <img className="profilePic" src = {profilePic} alt="profilePic" style={{display: 'block', marginTop: 'auto', marginBottom: 'auto'}}/>
                                </div>
                                <div style={{display: 'inline-block', paddingLeft: 20}}>
                                    <div>Username: {profileInfo.Name}</div>
                                    <div>NUSNET ID: {profileInfo.Nusnetid}</div>
                                    <div>Graduation year: {profileInfo.Gradyear}</div>
                                    <div>Faculty: {profileInfo.Faculty}</div>
                                    <div>Password: {profileInfo.Password}</div>
                                </div>
                            </div>
                            <br />
                            <h3>Bookings</h3>
                            <div>
                                <div style={{display: 'inline-block', width: 260, textAlign: 'center', position: 'relative'}}>Venue name </div>
                                <div style={{display: 'inline-block', width: 100, textAlign: 'center', position: 'relative'}}>Location </div>
                                <div style={{display: 'inline-block', width: 150, textAlign: 'center'}}>Date </div>
                                <div style={{display: 'inline-block', width: 70, textAlign: 'center'}}>Pax </div>
                                <div style={{display: 'inline-block', width: 100, textAlign: 'center'}}>Booking id </div>
                                <div style={{display: 'inline-block', width: 80, textAlign: 'center'}}>Status </div>
                                <div style={{display: 'inline-block', width: 80, textAlign: 'center'}}>Sharing? </div>
                            </div>
                            <br />
                            <div style={{overflowY: "auto", height: 100}}>

                                {bookings === undefined ? "Loading..." : bookings.map((val, key) => {
                                    return (<div key={key}>
                                        <div className="display-bookings" style={{height: 'auto'}}>
                                            <div style={{display: 'inline-block', paddingRight: 20}}>
                                                <div style={{float: 'left', width: 220, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Venuename} </div>
                                                <div style={{float: 'left', width: 140, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Buildingname} {val.Unit} </div>
                                                <div style={{float: 'left', width: 150, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{dateConverter(val.Eventstart)} </div>
                                                <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Pax} </div>
                                                <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Bookingid} </div>
                                                <div style={{float: 'left', width: 100, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Status} </div>
                                                <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Sharing ? "Yes" : "No"} </div>
                                            </div>
                                            <button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={editBooking(val)}>Edit</button> 
                                        </div>
                                        <br />
                                    </div>);
                                })}
                                
                            </div>
                        </div>
                    </Layout2>
                </div>
                
                : <div className="display"><div style={style}>
                    <Unauthorised />
                </div></div>
            }
        </div>
    );
}

export default Profile;
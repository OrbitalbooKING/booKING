import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout3 from "../layouts/Layout3";
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
import subDays from "date-fns/subDays";
import 'react-datepicker/dist/react-datepicker.css';

import moment from "moment";

import * as Cookies from "js-cookie";

import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";


const useStyles = makeStyles(theme => ({
    menuPaper: {
      maxHeight: 200
    }
}));
  

function StaffHome() {

    let history = useHistory();
    
    const classes = useStyles();

    const [searchResults, setSearchResults] = useState();
    const [venuesList, setVenuesList] = useState();

    const [bookingsList, setBookingsList] = useState();

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
    
    const getVenues = () => {
        Axios.get(configData.LOCAL_HOST + "/home").then(response => {
        setVenuesList(response.data.data);
        // setVenuesList(MOCKDATA);
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
    })};

    const Search = () => {
        
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

        Axios.get(configData.LOCAL_HOST + "/search", 
        {
            params: search,
        }
        ).then(response => { 
            setSearchResults(response.data.data);
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

    const book = (val) => () => {
        // history.push({
        //     pathname: "/booking",
        //     state: { 
        //         id: Cookies.get("id"),
        //         name: Cookies.get("name"),
        //         venueType: val.Roomtypename,
        //         venueName: val.Venuename,
        //         buildingName: val.Buildingname,
        //         unit: val.Unit,
        //         capacity: val.Maxcapacity,
        //         equipment: val.Facilitiesdict
        //     }
        // });

        let inThreeHours = 0.125;

        Cookies.set("venueType", val.Roomtypename, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("venueName", val.Venuename, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("buildingName", val.Buildingname, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("unit", val.Unit, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("capacity", val.Maxcapacity, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("projector", val.Facilitiesdict.Projector, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("screen", val.Facilitiesdict.Screen, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("desktop", val.Facilitiesdict.Desktop, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("whiteboard", val.Facilitiesdict.Whiteboard, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });

        history.push("/booking");
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

    const getBookings = () => {
        Axios.get(configData.LOCAL_HOST + "/get_booking_requests").then(response => {
        setBookingsList(response.data.data);
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
    })};

    const approveBooking = (val) => () => {
        
        let inThreeHours = 0.125;

        Cookies.set("requestor", val.Nusnetid, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("faculty", val.Facultydescription, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("bookingId", val.BookingID, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        // Cookies.set("venueName", val.Venuename, {
        //     sameSite: 'None', secure: true,
        //     expires: inThreeHours
        // });
        // Cookies.set("buildingName", val.Buildingname, {
        //     sameSite: 'None', secure: true,
        //     expires: inThreeHours
        // });
        // Cookies.set("unit", val.Unit, {
        //     sameSite: 'None', secure: true,
        //     expires: inThreeHours
        // });
        // Cookies.set("eventStart", val.Eventstart, {
        //     sameSite: 'None', secure: true,
        //     expires: inThreeHours
        // });
        // Cookies.set("pax", val.Pax, {
        //     sameSite: 'None', secure: true,
        //     expires: inThreeHours
        // });
        // Cookies.set("status", val.Bookingstatusdescription, {
        //     sameSite: 'None', secure: true,
        //     expires: inThreeHours
        // });
        // Cookies.set("sharable", val.Sharable, {
        //     sameSite: 'None', secure: true,
        //     expires: inThreeHours
        // });

        history.push("/approval-overview");
       
    };

    const rejectBooking = (val) => () => {
       
    };
    const editBooking = (val) => () => {
       
    };

    const dateConverter = (date) => {
    
        let endHour = Number(date.substring(11,13)) + 1;

        let tempDate = date.substring(0, 13);

        // console.log(moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a'));
        // console.log(moment(endHour, 'hh').format('hh:mm a'));

        return moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a') + " to " + moment(endHour, 'hh').format('h:mm a');
    };

    useEffect(() => {
        Search(); //populates list of venues from API
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

    useEffect(() => {
        getBookings(); //get booking requests from API
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>   
            {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined
                ? <Layout3 id={Cookies.get("id")} name={Cookies.get("name")} action="Viewing booking requests">
                    <div className="parent">
                        <div className="home-page">
                            <div className="bookings-list">
                                <div className="display-bookings-header">
                                    <div style={{display: 'flex', flexDirection: 'row', paddingRight: 20}}>
                                        <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>Requestor </div>
                                        <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>Requestor's faculty </div>
                                        <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>Booking id </div>
                                        <div style={{width: 180, textAlign: 'center', alignSelf: 'center'}}>Venue name </div>
                                        <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>Location </div>
                                        <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>Date </div>
                                        <div style={{width: 70, textAlign: 'center', alignSelf: 'center'}}>Pax </div>
                                        <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Status </div>
                                        <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Sharing? </div>
                                    </div>
                                </div>
                                <div style={{overflowY: "auto", height: 200}}>

                                    {bookingsList === undefined ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> : bookingsList.map((val, key) => {
                                        return (<div key={key}>
                                            <div className="display-selected-booking" style={{height: 'auto'}}>
                                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                                    <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>{val.Nusnetid} </div>
                                                    <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>{val.Facultydescription} </div>
                                                    <div style={{width: 100, textAlign: 'center', alignSelf: 'center', wordWrap: 'break-word'}}>{val.BookingID}</div>
                                                    <div style={{width: 180, textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div>
                                                    <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div>
                                                    <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>{dateConverter(val.Eventstart)} </div>
                                                    <div style={{width: 70, textAlign: 'center', alignSelf: 'center'}}>{val.Pax} </div>
                                                    <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Bookingstatusdescription} </div>
                                                    <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Sharable ? "Yes" : "No"} </div>
                                                    <div style={{width: 60, textAlign: 'center', alignSelf: 'center'}}>
                                                        {/* <button type="submit" className="btn btn-primary btn-block" onClick={Book(val)}>Book</button> */}
                                                        <DropdownButton id="dropdown-basic-button" title="Handle">
                                                        <Dropdown.Item onClick={approveBooking(val)}>Approve</Dropdown.Item>
                                                        <Dropdown.Item onClick={rejectBooking(val)}>Reject</Dropdown.Item>
                                                        <Dropdown.Item onClick={editBooking(val)}>Edit</Dropdown.Item>
                                                        </DropdownButton>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <br />
                                        </div>);
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout3>
                : <Unauthorised />
            }
        </>
    );
}

export default StaffHome;
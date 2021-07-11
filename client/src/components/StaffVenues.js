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

import * as Cookies from "js-cookie";


const useStyles = makeStyles(theme => ({
    menuPaper: {
      maxHeight: 200
    }
}));
  

function StaffVenues() {

    let history = useHistory();
    
    const classes = useStyles();

    const [searchResults, setSearchResults] = useState();
    const [venuesList, setVenuesList] = useState();

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

    const Book = (val) => () => {
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
    
    return (
        <>   
            {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined
                ? <Layout3 id={Cookies.get("id")} name={Cookies.get("name")} action="Viewing venues">
                    <div className="parent">
                        <div className="home-page">
                            <div className="searchbar">
                                <div style={{display: 'inline-block'}}>
                                    <div style={{display: 'flex', flexDirection: 'row',}}>
                                        <Autocomplete
                                            id="free-solo-demo"
                                            freeSolo
                                            options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataType) => dataType.Roomtypename).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
                                            onBlur={e => setVenueType(e.target.value)}
                                            renderInput={(params) => (
                                            <TextField {...params} label="Venue type" style={{width: 240, paddingBottom: 10, paddingRight: 10}} />
                                            )}
                                        />
                                        <Autocomplete
                                            id="free-solo-demo"
                                            freeSolo
                                            options={venuesList === undefined ? [] : venuesList.filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataName) => dataName.Venuename).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
                                            onBlur={e => setVenueName(e.target.value)}
                                            renderInput={(params) => (
                                            <TextField {...params} label="Venue name " style={{width: 240, paddingBottom: 10, paddingRight: 10}} />
                                            )}
                                        />
                                        <Autocomplete
                                            id="free-solo-demo"
                                            freeSolo
                                            options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataBuilding) => dataBuilding.Buildingname).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}

                                            onBlur={e => setBuildingName(e.target.value)}
                                            renderInput={(params) => (
                                            <TextField {...params} label="Building" style={{width: 100, paddingBottom: 10, paddingRight: 10}} />
                                            )}
                                        />
                                        <Autocomplete
                                            id="free-solo-demo"
                                            freeSolo
                                            options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).map((dataUnit) => dataUnit.Unit).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
                                            onBlur={e => setUnit(e.target.value)}
                                            renderInput={(params) => (
                                            <TextField {...params} label="Unit" style={{width: 140, paddingBottom: 10, paddingRight: 10}} />
                                            )}
                                        />
                                        <FormControl style={{width: 85}}>
                                            <InputLabel id="demo-simple-select-label">Capacity</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={capacity === 0 ? "" : capacity}
                                            onChange={handleCapacityChange}
                                            input={<Input />}
                                            MenuProps={{ classes: { paper: classes.menuPaper } }}
                                            >
                                            {Array.from({length: 101}, (v, i) => i).map((val, key) => {
                                                if (val === 0) {
                                                    return <MenuItem value={val} key={key}>Default</MenuItem>;
                                                } else {
                                                    return <MenuItem value={val} key={key}>{val}</MenuItem>;
                                                }
                                            })}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    
                                    <div style={{display: 'flex', flexDirection: 'row', gap: 10}}>
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
                                        <FormControl style={{width: 350, paddingRight: 10}}>
                                            <InputLabel id="demo-mutiple-checkbox-label">Select your equipment</InputLabel>
                                            <Select
                                            labelId="demo-mutiple-checkbox-label"
                                            id="demo-mutiple-checkbox"
                                            multiple
                                            value={equipment}
                                            onChange={handleEquipmentChange}
                                            input={<Input />}
                                            renderValue={(selected) => selected.join(', ')}
                                            >
                                            {equipmentList.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                <Checkbox checked={equipment.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                        <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}><button type="submit" className="btn btn-primary btn-block" onClick={Search}>Search</button></div>
                                    </div>
                                </div>   
                            </div>
                            <br /> 
                            <div className="venue-list">
                                <div className="display-selected-venue-header">
                                    <div style={{display: 'flex', flexDirection: 'row', paddingRight: 20}}>
                                        <div style={{width: 205, textAlign: 'center', alignSelf: 'center'}}>Venue type </div>
                                        <div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Venue name </div>
                                        <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>Location </div>
                                        <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Max capacity </div>
                                        <div style={{width: 120, textAlign: 'center', alignSelf: 'center'}}>Equipment </div>
                                    </div>
                                </div>
                                <div style={{overflowY: "auto", height: 200}}>

                                    {searchResults === undefined ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> : searchResults.map((val, key) => {
                                        return (<div key={key}>
                                            <div className="display-selected-venue" style={{height: 'auto'}}>
                                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                                    <div style={{width: 205, textAlign: 'center', alignSelf: 'center'}}>{val.Roomtypename} </div>
                                                    <div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div>
                                                    <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div>
                                                    <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Maxcapacity} </div>
                                                    <div style={{display: 'flex', width: 120, textAlign: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                                                        {val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}
                                                        <br />{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}
                                                        <br />{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}
                                                        <br />{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}
                                                    </div>
                                                    <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>
                                                        <button type="submit" className="btn btn-primary btn-block" onClick={Book(val)}>Book</button>
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

export default StaffVenues;
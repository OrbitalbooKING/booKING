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
// import ListItemText from '@material-ui/core/ListItemText';
// import Select from '@material-ui/core/Select';
// import Checkbox from '@material-ui/core/Checkbox';

// import { makeStyles } from "@material-ui/core/styles";

// import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';

// import DatePicker from 'react-datepicker' ;
// import 'react-datepicker/dist/react-datepicker.css';

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
  

// function Home(props) {

//     const [searchFields, setSearchFields] = useState({unitNo: "", capacity: 0, date: "", equipment: []});
//     const [searchResults, setSearchResults] = useState();
//     const [venuesList, setVenuesList] = useState();
//     const [venue, setVenue] = useState("");

//     // 4 forms
//     const [venueName, setVenueName] = useState("");
//     const [venueType, setVenueType] = useState("");
//     const [buildingName, setBuildingName] = useState("");
//     const [unit, setUnit] = useState("");

//     const [capacity, setCapacity] = useState(0);

//     const [equipment, setEquipment] = useState([]);
//     const equipmentList = [
//         "Projector",
//         "Screen",
//         "Desktop",
//         "Whiteboard",
//     ];

//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
    
//     const handleCapacityChange = (event) => {
//         setCapacity(event.target.value);
//     };
//     const handleEquipmentChange = (event) => {
//         setEquipment(event.target.value);
//     };

//     const filterStartTime = (time) => {
//         if (endDate !== null) {
//             const currentDate = new Date();
//             const selectedDate = new Date(time);
        
//             return (currentDate.getTime() < selectedDate.getTime()) && (selectedDate.getTime() < endDate.getTime());
//         } else {
//             const currentDate = new Date();
//             const selectedDate = new Date(time);
        
//             return currentDate.getTime() < selectedDate.getTime();
//         }
//     };
//     const filterEndTime = (time) => {
//         if (startDate !== null) {
//             const selectedDate = new Date(time);

//             return startDate.getTime() < selectedDate.getTime();
//         } else {
//             const currentDate = new Date();
//             const selectedDate = new Date(time);
        
//             return currentDate.getTime() < selectedDate.getTime();
//         }
//     };
    
//     const getVenues = () => {Axios.get(configData.LOCAL_HOST + "/home").then(response => {
//         setVenuesList(response.data.data);
//         // setVenuesList(MOCKDATA);
//     }).catch((error) => {
//         if (error.response.status === 400) {
//             console.log(error.response.data.message);
//         } else {
//             console.log("Query failed!");
//         }
//     })};

//     const Search = () => {
        
//         // let buildingSearch = (buildingName === "" ? null : buildingName);
//         // let unitSearch = (unit === "" ? null : unit);
//         // let typeSearch = (venueType === "" ? null : venueType);
//         // let nameSearch = (venueName === "" ? null : venueName);

//         // let startTime = (startDate === null ? null : startDate.toISOString());
//         // let endTime = (endDate === null ? null : endDate.toISOString());

//         let search = new URLSearchParams();
//         for (let i = 0; i < equipment.length; i++) {
//             search.append("equipment", `${equipment[i]}`);
//         }
//         search.append("capacity", capacity);
//         if (buildingName !== "") {
//             search.append("buildingName", buildingName);
//         }
//         if (unit !== "") {
//             search.append("unitNo", unit);
//         }
//         if (venueType !== "") {
//             search.append("roomType", venueType);
//         }
//         if (venueName !== "") {
//             search.append("venueName", venueName);
//         }

//         if (startDate !== null) {
//             search.append("startHour", startDate.toISOString());
//         }
//         if (endDate !== null) {
//             search.append("endHour", endDate.toISOString());
//         }

//         // Axios.post(configData.LOCAL_HOST + "/search", {

//         //     equipment: equipment,
//         //     capacity: capacity,
//         //     buildingName: buildingSearch,
//         //     unitNo: unitSearch,
//         //     roomType: typeSearch,
//         //     venueName: nameSearch,

//         //     //startHour: startTime,
//         //     //endHour: endTime,

//         // })

        
//         Axios.get(configData.LOCAL_HOST + "/search?", 
//         {
//             params: search,

//             // params: {
//             //     equipment: equipment,
//             //     // capacity: capacity,
//             //     // buildingName: buildingSearch,
//             //     // unitNo: unitSearch,
//             //     // roomType: typeSearch,
//             //     // venueName: nameSearch,

//             //     // startHour: startTime,
//             //     // endHour: endTime,
//             // }, paramsSerializer: params => {
//             //     return qs.stringify(params , { arrayFormat: "repeat" })
//             //   }
//         }
//         // request
//         ).then(response => { 
//             // console.log(response);
//             setSearchResults(response.data.data);
//         }).catch((error) => {
//             if (error.response.status === 400) {
//                 console.log(error.response.data.message);
//             } else {
//                 console.log("Query failed!");
//             }
//         });
//     };

//     const Book = (val) => () => {
//         // history.push("/booking");
//         console.log(val);
//         history.push({
//             pathname: "/booking",
//             state: { 
//                 id: props.location.state.id,
//                 buildingName: val.Buildingname,
//                 unit: val.Unit,
//                 capacity: val.Maxcapacity,
//             }
//         });
//     };

//     const classes = useStyles();

//     useEffect(() => {
//         Search(); //populates list of venues from API
//         getVenues(); //get venue details for filtering from API
        
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);
    
//     return (
//         <div className="auth-wrapper">
//             {props.location.state !== undefined 
//                 ? <div>
//                     <Layout2 id={props.location.state.id} action="Viewing venues">
//                         <div className="searchbar">
//                                 <div style={{display: 'inline-block'}}>

//                                 {/* ORIGINAL */}
//                                 {/* <Autocomplete
//                                     id="free-solo-demo"
//                                     freeSolo
//                                     options={venuesList === undefined ? [] : venuesList.map((option) => option.Venuename)}
//                                     // options={venuesList === undefined ? [] : venuesList.filter((building) => building.Buildingname.toLowerCase().includes("AS6".toLowerCase())).map((option) => option.Venuename)}
//                                     onBlur={e => setVenue(e.target.value)}
//                                     renderInput={(params) => (
//                                     <TextField {...params} label="Unit no." style={{width: 230, paddingBottom: 10}} />
//                                     )}
//                                 /> */}

//                                 <div style={{display: 'flex', flexDirection: 'row',}}>
//                                 <Autocomplete
//                                     id="free-solo-demo"
//                                     freeSolo
//                                     options={venuesList === undefined ? [] : venuesList.filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataName) => dataName.Venuename).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
//                                     onBlur={e => setVenueName(e.target.value)}
//                                     renderInput={(params) => (
//                                     <TextField {...params} label="Venue name " style={{width: 230, paddingBottom: 10, paddingRight: 10}} />
//                                     )}
//                                 />
//                                 <Autocomplete
//                                     id="free-solo-demo"
//                                     freeSolo
//                                     options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataType) => dataType.Roomtypename).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
//                                     onBlur={e => setVenueType(e.target.value)}
//                                     renderInput={(params) => (
//                                     <TextField {...params} label="Room type" style={{width: 230, paddingBottom: 10}} />
//                                     )}
//                                 />
//                                 </div>
                                
//                                 <div style={{display: 'flex', flexDirection: 'row',}}>
//                                 <Autocomplete
//                                     id="free-solo-demo"
//                                     freeSolo
//                                     // options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataBuilding) => dataBuilding.Buildingname)}
//                                     options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataBuilding) => dataBuilding.Buildingname).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}

//                                     onBlur={e => setBuildingName(e.target.value)}
//                                     renderInput={(params) => (
//                                     <TextField {...params} label="Building" style={{width: 230, paddingBottom: 10, paddingRight: 10}} />
//                                     )}
//                                 />
//                                 <Autocomplete
//                                     id="free-solo-demo"
//                                     freeSolo
//                                     options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).map((dataUnit) => dataUnit.Unit).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
//                                     onBlur={e => setUnit(e.target.value)}
//                                     renderInput={(params) => (
//                                     <TextField {...params} label="Unit" style={{width: 230, paddingBottom: 10}} />
//                                     )}
//                                 />
//                                 </div>

                                

//                                 </div>
//                                 <div 
//                                 // style={{width: 230, height: 48, display: 'inline-block', position: "relative"}}
//                                 >

//                                     <DatePicker
//                                     selected={startDate}
//                                     onChange={(date) => setStartDate(date)}
//                                     showTimeSelect
//                                     filterTime={filterStartTime}
//                                     timeFormat="HH:mm"
//                                     timeIntervals={60}
//                                     timeCaption="time"
//                                     dateFormat="MMMM d, yyyy h:mm aa"
//                                     placeholderText="Select start time"
//                                     isClearable
//                                     // style={{position: "absolute"}}
//                                     />
//                                     <DatePicker
//                                     selected={endDate}
//                                     onChange={(date) => setEndDate(date)}
//                                     showTimeSelect
//                                     filterTime={filterEndTime}
//                                     timeFormat="HH:mm"
//                                     timeIntervals={60}
//                                     timeCaption="time"
//                                     dateFormat="MMMM d, yyyy h:mm aa"
//                                     placeholderText="Select end time"
//                                     isClearable
//                                     // style={{position: "absolute"}}
//                                     />
//                                 </div>

//                                 <button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={Search}>Search</button> 

//                                 <FormControl style={{width: 455}}>
//                                     <InputLabel id="demo-mutiple-checkbox-label">Select your equipment</InputLabel>
//                                     <Select
//                                     labelId="demo-mutiple-checkbox-label"
//                                     id="demo-mutiple-checkbox"
//                                     multiple
//                                     value={equipment}
//                                     onChange={handleEquipmentChange}
//                                     input={<Input />}
//                                     renderValue={(selected) => selected.join(', ')}
//                                     >
//                                     {equipmentList.map((name) => (
//                                         <MenuItem key={name} value={name}>
//                                         <Checkbox checked={equipment.indexOf(name) > -1} />
//                                         <ListItemText primary={name} />
//                                         </MenuItem>
//                                     ))}
//                                     </Select>
//                                 </FormControl>

//                                 <FormControl style={{width: 85}} className={classes.formControl}>
//                                     <InputLabel id="demo-simple-select-label">Capacity</InputLabel>
//                                     <Select
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     value={capacity === 0 ? "" : capacity}
//                                     onChange={handleCapacityChange}
//                                     input={<Input />}
//                                     MenuProps={{ classes: { paper: classes.menuPaper } }}
//                                     >
//                                     {/* <MenuItem value={0}>Default</MenuItem>
//                                     <MenuItem value={5}>5</MenuItem>
//                                     <MenuItem value={10}>10</MenuItem>
//                                     <MenuItem value={15}>15</MenuItem>
//                                     <MenuItem value={20}>20</MenuItem>
//                                     <MenuItem value={25}>25</MenuItem> */}
//                                     {Array.from({length: 25}, (v, i) => i).map((val, key) => {
//                                         if (val === 0) {
//                                             return <MenuItem value={val}>Default</MenuItem>;
//                                         } else {
//                                             return <MenuItem value={val}>{val}</MenuItem>;
//                                         }
//                                     })}
//                                     </Select>
//                                 </FormControl>
//                         </div>
//                         <br />
                        
//                         <div className="display">
//                             <div style={{height: 48}}>
//                                 <div style={{display: 'inline-block', width: 200, textAlign: 'center', position: 'relative'}}>Venue name </div>
//                                 <div style={{display: 'inline-block', width: 205, textAlign: 'center', position: 'relative'}}>Venue type </div>
//                                 <div style={{display: 'inline-block', width: 70, textAlign: 'center'}}>Max capacity </div>
//                                 <div style={{display: 'inline-block', paddingLeft: 15, position: 'relative'}}> Equipment available </div>
//                             </div>
//                             <br />
//                             <div style={{overflowY: "auto", height: 200}}>

//                                 {searchResults === undefined ? "Loading..." : searchResults.map((val, key) => {
//                                     return <>
//                                         <div className="display-venues" style={{height: 'auto'}}>
//                                             <div style={{display: 'inline-block', paddingRight: 20}}>
//                                                 <div style={{float: 'left', width: 180, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Venuename} </div>
//                                                 <div style={{float: 'left', width: 220, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Roomtypename} </div>
//                                                 <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Maxcapacity} </div>
//                                                 <div style={{display: 'inline-flex'}}> 
//                                                     <br />{val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}
//                                                     <br />{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}
//                                                     <br />{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}
//                                                     <br />{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}
//                                                 </div>
//                                             </div>
//                                             <button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={Book(val)}>Book</button> 
//                                         </div>
//                                         <br />
//                                     </>;
//                                 })}
                                
//                             </div>
//                         </div>
//                     </Layout2>
//                 </div>
                
//                 : <div className="display"><div style={style}>
//                     <Unauthorised />
//                 </div></div>
//             }
//         </div>
//     );
// }

// export default Home;

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
  

function Home(props) {

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
    
    const getVenues = () => {Axios.get(configData.LOCAL_HOST + "/home").then(response => {
        setVenuesList(response.data.data);
        // setVenuesList(MOCKDATA);
    }).catch((error) => {
        if (error.response.status === 400) {
            console.log(error.response.data.message);
        } else {
            console.log("Query failed!");
        }
    })};

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
        ).then(response => { 
            setSearchResults(response.data.data);
        }).catch((error) => {
            if (error.response.status === 400) {
                console.log(error.response.data.message);
            } else {
                console.log("Query failed!");
            }
        });
    };

    const Book = (val) => () => {
        history.push({
            pathname: "/booking",
            state: { 
                id: props.location.state.id,
                venueType: val.Roomtypename,
                venueName: val.Venuename,
                buildingName: val.Buildingname,
                unit: val.Unit,
                capacity: val.Maxcapacity,
                equipment: val.Facilitiesdict
            }
        });
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
        Search(); //populates list of venues from API
        getVenues(); //get venue details for filtering from API
        
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
                    <Layout2 id={props.location.state.id} action="Viewing venues">
                        <div className="searchbar">
                                <div style={{display: 'inline-block'}}>

                                {/* ORIGINAL */}
                                {/* <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    options={venuesList === undefined ? [] : venuesList.map((option) => option.Venuename)}
                                    // options={venuesList === undefined ? [] : venuesList.filter((building) => building.Buildingname.toLowerCase().includes("AS6".toLowerCase())).map((option) => option.Venuename)}
                                    onBlur={e => setVenue(e.target.value)}
                                    renderInput={(params) => (
                                    <TextField {...params} label="Unit no." style={{width: 230, paddingBottom: 10}} />
                                    )}
                                /> */}

                                <div style={{display: 'flex', flexDirection: 'row',}}>
                                <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    options={venuesList === undefined ? [] : venuesList.filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataName) => dataName.Venuename).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
                                    onBlur={e => setVenueName(e.target.value)}
                                    renderInput={(params) => (
                                    <TextField {...params} label="Venue name " style={{width: 230, paddingBottom: 10, paddingRight: 10}} />
                                    )}
                                />
                                <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataType) => dataType.Roomtypename).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
                                    onBlur={e => setVenueType(e.target.value)}
                                    renderInput={(params) => (
                                    <TextField {...params} label="Room type" style={{width: 230, paddingBottom: 10}} />
                                    )}
                                />
                                </div>
                                
                                <div style={{display: 'flex', flexDirection: 'row',}}>
                                <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    // options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataBuilding) => dataBuilding.Buildingname)}
                                    options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataUnit) => dataUnit.Unit.toLowerCase().includes(unit.toLowerCase())).map((dataBuilding) => dataBuilding.Buildingname).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}

                                    onBlur={e => setBuildingName(e.target.value)}
                                    renderInput={(params) => (
                                    <TextField {...params} label="Building" style={{width: 230, paddingBottom: 10, paddingRight: 10}} />
                                    )}
                                />
                                <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    options={venuesList === undefined ? [] : venuesList.filter((dataName) => dataName.Venuename.toLowerCase().includes(venueName.toLowerCase())).filter((dataType) => dataType.Roomtypename.toLowerCase().includes(venueType.toLowerCase())).filter((dataBuilding) => dataBuilding.Buildingname.toLowerCase().includes(buildingName.toLowerCase())).map((dataUnit) => dataUnit.Unit).filter((item, i, s) => s.lastIndexOf(item) === i).sort()}
                                    onBlur={e => setUnit(e.target.value)}
                                    renderInput={(params) => (
                                    <TextField {...params} label="Unit" style={{width: 230, paddingBottom: 10}} />
                                    )}
                                />
                                </div>

                                

                                </div>
                                <div 
                                // style={{width: 230, height: 48, display: 'inline-block', position: "relative"}}
                                >

                                    <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    showTimeSelect
                                    filterTime={filterStartTime}
                                    timeFormat="HH:mm"
                                    timeIntervals={60}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    placeholderText="Select start time"
                                    isClearable
                                    // style={{position: "absolute"}}
                                    />
                                    <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    showTimeSelect
                                    filterTime={filterEndTime}
                                    timeFormat="HH:mm"
                                    timeIntervals={60}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    placeholderText="Select end time"
                                    isClearable
                                    // style={{position: "absolute"}}
                                    />
                                </div>

                                <button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={Search}>Search</button> 

                                <FormControl style={{width: 455}}>
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
                                    {Array.from({length: 25}, (v, i) => i).map((val, key) => {
                                        if (val === 0) {
                                            return <MenuItem value={val} key={key}>Default</MenuItem>;
                                        } else {
                                            return <MenuItem value={val} key={key}>{val}</MenuItem>;
                                        }
                                    })}
                                    </Select>
                                </FormControl>
                        </div>
                        <br />
                        
                        <div className="display">
                            <div style={{height: 48}}>
                                <div style={{display: 'inline-block', width: 205, textAlign: 'center', position: 'relative'}}>Venue type </div>
                                <div style={{display: 'inline-block', width: 200, textAlign: 'center', position: 'relative'}}>Venue name </div>
                                <div style={{display: 'inline-block', width: 180, textAlign: 'center', position: 'relative'}}>Location </div>
                                <div style={{display: 'inline-block', width: 70, textAlign: 'center'}}>Max capacity </div>
                                <div style={{display: 'inline-block', paddingLeft: 15, position: 'relative'}}> Equipment available </div>
                            </div>
                            <br />
                            <div style={{overflowY: "auto", height: 200}}>

                                {searchResults === undefined ? "Loading..." : searchResults.map((val, key) => {
                                    return (<div key={key}>
                                        <div className="display-venues" style={{height: 'auto'}}>
                                            <div style={{display: 'inline-block', paddingRight: 20}}>
                                                <div style={{float: 'left', width: 220, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Roomtypename} </div>
                                                <div style={{float: 'left', width: 200, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Venuename} </div>
                                                <div style={{float: 'left', width: 150, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Buildingname} {val.Unit} </div>
                                                <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Maxcapacity} </div>
                                                <div style={{display: 'inline-flex'}}> 
                                                    <br />{val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}
                                                    <br />{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}
                                                    <br />{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}
                                                    <br />{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}
                                                </div>
                                            </div>
                                            <button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={Book(val)}>Book</button> 
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

export default Home;
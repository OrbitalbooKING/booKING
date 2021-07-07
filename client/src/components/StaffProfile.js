import { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout3 from "../layouts/Layout3";
import Unauthorised from "./Unauthorised";

import moment from "moment";

import profilePic from "../assets/profile.png";
import Cookies from "js-cookie";

function StaffProfile() {

    // let history = useHistory();
    
    const getProfile = () => {
        // setProfileInfo({
        //     Name: "John",
        //     Nusnetid: "E123",
        //     Gradyear: 2024,
        //     Faculty: "Computing",
        //     Password: "****",
        // });
        let search = new URLSearchParams();

        search.append("NUSNET_ID", Cookies.get("id"));
        
        Axios.get(configData.LOCAL_HOST + "/get_profile", 
        {
            params: search,
        }
        ).then(response => { 
            setProfileInfo(response.data.data);
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

    

    const getBookings = () => {
        // setBookings([{
        //     Venuename: "ARTIFICIAL INTELLIGENCE Lab 1: Adaptive Computing",
        //     Buildingname: "COM1",
        //     Unit: "01-22",
        //     Eventstart: "2021-06-18T10:00:00.000Z",
        //     Eventend: "2021-06-18T11:00:00.000Z",
        //     Pax: 3,
        //     Bookingid: "0001",
        //     Status: "Approved",
        //     Sharing: true
        // }]);
        let search = new URLSearchParams();

        search.append("NUSNET_ID", Cookies.get("id"));
        
        Axios.get(configData.LOCAL_HOST + "/get_bookings", 
        {
            params: search,
        }
        ).then(response => { 
            setBookings(response.data.data);
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

    const dateConverter = (date) => {
    
        let endHour = Number(date.substring(11,13)) + 1;

        let tempDate = date.substring(0, 13);

        // console.log(moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a'));
        // console.log(moment(endHour, 'hh').format('hh:mm a'));

        return moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a') + " to " + moment(endHour, 'hh').format('h:mm a');
    };

    const [profileInfo, setProfileInfo] = useState();

    const [bookings, setBookings] = useState();

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

    useEffect(() => {
        getProfile(); //populates list of venues from API
        getBookings(); //get venue details for filtering from API
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined
                ? <Layout3 id={Cookies.get("id")} name={Cookies.get("name")} action="Viewing profile">
                        <div className="parent">
                            <div className="home-page">
                                <div className="profile">
                                    <h3>Profile</h3>
                                    <div className="display-selected-venue" style={{height: 'auto'}}>
                                        <div style={{height: 102, display: 'inline-block', paddingLeft: 10}}>
                                            <img className="profilePic" src = {profilePic} alt="profilePic" style={{display: 'block', margin: 'auto'}}/>
                                        </div>
                                        <div style={{display: 'inline-block', paddingLeft: 20}}>
                                            <div>Username: {profileInfo === undefined ? "" : profileInfo.Name}</div>
                                            <div>NUSNET ID: {profileInfo === undefined ? "" : profileInfo.NUSNET_ID}</div>
                                            <div>Graduation year: {profileInfo === undefined ? "" : profileInfo.Gradyear}</div>
                                            <div>Faculty: {profileInfo === undefined ? "" : profileInfo.Facultyname}</div>
                                            <div>Password: {profileInfo === undefined ? "" : "****"}</div>
                                            <div>Points: {profileInfo === undefined ? "" : profileInfo.Points}</div>
                                        </div>
                                    </div>
                                    <br />
                                    <h3>Bookings</h3>
                                    {/* <div>
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
                                                        <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.ID} </div>
                                                        <div style={{float: 'left', width: 100, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Bookingstatusdescription} </div>
                                                        <div style={{float: 'left', width: 70, paddingRight: 20, whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{val.Sharable ? "Yes" : "No"} </div>
                                                    </div>
                                                    <button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={editBooking(val)}>Edit</button> 
                                                </div>
                                                <br />
                                            </div>);
                                        })}
                                    </div> */}
                                    {/* <div className="venue-list"> */}
                                        <div className="display-selected-venue-header">
                                            <div style={{display: 'flex', flexDirection: 'row', paddingRight: 20}}>
                                                <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>Booking id </div>
                                                <div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Venue name </div>
                                                <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>Location </div>
                                                <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>Date </div>
                                                <div style={{width: 70, textAlign: 'center', alignSelf: 'center'}}>Pax </div>
                                                <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Status </div>
                                                <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Sharing? </div>
                                            </div>
                                        </div>
                                        <div style={{overflowY: "auto", height: 200}}>

                                            {bookings === undefined ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> : bookings.map((val, key) => {
                                                return (<div key={key}>
                                                    <div className="display-selected-venue" style={{height: 'auto'}}>
                                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                                            <div style={{width: 100, textAlign: 'center', alignSelf: 'center', wordWrap: 'break-word'}}>{val.ID} </div>
                                                            <div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div>
                                                            <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div>
                                                            <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>{dateConverter(val.Eventstart)} </div>
                                                            <div style={{width: 70, textAlign: 'center', alignSelf: 'center'}}>{val.Pax} </div>
                                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Bookingstatusdescription} </div>
                                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Sharable ? "Yes" : "No"} </div>
                                                            {/* <div style={{display: 'flex', width: 120, textAlign: 'center', alignSelf: 'center'}}>
                                                                <br />{val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}
                                                                <br />{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}
                                                                <br />{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}
                                                                <br />{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}
                                                            </div> */}
                                                            <div style={{width: 60, textAlign: 'center', alignSelf: 'center'}}>
                                                                <button type="submit" className="btn btn-primary btn-block" onClick={editBooking(val)}>Edit</button>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                    <br />
                                                </div>);
                                            })}
                                        </div>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    </Layout3>                
                : <Unauthorised />
            }
        </>
    );
}

export default StaffProfile;
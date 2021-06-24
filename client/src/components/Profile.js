import { useState, useEffect } from "react";
// import history from "../history";
// import Axios from "axios";
// import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

import moment from "moment";

import profilePic from "../assets/profile.png";

function Profile(props) {
    
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
            {props.location.state !== undefined 
                ? <Layout2 id={props.location.state.id} name={props.location.state.name} action="Viewing profile">
                        <div className="parent">
                            <div className="home-page">
                                <div className="profile">
                                    <h3>Profile</h3>
                                    <div className="display-bookings" style={{height: 'auto'}}>
                                        <div 
                                        style={{height: 90, display: 'inline-block' , paddingLeft: 10}}
                                        >
                                            <img className="profilePic" src = {profilePic} alt="profilePic" style={{display: 'block', marginTop: 'auto', marginBottom: 'auto'}}/>
                                        </div>
                                        <div style={{display: 'inline-block', paddingLeft: 20}}>
                                            <div>Username: {profileInfo === undefined ? "" : profileInfo.Name}</div>
                                            <div>NUSNET ID: {profileInfo === undefined ? "" : profileInfo.Nusnetid}</div>
                                            <div>Graduation year: {profileInfo === undefined ? "" : profileInfo.Gradyear}</div>
                                            <div>Faculty: {profileInfo === undefined ? "" : profileInfo.Faculty}</div>
                                            <div>Password: {profileInfo === undefined ? "" : profileInfo.Password}</div>
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
                            </div>
                        </div>
                    </Layout2>                
                : <Unauthorised />
            }
        </>
    );
}

export default Profile;
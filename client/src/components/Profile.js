import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

import moment from "moment";

import profilePic from "../assets/profile.png";
import * as Cookies from "js-cookie";

import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";

function Profile() {

    let history = useHistory();

    const [profileInfo, setProfileInfo] = useState();
    const [bookings, setBookings] = useState();
    
    const getProfile = () => {

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

        return moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a') + " to " + moment(endHour, 'hh').format('h:mm a');
    };

    const deleteBooking = (val) => () => {

        let inThreeHours = 0.125;

        Cookies.set("bookingId", val.Bookingid, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });

        history.push("/deletion-overview");

    };
    
    const editBooking = (val) => () => {

        let inThreeHours = 0.125;

        Cookies.set("oldBookingId", val.Bookingid, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("oldBuildingId", val.Buildingid, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        Cookies.set("oldUnit", val.Unit, {
            sameSite: 'None', secure: true,
            expires: inThreeHours
        });
        
        history.push("/edit-home");

    };

    useEffect(() => {
        getProfile(); //populates list of venues from API
        getBookings(); //get venue details for filtering from API
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined
                ? <Layout2 id={Cookies.get("id")} name={Cookies.get("name")} action="Viewing profile">
                        <div className="parent-home">
                            <div className="home-page">
                                <div className="profile">
                                    <h3>Profile</h3>
                                    <div className="display-selected-venue" style={{height: 'auto'}}>
                                        <div style={{height: 90, display: 'inline-block', paddingLeft: 10}}>
                                            <img className="profilePic" src = {profilePic} alt="profilePic" style={{display: 'block', margin: 'auto'}}/>
                                        </div>
                                        <div style={{display: 'inline-block', paddingLeft: 20}}>
                                            <div>Username: {profileInfo === undefined ? "" : profileInfo.Name}</div>
                                            <div>NUSNET ID: {profileInfo === undefined ? "" : profileInfo.NUSNET_ID}</div>
                                            <div>Graduation year: {profileInfo === undefined ? "" : profileInfo.Gradyear}</div>
                                            <div>Faculty: {profileInfo === undefined ? "" : profileInfo.Facultyname}</div>
                                            <div>Points: {profileInfo === undefined ? "" : Math.round(profileInfo.Points * 10) / 10}</div>
                                        </div>
                                    </div>
                                    <br />
                                    <h3>Bookings</h3>
                                    <div className="display-selected-venue-header">
                                        <div style={{display: 'flex', flexDirection: 'row', paddingRight: 20}}>
                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Booking id </div>
                                            <div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Venue name </div>
                                            <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>Location </div>
                                            <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>Date </div>
                                            <div style={{width: 70, textAlign: 'center', alignSelf: 'center'}}>Pax </div>
                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Status </div>
                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>Sharing? </div>
                                        </div>
                                    </div>
                                    <div style={{overflowY: "auto", height: 200}}>
                                        {bookings === undefined 
                                            ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> 
                                            : bookings.length === 0 
                                                ? <div className="display-selected-venue">
                                                    <div style={{textAlign: 'center', alignSelf: 'center'}}>
                                                        <h3>No bookings to display</h3>
                                                    </div>
                                                </div>
                                                : bookings.map((val, key) => {
                                                    return (<div key={key}>
                                                        <div className="display-selected-venue" style={{height: 'auto'}}>
                                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                                <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Bookingid.substring(0, 4)} </div>
                                                                <div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div>
                                                                <div style={{width: 100, textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div>
                                                                <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>{dateConverter(val.Eventstart)} </div>
                                                                <div style={{width: 70, textAlign: 'center', alignSelf: 'center'}}>{val.Pax} </div>
                                                                <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Bookingstatusdescription} </div>
                                                                <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Sharable ? "Yes" : "No"} </div>
                                                                <div style={{width: 60, textAlign: 'center', alignSelf: 'center'}}>
                                                                    <DropdownButton id="dropdown-basic-button" title="Edit">
                                                                        <Dropdown.Item onClick={editBooking(val)}>Edit</Dropdown.Item>
                                                                        <Dropdown.Item onClick={deleteBooking(val)}>Delete</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                        <br />
                                                    </div>);
                                                })
                                        }
                                    </div>
                                </div>

                                <div className="profile-mobile">
                                    <div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}><h3>Profile</h3></div>
                                    <div style={{overflowY: "auto", height: 230}}>
                                        <img className="profilePic" src = {profilePic} alt="profilePic" style={{display: 'block', margin: 'auto'}}/>
                                        {/* <div style={{display: 'inline-block', paddingLeft: 20}}>
                                            <div>Username: {profileInfo === undefined ? "" : profileInfo.Name}</div>
                                            <div>NUSNET ID: {profileInfo === undefined ? "" : profileInfo.NUSNET_ID}</div>
                                            <div>Graduation year: {profileInfo === undefined ? "" : profileInfo.Gradyear}</div>
                                            <div>Faculty: {profileInfo === undefined ? "" : profileInfo.Facultyname}</div>
                                            <div>Points: {profileInfo === undefined ? "" : profileInfo.Points}</div>
                                        </div> */}
                                        <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Username </div></div>
                                        <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{profileInfo === undefined ? "" : profileInfo.Name} </div></div>
                                        <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>NUSNET ID </div></div>
                                        <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{profileInfo === undefined ? "" : profileInfo.NUSNET_ID} </div></div>
                                        <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Graduation year </div></div>
                                        <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{profileInfo === undefined ? "" : profileInfo.Gradyear} </div></div>
                                        <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Faculty </div></div>
                                        <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{profileInfo === undefined ? "" : profileInfo.Facultyname} </div></div>
                                        <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Points </div></div>
                                        <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{profileInfo === undefined ? "" : Math.round(profileInfo.Points * 10) / 10} </div></div>
                                    </div>
                                </div>

                                {/* <div className="profile-mobile">
                                    <div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}><h3>Profile</h3></div>
                                    <div style={{overflowY: "auto", height: 250}}>
                                        <img className="profilePic" src = {profilePic} alt="profilePic" style={{display: 'block', margin: 'auto'}}/>
                                        <div style={{display: 'inline-block', paddingLeft: 20}}>
                                            <div>Username: {profileInfo === undefined ? "" : profileInfo.Name}</div>
                                            <div>NUSNET ID: {profileInfo === undefined ? "" : profileInfo.NUSNET_ID}</div>
                                            <div>Graduation year: {profileInfo === undefined ? "" : profileInfo.Gradyear}</div>
                                            <div>Faculty: {profileInfo === undefined ? "" : profileInfo.Facultyname}</div>
                                            <div>Points: {profileInfo === undefined ? "" : profileInfo.Points}</div>
                                        </div>
                                    </div>
                                </div> */}

                                {/* <div className="profile-mobile">
                                    <div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}><h3>Bookings</h3></div>
                                    <div style={{overflowY: "auto", height: 250}}>
                                        <img className="profilePic" src = {profilePic} alt="profilePic" style={{display: 'block', margin: 'auto'}}/>
                                        <div style={{display: 'inline-block', paddingLeft: 20}}>
                                            <div>Username: {profileInfo === undefined ? "" : profileInfo.Name}</div>
                                            <div>NUSNET ID: {profileInfo === undefined ? "" : profileInfo.NUSNET_ID}</div>
                                            <div>Graduation year: {profileInfo === undefined ? "" : profileInfo.Gradyear}</div>
                                            <div>Faculty: {profileInfo === undefined ? "" : profileInfo.Facultyname}</div>
                                            <div>Points: {profileInfo === undefined ? "" : profileInfo.Points}</div>
                                        </div>
                                    </div>
                                </div> */}
                                <br />
                                <div className="venue-list-mobile">
                                    <div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}><h3>Bookings</h3></div>
                                    <div style={{overflowY: "auto", height: 230}}>
                                    {bookings === undefined 
                                        ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> 
                                        : bookings.length === 0 
                                            ? <div className="display-selected-venue">
                                                <div style={{textAlign: 'center', alignSelf: 'center'}}>
                                                    <h3>No bookings to display</h3>
                                                </div>
                                            </div>
                                            : bookings.map((val, key) => {
                                                return (<div key={key}>
                                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                                        <div>
                                                            <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Booking id </div></div>
                                                            <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{val.Bookingid.substring(0, 4)} </div></div>
                                                            <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Venue name </div></div>
                                                            <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div></div>
                                                            <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Location </div></div>
                                                            <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div></div>
                                                            <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Date </div></div>
                                                            <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{dateConverter(val.Eventstart)} </div></div>
                                                            <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Pax </div></div>
                                                            <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{val.Pax} </div></div>
                                                            <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Status </div></div>
                                                            <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{val.Bookingstatusdescription} </div></div>
                                                            <div className="display-old-header"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>Sharing </div></div>
                                                            <div className="display-old"><div style={{width: "auto", textAlign: 'center', alignSelf: 'center'}}>{val.Sharable ? "Yes" : "No"} </div></div>
                                                            {/* <div className="display-old"><div style={{display: 'flex', width: "auto", textAlign: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                                                                {val.Facilitiesdict.Projector === undefined && val.Facilitiesdict.Screen === undefined && val.Facilitiesdict.Desktop === undefined && val.Facilitiesdict.Whiteboard === undefined ? "Nil" : ""}
                                                                
                                                                {val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}
                                                                <br />{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}
                                                                <br />{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}
                                                                <br />{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}
                                                            </div></div> */}
                                                            <div style={{width: "auto", textAlign: 'center', alignSelf: 'center', paddingTop: 10}}>
                                                                {/* <button type="submit" className="btn btn-primary btn-block" onClick={book(val)}>Book</button> */}
                                                                <DropdownButton id="dropdown-basic-button" title="Edit">
                                                                    <Dropdown.Item onClick={editBooking(val)}>Edit</Dropdown.Item>
                                                                    <Dropdown.Item onClick={deleteBooking(val)}>Delete</Dropdown.Item>
                                                                </DropdownButton>
                                                            </div>
                                                            <hr />
                                                        </div>
                                                    </div>
                                                </div>);
                                            })
                                    }
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
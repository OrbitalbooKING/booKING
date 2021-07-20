import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

import moment from "moment";

import * as Cookies from "js-cookie";

function EditOverview() {

    let history = useHistory();

    const [bookingInfo, setBookingInfo] = useState();
    const [oldVenueInfo, setOldVenueInfo] = useState();

    const [venueInfo, setVenueInfo] = useState();
    const [cart, setCart] = useState();

    const getOldBooking = () => {
        let search = new URLSearchParams();

        search.append("bookingID", Cookies.get("oldBookingId"));
        
        Axios.get(configData.LOCAL_HOST + "/check_booking", 
        {
            params: search,
        }
        ).then(response => {
            setBookingInfo(response.data.data);
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

    const getCartItems = () => { // whenever the user changes date or capacity
        
        let search = new URLSearchParams();

        search.append("NUSNET_ID", Cookies.get("id"));
        
        Axios.get(configData.LOCAL_HOST + "/get_pending_booking", 
        {
            params: search,
        }
        ).then(response => { 
            setCart(response.data.data.PendingBookings);
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

    const confirmBooking = () => {
        if (cart !== undefined) {
            let tempArr = [];
        
            for (let i = 0; i < cart.length; i++) {
                tempArr.push(cart[i].Bookingid);
            }

            Axios.put(configData.LOCAL_HOST + "/make_booking", 
            {
                bookingID: tempArr
            }).then(response => { 
                // history.push({
                //     pathname: "/booking-success",
                //     state: {
                //         id: props.location.state.id,
                //         name: props.location.state.name
                //     }
                // });

                let search = new URLSearchParams();
                search.append("bookingID", Cookies.get("oldBookingId")); 

                Axios.delete(configData.LOCAL_HOST + "/delete_confirmed_bookings", 
                {
                    params: search,
                }
                ).then(response => { 
                    history.push("/edit-success");
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

    const dateConverter = (givenDate) => {

        let endHour = Number(givenDate.substring(11,13)) + 1;
        let tempDate = givenDate.substring(0, 13);

        return moment(tempDate, 'YYYY-MM-DDThh').format('Do MMMM YYYY hh:mm a') + " to " + moment(endHour, 'hh').format('h:mm a');
    };

    useEffect(() => {
        getOldBooking();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <>
            {Cookies.get("name") !== undefined && Cookies.get("id") !== undefined 
                ? <Layout2 id={Cookies.get("id")} name={Cookies.get("name")} action="Booking overview">
                    <div className="parent">
                        <div className="home-page">
                            <div style={{display: 'flex', flexDirection: 'row', paddingRight: 20}}>
                                <div className="column">
                                    {oldVenueInfo === undefined || bookingInfo === undefined ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> : oldVenueInfo.map((val, key) => {
                                        return (<div key={key}>
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}><h3>Currently selected:</h3></div>
                                                <div style={{overflowY: "auto", height: 430}}>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Venue type </div></div>
                                                    <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Roomtypename} </div></div>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Venue name </div></div>
                                                    <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div></div>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Location </div></div>
                                                    <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div></div>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Max capacity </div></div>
                                                    <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{val.Maxcapacity} </div></div>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Equipment </div></div>
                                                    <div className="display-old"><div style={{display: 'flex', flexDirection: 'column', width: 220, textAlign: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                                                        {/* {val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}
                                                        <br />{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}
                                                        <br />{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}
                                                        <br />{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"} */}
                                                        <div>{val.Facilitiesdict.Projector === undefined && val.Facilitiesdict.Screen === undefined && val.Facilitiesdict.Desktop === undefined && val.Facilitiesdict.Whiteboard === undefined ? "Nil" : ""}</div>
                                                        <div>{val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}</div>
                                                        <div>{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}</div>
                                                        <div>{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}</div>
                                                        <div>{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}</div>
                                                    </div></div>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Booking time </div></div>
                                                    <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{dateConverter(bookingInfo.Eventstart)} </div></div>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Pax booked </div></div>
                                                    <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{bookingInfo.Pax} </div></div>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Booking status </div></div>
                                                    <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{bookingInfo.Bookingstatusdescription} </div></div>
                                                    <div className="display-old-header"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>Sharing? </div></div>
                                                    <div className="display-old"><div style={{width: 220, textAlign: 'center', alignSelf: 'center'}}>{bookingInfo.Sharable ? "Yes" : "No"} </div></div>
                                                </div>
                                            </div>
                                        </div>);
                                    })}
                                </div>
                                {/* <div>
                                    <div className="booking-overview">
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
                                        // <div style={{margin: '0 auto', height: 300, width: 550, paddingLeft: 20}}><div style={{textAlign: 'center'}}>Selected Timeslots:</div>
                                        //     <div style = {{overflowY: "auto", height: 250}}>
                                        //         {cart === undefined ? "" : cart.map((val, key) => {
                                        //             return (<div key={key}>
                                        //                 <hr />
                                        //                 <div style={{height: 32, position:'relative'}}>
                                        //                     <div style = {{paddingLeft: 3, paddingTop: 4}}>Pax: {val.Pax} | Timing: {dateConverter(val.Eventstart)}</div>
                                        //                 </div>
                                        //             </div>);
                                        //         })}
                                        //     </div>
                                        //     <br />
                                        //     <div><button style={{position: 'absolute', bottom: 0, right: 0, margin: 25}} type="submit" className="btn btn-primary btn-block" onClick={confirmBooking}>Confirm Bookings</button></div>
                                        // </div>
                                        <div style={{margin: '0 auto', height: 300, width: 550, paddingLeft: 20}}><div style={{textAlign: 'center'}}>Selected Timeslots:</div>
                                    <div style = {{overflowY: "auto", height: 250}}>
                                        {cart === undefined ? "" : cart.map((val, key) => {
                                            return (<div key={key}>
                                                <hr />
                                                <div style={{height: 32, position:'relative'}}>
                                                    <div style = {{paddingLeft: 3, paddingTop: 4}}>Pax: {val.Pax} | Timing: {dateConverter(val.Eventstart)}</div>
                                                </div>
                                            </div>);
                                        })}
                                    </div>
                                    <br />
                                </div>
                                <div><button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={confirmBooking}>Confirm Bookings</button></div>
                                    </div>
                                </div> */}
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
                                    {venueInfo === undefined 
                                        ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> 
                                        : venueInfo.length === 0 
                                            ? <div className="display-selected-venue">
                                                <div style={{textAlign: 'center', alignSelf: 'center'}}>
                                                    <h3>No details to display</h3>
                                                </div>
                                            </div>
                                            : venueInfo.map((val, key) => {
                                                return (<div key={key}>
                                                    <div className="display-selected-venue" style={{height: 'auto'}}>
                                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                                            <div style={{width: 240, textAlign: 'center', alignSelf: 'center'}}>{val.Roomtypename} </div>
                                                            <div style={{width: 260, textAlign: 'center', alignSelf: 'center'}}>{val.Venuename} </div>
                                                            <div style={{width: 150, textAlign: 'center', alignSelf: 'center'}}>{val.Buildingname} {val.Unit} </div>
                                                            <div style={{width: 80, textAlign: 'center', alignSelf: 'center'}}>{val.Maxcapacity} </div>
                                                            <div style={{display: 'flex', flexDirection: 'column', width: 120, textAlign: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                                                                <div>{val.Facilitiesdict.Projector === undefined && val.Facilitiesdict.Screen === undefined && val.Facilitiesdict.Desktop === undefined && val.Facilitiesdict.Whiteboard === undefined ? "Nil" : ""}</div>
                                                                <div>{val.Facilitiesdict.Projector === undefined ? "" : val.Facilitiesdict.Projector === 1 ? val.Facilitiesdict.Projector + " projector" : val.Facilitiesdict.Projector + " projectors"}</div>
                                                                <div>{val.Facilitiesdict.Screen === undefined ? "" : val.Facilitiesdict.Screen === 1 ? val.Facilitiesdict.Screen + " screen" : val.Facilitiesdict.Screen + " screens"}</div>
                                                                <div>{val.Facilitiesdict.Desktop === undefined ? "" : val.Facilitiesdict.Desktop === 1 ? val.Facilitiesdict.Desktop + " desktop" : val.Facilitiesdict.Desktop + " desktops"}</div>
                                                                <div>{val.Facilitiesdict.Whiteboard === undefined ? "" : val.Facilitiesdict.Whiteboard === 1 ? val.Facilitiesdict.Whiteboard + " whiteboard" : val.Facilitiesdict.Whiteboard + " whiteboards"}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>);
                                            })
                                    }
                                    {/* <div style={{margin: '0 auto', height: 300, width: 550, paddingLeft: 20}}><div style={{textAlign: 'center'}}>Selected Timeslots:</div>
                                        <div style = {{overflowY: "auto", height: 250}}>
                                            {cart === undefined ? "" : cart.map((val, key) => {
                                                return (<div key={key}>
                                                    <hr />
                                                    <div style={{height: 32, position:'relative'}}>
                                                        <div style = {{paddingLeft: 3, paddingTop: 4}}>Pax: {val.Pax} | Timing: {dateConverter(val.Eventstart)}</div>
                                                    </div>
                                                </div>);
                                            })}
                                        </div>
                                        <br />
                                    </div>
                                    <div><button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={confirmBooking}>Confirm Bookings</button></div> */}
                                    <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                        <div style={{textAlign: 'center'}}>Currently selected Timeslots:</div>
                                        <div style = {{margin: '0 auto', overflowY: "auto", height: 240, marginBottom: 10}}>
                                            {cart === undefined 
                                                ? <div><h2 style={{textAlign: 'center', alignContent: 'center'}}>Loading... </h2></div> 
                                                : cart.length === 0 
                                                    ? <div>
                                                        <div style={{textAlign: 'center', alignSelf: 'center'}}>
                                                            <h3>Add a timeslot</h3>
                                                        </div>
                                                    </div>
                                                    : cart.map((val, key) => {
                                                        return (<div key={key}>
                                                            <hr />
                                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                                <div style={{width: "auto", textAlign: 'center', alignSelf: 'center', paddingRight: 10}}>Pax: {val.Pax} | Timing: {dateConverter(val.Eventstart)}</div>
                                                            </div>
                                                        </div>);
                                                    })
                                            }
                                        </div>
                                        <br />
                                        <div style={{textAlign: 'right'}}>
                                            <button type="submit" className="btn btn-primary btn-block" onClick={confirmBooking}>Proceed</button> 
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

export default EditOverview;
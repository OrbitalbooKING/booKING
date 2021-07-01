import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

import moment from "moment";

function BookingOverview(props) {

    let history = useHistory();

    const [cart, setCart] = useState();

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

    const confirmBooking = () => {
        if (cart !== undefined) {
            let tempArr = [];
        
            for (let i = 0; i < cart.length; i++) {
                tempArr.push(cart[i].Bookingid);
            }
            console.log(tempArr);

            Axios.put(configData.LOCAL_HOST + "/make_booking", 
            {
                bookingID: tempArr
            }).then(response => { 
                history.push({
                    pathname: "/booking-success",
                    state: {
                        id: props.location.state.id,
                        name: props.location.state.name
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
        getCartItems();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {props.location.state !== undefined 
                ? <Layout2 id={props.location.state.id} name={props.location.state.name} action="Booking overview">
                    <div className="parent">
                        <div className="home-page">
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
                                <div style={{margin: '0 auto', height: 300, width: 550, paddingLeft: 20}}><div style={{textAlign: 'center'}}>Selected Timeslots:</div>
                                    <div style = 
                                    {{overflowY: "auto", height: 250}}
                                    >
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
                                    <button style={{position: 'absolute', bottom: 0, right: 0, margin: 25}} type="submit" className="btn btn-primary btn-block" onClick={confirmBooking}>Confirm Bookings</button>
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

export default BookingOverview;
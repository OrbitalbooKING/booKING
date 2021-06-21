import { useState, useEffect } from "react";
import history from "../history";
import Axios from "axios";
import configData from "../config.json";
import Layout2 from "../layouts/Layout2";
import Unauthorised from "./Unauthorised";

import moment from "moment";


const style = {
    padding: 5
};

function BookingOverview(props) {

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
            if (error.response.status === 400) {
                console.log(error.response.data.message);
            } else {
                console.log("Query failed!");
            }
        });
    };

    useEffect(() => {
        getCartItems();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        id: props.location.state.id
                    }
                });
            }).catch((error) => {
                if (error.response.status === 400) {
                    console.log(error.response.data.message);
                } else {
                    console.log("Query failed!");
                }
            }); 
        }
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
                    <Layout2 id={props.location.state.id} action="Booking overview">
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
                                <button style={{float: 'right'}} type="submit" className="btn btn-primary btn-block" onClick={confirmBooking}>Confirm Bookings</button>
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

export default BookingOverview;
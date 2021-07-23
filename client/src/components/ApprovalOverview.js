import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import configData from "../config.json";
import Layout3 from "../layouts/Layout3";
import Home from "./Home";
import Unauthorised from "./Unauthorised";

import moment from "moment";

import * as Cookies from "js-cookie";

function ApprovalOverview() {
  let history = useHistory();

  const [bookingInfo, setBookingInfo] = useState();

  const getBookingInfo = () => {
    let search = new URLSearchParams();

    search.append("bookingID", Cookies.get("bookingId"));

    Axios.get(configData.LOCAL_HOST + "/check_booking", {
      params: search,
    })
      .then((response) => {
        console.log(response.data.data);
        setBookingInfo(response.data.data);
      })
      .catch((error) => {
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

  const approveBooking = () => {
    if (bookingInfo !== undefined) {
      let tempArr = [];

      tempArr.push(Cookies.get("bookingId"));

      Axios.put(configData.LOCAL_HOST + "/approve_bookings", {
        bookingID: tempArr,
      })
        .then((response) => {
          history.push({
            pathname: "/approval-success",
            state: { success: true },
          });
        })
        .catch((error) => {
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
    let endHour = Number(givenDate.substring(11, 13)) + 1;
    let tempDate = givenDate.substring(0, 13);

    return (
      moment(tempDate, "YYYY-MM-DDThh").format("Do MMMM YYYY hh:mm a") +
      " to " +
      moment(endHour, "hh").format("h:mm a")
    );
  };

  useEffect(() => {
    getBookingInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Cookies.get("name") !== undefined &&
      Cookies.get("id") !== undefined &&
      Cookies.get("account") === "Staff" &&
      Cookies.get("bookingId") !== undefined ? (
        <Layout3
          id={Cookies.get("id")}
          name={Cookies.get("name")}
          action="Approval confirmation"
        >
          <div className="parent">
            <div className="home-page">
              <div className="booking-view">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="display-booking-header">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          width: 100,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Requestor{" "}
                      </div>
                      <div
                        style={{
                          width: 100,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Requestor's faculty{" "}
                      </div>
                      <div
                        style={{
                          width: 100,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Booking id{" "}
                      </div>
                      <div
                        style={{
                          width: 180,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Venue name{" "}
                      </div>
                      <div
                        style={{
                          width: 100,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Location{" "}
                      </div>
                      <div
                        style={{
                          width: 150,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Date{" "}
                      </div>
                      <div
                        style={{
                          width: 70,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Pax{" "}
                      </div>
                      <div
                        style={{
                          width: 80,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Sharing?{" "}
                      </div>
                      <div
                        style={{
                          width: 80,
                          textAlign: "center",
                          alignSelf: "center",
                        }}
                      >
                        Status{" "}
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingBottom: 10 }}>
                    {bookingInfo === undefined ? (
                      <div>
                        <h2
                          style={{
                            textAlign: "center",
                            alignContent: "center",
                          }}
                        >
                          Loading...{" "}
                        </h2>
                      </div>
                    ) : (
                      <div
                        className="display-booking"
                        style={{ height: "auto" }}
                      >
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div
                            style={{
                              width: 100,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {bookingInfo.Nusnetid}{" "}
                          </div>
                          <div
                            style={{
                              width: 100,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {bookingInfo.Facultydescription}{" "}
                          </div>
                          <div
                            style={{
                              width: 100,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {bookingInfo.BookingID.substring(0, 4)}
                          </div>
                          <div
                            style={{
                              width: 180,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {bookingInfo.Venuename}{" "}
                          </div>
                          <div
                            style={{
                              width: 100,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {bookingInfo.Buildingname} {bookingInfo.Unit}{" "}
                          </div>
                          <div
                            style={{
                              width: 150,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {dateConverter(bookingInfo.Eventstart)}{" "}
                          </div>
                          <div
                            style={{
                              width: 70,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {bookingInfo.Pax}{" "}
                          </div>
                          <div
                            style={{
                              width: 80,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {bookingInfo.Sharable ? "Yes" : "No"}{" "}
                          </div>
                          <div
                            style={{
                              width: 80,
                              textAlign: "center",
                              alignSelf: "center",
                            }}
                          >
                            {bookingInfo.Bookingstatusdescription}{" "}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", paddingRight: 15 }}>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={approveBooking}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout3>
      ) : Cookies.get("name") !== undefined &&
        Cookies.get("id") !== undefined &&
        Cookies.get("account") !== undefined ? (
        <Home />
      ) : (
        <Unauthorised />
      )}
    </>
  );
}

export default ApprovalOverview;

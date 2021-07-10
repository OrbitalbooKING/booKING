package models

import (
	"time"

	"github.com/google/uuid"
)

type Bookingstatuses struct {
	ID                       int    `csv:"bookingStatusID"`
	Bookingstatusdescription string `csv:"description"`
}

type Notificationtypes struct {
	ID                          int    `csv:"notificationStatusID"`
	Notificationtype            string `csv:"notificationType"`
	Notificationtypedescription string `csv:"description"`
}

type TimingSearchInput struct {
	UnitNo       string    `form:"unitNo"`
	Buildingname string    `form:"buildingName"`
	Eventstart   time.Time `form:"eventStart"`
	Eventend     time.Time `form:"eventEnd"`
	Pax          int       `form:"pax"`
	Sharable     bool      `form:"sharable"`
}

type UnavailableTimings struct {
	Venuename    string
	Unit         string
	Maxcapacity  int
	Buildingname string
	Starthour    time.Time
	Endhour      time.Time
	Eventstart   time.Time
	Eventend     time.Time
	Sumpax       int
}

type Timeslots struct {
	EventStart time.Time
	EventEnd   time.Time
	Available  bool
}

type BookingInput struct {
	Nusnetid     string    `json:"NUSNET_ID"`
	UnitNo       string    `json:"unitNo"`
	Buildingname string    `json:"buildingName"`
	Pax          int       `json:"pax"`
	Eventstart   time.Time `json:"eventStart"`
	Eventend     time.Time `json:"eventEnd"`
	Venueid      int
}

type Retrievebookings struct {
	ID uuid.UUID `form:"bookingID"`
}

type URLBooking struct {
	BookingID string `form:"bookingID"`
}

type PendingBookings struct {
	Venueid      int
	Venuename    string
	Unit         string
	Buildingid   int
	Buildingname string
	Pax          int
	Eventstart   time.Time
	Eventend     time.Time
	Bookingid    uuid.UUID
}

type MakeDeleteBookings struct {
	BookingID []string `json:"bookingID" form:"bookingID"`
}

type Currentbookings struct {
	ID              uuid.UUID
	Nusnetid        string
	Venueid         int
	Pax             int
	Createdat       time.Time
	Eventstart      time.Time
	Eventend        time.Time
	Bookingstatusid int
	Lastupdated     time.Time
}

type BookingDetails struct {
	Venuename                string
	Buildingname             string
	Buildingid               int
	Unit                     string
	Eventstart               time.Time
	Pax                      int
	Bookingid                uuid.UUID
	Bookingstatusdescription string
	Sharable                 bool
}

type BookingRequests struct {
	Nusnetid                 string
	Facultydescription       string
	Venuename                string
	Buildingname             string
	Unit                     string
	Eventstart               time.Time
	Pax                      int
	ID                       uuid.UUID `json:"BookingID"`
	Bookingstatusdescription string
	Sharable                 bool
}

package models

import "time"

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
	ID int
}

type PendingBookings struct {
	Venueid    int
	Venuename  string
	Pax        int
	Eventstart time.Time
	Eventend   time.Time
	Bookingid  int
}

type MakeDeleteBookings struct {
	BookingID []int `json:"bookingID" form:"bookingID"`
}

type Currentbookings struct {
	Nusnetid        string
	Venueid         int
	Pax             int
	Createdat       time.Time
	Eventstart      time.Time
	Eventend        time.Time
	Bookingstatusid int
	Lastupdated     time.Time
}

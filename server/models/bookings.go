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
	// Pax          int       `form:"Pax"`
}

type Venueschedules struct {
	ID        int
	Venueid   int
	Dayofweek int
	Bookingid int
	Starthour time.Time
	Endhour   time.Time
}

type UnavailableTimings struct {
	Venuename    string
	Unit         string
	Maxcapacity  int
	Buildingname string
	Starthour    string
	Endhour      string
	Eventstart   string
	Eventend     string
	Pax          int
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

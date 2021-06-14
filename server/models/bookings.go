package models

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
	Venuename    string
	Unit         string
	Buildingname string
	Eventdate    string
}

type UnavailableTimings struct {
	Venuename         string
	Unit              string
	Maxcapacity       int
	Remainingcapacity int
	Buildingname      string
	Eventstart        string
	Eventend          string
}

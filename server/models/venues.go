package models

import (
	"time"
)

// remember db names all no caps except first alphabet
// create table with plural name

type Venues struct {
	ID            int
	Venuename     string
	Unit          string
	Maxcapacity   int
	Buildingid    int
	Roomtypeid    int
	Venuestatusid int
	Mapphoto      string
	Floorplan     string
}

type Venuetimings struct {
	ID        int    `csv:"venueTimingID"`
	Venueid   int    `csv:"venueID"`
	Dayofweek int    `csv:"dayOfWeek"`
	Starthour string `csv:"startHour"`
	Endhour   string `csv:"endHour"`
}

type Venuestatuses struct {
	ID                     int    `csv:"venueStatusID"`
	Venuestatusname        string `csv:"statusName"`
	Venuestatusdescription string `csv:"statusDescription"`
}

type Roomtypes struct {
	ID           int
	Roomtypename string `csv:"Venue type"`
}

type Venuefacilities struct {
	ID         int `csv:"venueFacilityID"`
	Venueid    int `csv:"venueID"`
	Facilityid int `csv:"facilityID"`
	Quantity   int `csv:"quantity"`
}

type Facilities struct {
	ID                  int    `csv:"facilityID"`
	Facilityname        string `csv:"name"`
	Facilitydescription string `csv:"description"`
}

type Faculties struct {
	ID                 int    `csv:"facultyID"`
	Facultyname        string `csv:"name"`
	Facultydescription string `csv:"description"`
}

type Buildings struct {
	ID                  int    `csv:"buildingID"`
	Buildingname        string `csv:"Location"`
	Buildingdescription string `csv:"description"`
}

type VenuesAndFacilities struct {
	ID           int
	Venueid      int
	Facilityid   int
	Quantity     int
	Facilityname string
}

type SearchPage struct {
	ID              int
	Venuename       string
	Unit            string
	Buildingname    string
	Buildingid      int
	Maxcapacity     int
	Roomtypename    string
	Roomtypeid      int
	Venuestatusname string
	Mapphoto        string
	Floorplan       string
	Facilitiesdict  map[string]int
}

type SearchInput struct {
	Equipment  []string   `form:"equipment"`
	Capacity   int        `form:"capacity"`
	Venuename  *string    `form:"venueName"`    // pointer to accept null
	Buildingid int        `form:"buildingName"` // pointer to accept null
	UnitNo     *string    `form:"unitNo"`       // pointer to accept null
	RoomType   int        `form:"roomType"`     // pointer to accept null
	StartHour  *time.Time `form:"startHour"`    // pointer to accept null
	EndHour    *time.Time `form:"endHour"`      // pointer to accept null
}

package models

// remember db names all no caps except first alphabet
// create table with plural name

type Venues struct {
	ID                int
	Venuename         string
	Unit              string
	Maxcapacity       int
	Remainingcapacity int
	Buildingid        int
	Roomtypeid        int
	Venuestatusid     int
	Mapphoto          string
	Floorplan         string
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

type Homepage struct {
	ID              int
	Venuename       string
	Unit            string
	Buildingname    string
	Maxcapacity     int
	Roomtypename    string
	Venuestatusname string
	Mapphoto        string
	Floorplan       string
	Facilitiesdict  map[string]int
}

type SearchInput struct {
	Equipment    []string `json:"equipment"`
	Capacity     int      `json:"capacity"`
	BuildingName string   `json:"buildingName"`
	UnitNo       string   `json:"unitNo"`
	RoomType     string   `json:"roomType"`
}

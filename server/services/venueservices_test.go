package services

import (
	"database/sql"
	"reflect"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/OrbitalbooKING/booKING/server/models"
	"github.com/jinzhu/gorm"
)

func setupVenues(table string) (sqlmock.Sqlmock, *Repository, *sqlmock.Rows, error) {
	type Table struct {
		Headers []string
	}

	tables := map[string]Table{
		"VenueIDArrQuery": {
			Headers: []string{"v.id", "v.venuename", "v.unit", "buildingname", "buildingid", "v.maxcapacity",
				"roomtypename", "v.roomtypeid", "venuestatusname", "v.mapphoto", "v.floorplan"},
		},
		"VenueIDArrAfterFilter": {
			Headers: []string{"v.id"},
		},
		"FacilityIDArr": {
			Headers: []string{"id", "facilityName", "facilityDescription"},
		},
		"VenuesAndFacilities": {
			Headers: []string{"id", "venueid", "facilityid", "quantity", "facilityname"},
		},
		"SearchPage": {
			Headers: []string{"id", "venuename", "unit", "buildingname", "buildingid", "maxcapacity", "roomtypename",
				"roomtypeid", "venuestatusname", "mapphoto", "floorplan"},
		},
	}
	var repository *Repository
	var mock sqlmock.Sqlmock
	var db *sql.DB
	var err error

	db, mock, err = sqlmock.New()
	if err != nil {
		return nil, nil, nil, err
	}
	gdb, err := gorm.Open("postgres", db)
	if err != nil {
		return nil, nil, nil, err
	}
	repository = &Repository{db: gdb}

	rows := sqlmock.NewRows(tables[table].Headers)
	if table == "CurrentBookings" {
		rows = rows.AddRow(1, "e001", 1, 10, time.Time{}, time.Time{}, time.Time{}, 1, time.Time{}).
			AddRow(1, "e001", 1, 10, time.Time{}, time.Time{}, time.Time{}, 1, time.Time{}).
			AddRow(1, "e001", 1, 10, time.Time{}, time.Time{}, time.Time{}, 1, time.Time{})
	} else if table == "VenueIDArrQuery" {
		rows = rows.AddRow(2, "test", "01-01", "test", 1, 10, "test", 1, "test", "test", "test").
			AddRow(3, "test", "01-01", "test", 1, 10, "test", 1, "test", "test", "test").
			AddRow(4, "test", "01-01", "test", 1, 10, "test", 1, "test", "test", "test")
	} else if table == "VenueIDArrAfterFilter" {
		rows = rows.AddRow(1).
			AddRow(2)
	} else if table == "FacilityIDArr" {
		rows = rows.AddRow(1, "Desktop", "CRHHBSWE").
			AddRow(2, "Projector", "OGAFZFXT")
	} else if table == "VenuesAndFacilities" {
		rows = rows.AddRow(1, 1, 1, 1, "Desktop").
			AddRow(2, 1, 2, 1, "Projector")
	} else if table == "SearchPage" {
		rows = rows.AddRow(1, "test", "test", "test", 1, 1, "test", 1, "test", "test", "test").
			AddRow(2, "test", "test", "test", 1, 1, "test", 1, "test", "test", "test")
	}

	return mock, repository, rows, nil
}

func TestGetVenueArr_ValidInput(t *testing.T) {
	mock, repo, rows, err := setupVenues("VenueIDArrQuery")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	input := []models.SearchPage{
		{
			ID: 2,
		},
		{
			ID: 3,
		},
		{
			ID: 4,
		},
	}

	query := regexp.QuoteMeta(`
		SELECT DISTINCT v.id, v.venuename, v.unit, buildingname, buildingid, v.maxcapacity, roomtypename, v.roomtypeid, 
						venuestatusname, v.mapphoto, v.floorplan 
		FROM venues AS v 
		JOIN buildings ON buildings.id = v.buildingid 
		JOIN roomtypes ON roomtypes.id = v.roomtypeid 
		JOIN venuestatuses ON venuestatuses.id = v.venuestatusid`)

	mock.ExpectQuery(query).WithArgs(2, 3, 4).WillReturnRows(rows)

	if searchPage, exists, err := GetVenueArr(repo.db, input); searchPage == nil || !exists || err != nil || len(searchPage) != len(input) {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !exists {
			t.Fatalf("searchPage unexpectedly not found even with valid inputs")
		}
		if len(searchPage) != len(input) {
			t.Errorf("Incorrect number of entries. Expected: %d, got: %d", len(searchPage), len(input))
		}
		if searchPage == nil {
			t.Fatalf("Search page unexpectedly empty for a valid input.")
		}
	}
}

func TestGetVenueArr_InvalidInput(t *testing.T) {
	mock, repo, _, err := setupVenues("VenueIDArrQuery")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	input := []models.SearchPage{
		{
			ID: 2,
		},
		{
			ID: 3,
		},
		{
			ID: 4,
		},
	}

	query := regexp.QuoteMeta(`
		SELECT DISTINCT v.id, v.venuename, v.unit, buildingname, buildingid, v.maxcapacity, roomtypename, v.roomtypeid, 
						venuestatusname, v.mapphoto, v.floorplan 
		FROM venues AS v 
		JOIN buildings ON buildings.id = v.buildingid 
		JOIN roomtypes ON roomtypes.id = v.roomtypeid 
		JOIN venuestatuses ON venuestatuses.id = v.venuestatusid`)

	mock.ExpectQuery(query).WithArgs(2, 3, 4).WillReturnError(gorm.ErrRecordNotFound)

	if searchPage, exists, err := GetVenueArr(repo.db, input); searchPage != nil || exists || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if exists {
			t.Fatalf("searchPage unexpectedly  found even with invalid inputs")
		}
		if searchPage != nil {
			t.Fatalf("Search page unexpectedly not empty for an invalid input.")
		}
	}
}

func TestGetVenueIDArrAfterFilter(t *testing.T) {
	mock, repo, rows, err := setupVenues("VenueIDArrAfterFilter")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}
	testString := "test"

	input := models.SearchInput{
		Equipment:  []string{"1", "2"},
		Capacity:   1,
		Venuename:  &testString,
		Buildingid: 1,
		UnitNo:     &testString,
		RoomType:   1,
		StartHour:  &time.Time{},
		EndHour:    &time.Time{},
	}

	query := regexp.
		QuoteMeta(`SELECT DISTINCT v.id FROM venues AS v WHERE v.id NOT IN ( SELECT cb.venueID FROM currentBookings AS cb WHERE cb.venueID = v.id AND cb.eventStart > TIMESTAMP '0001-01-01T00:00:00Z' AND cb.eventEnd < TIMESTAMP '0001-01-01T00:00:00Z') AND v.id IN ( SELECT vt.venueID FROM venueTimings AS vt WHERE vt.venueID = v.id AND vt.dayOfWeek = 1 AND vt.startHour <= coalesce('00:00', startHour) AND vt.endHour >= coalesce('00:00', endHour)) AND v.id NOT IN ( SELECT cb.venueID FROM currentBookings AS cb WHERE cb.venueID = v.id AND (cb.eventStart >= TIMESTAMP '0001-01-01T00:00:00Z' OR cb.eventEnd <= TIMESTAMP '0001-01-01T00:00:00Z') GROUP BY cb.venueID HAVING SUM(cb.pax) > v.maxCapacity - 1) AND v.id IN ( SELECT ID FROM venues WHERE maxcapacity >= 1) AND v.id IN ( SELECT venueID FROM venueFacilities AS vf WHERE vf.venueID = v.id AND vf.facilityid IN (1,2) GROUP BY vf.venueid HAVING COUNT(vf.facilityid) > 2) AND v.id IN ( SELECT ID FROM venues WHERE venuename = 'test') AND v.id IN ( SELECT ID from venues WHERE buildingid = 1) AND v.id IN ( SELECT ID from venues WHERE unit = 'test') AND v.id IN ( SELECT ID from venues WHERE roomtypeid = 1) ORDER BY v.id`)

	mock.ExpectQuery(query).WillReturnRows(rows)

	if searchPage, err := GetVenueIDArrAfterFilter(repo.db, input, []int{1, 2}); err != nil || len(searchPage) != 2 {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if len(searchPage) != 2 {
			t.Errorf("Incorrect number of entries. Expected: %d, got: %d", 2, len(searchPage))
		}
	}
}

func TestGetFacilityIDArr(t *testing.T) {
	mock, repo, _, err := setupVenues("FacilityIDArr")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	input := models.SearchInput{
		Equipment: []string{"Desktop", "Projector"},
	}
	query := regexp.QuoteMeta(`SELECT id FROM facilities WHERE facilityname = $1`)

	mock.ExpectQuery(query).WithArgs("Desktop").
		WillReturnRows(sqlmock.NewRows([]string{"id", "facilityName", "facilityDescription"}).
			AddRow("1", "Desktop", "CRHHBSWE"))
	mock.ExpectQuery(query).WithArgs("Projector").
		WillReturnRows(sqlmock.NewRows([]string{"id", "facilityName", "facilityDescription"}).
			AddRow("2", "Projector", "OGAFZFXT"))

	if searchPage, err := GetFacilityIDArr(repo.db, input); err != nil || len(searchPage) != 2 {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if len(searchPage) != 2 {
			t.Errorf("Incorrect number of entries. Expected: %d, got: %d", 2, len(searchPage))
		}
	}
}

func TestGetVenueFacilities(t *testing.T) {
	mock, repo, rows, err := setupVenues("VenuesAndFacilities")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	input := models.SearchPage{
		ID: 1,
	}
	query := regexp.
		QuoteMeta(`SELECT * FROM public.Venuefacilities 
					JOIN public.Facilities ON public.Venuefacilities.facilityid = public.facilities.id 
					WHERE venueid = $1;`)

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(rows)

	if venueFacilities, err := GetVenueFacilities(repo.db, input); err != nil || len(venueFacilities) != 2 {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if len(venueFacilities) != 2 {
			t.Errorf("Incorrect number of entries. Expected: %d, got: %d", 2, len(venueFacilities))
		}
	}
}

func TestGetSearchPage(t *testing.T) {
	mock, repo, rows, err := setupVenues("SearchPage")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.
		QuoteMeta(`SELECT * FROM Venues
		JOIN Buildings ON Venues.buildingid = Buildings.id
		JOIN RoomTypes ON Venues.roomtypeid = RoomTypes.id
		JOIN VenueStatuses ON Venues.venuestatusid = VenueStatuses.id`)

	mock.ExpectQuery(query).WillReturnRows(rows)

	if searchPage, err := GetSearchPage(repo.db); err != nil || len(searchPage) != 2 {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if len(searchPage) != 2 {
			t.Errorf("Incorrect number of entries. Expected: %d, got: %d", 2, len(searchPage))
		}
	}
}

func TestMakeVenueFacilitiesDict_Stubbed(t *testing.T) {
	mock, repo, rows, err := setupVenues("VenuesAndFacilities")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	input := []models.SearchPage{
		{
			ID: 1,
		},
	}
	query := regexp.
		QuoteMeta(`SELECT * FROM public.Venuefacilities 
					JOIN public.Facilities ON public.Venuefacilities.facilityid = public.facilities.id 
					WHERE venueid = $1;`)

	mock.ExpectQuery(query).WithArgs(1).WillReturnRows(rows)
	dict := make(map[string]int)
	dict["Desktop"] = 1
	dict["Projector"] = 1
	expected := []models.SearchPage{
		{
			ID:             1,
			Facilitiesdict: dict,
		},
	}

	if err := MakeVenueFacilitiesDict(repo.db, input); err != nil || !reflect.DeepEqual(input, expected) {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !reflect.DeepEqual(input, expected) {
			t.Errorf("Dict not made properly. Expected to get dict %v but got value %v",
				expected, input)
		}
	}
}

func TestMakeVenueFacilitiesDict(t *testing.T) {
	if err := ConnectDataBase(); err != nil {
		t.Fatalf("Unexpected error. Unable to connect to the database." + err.Error())
	}
	input := []models.SearchPage{
		{
			ID: 3,
		},
	}
	dict := make(map[string]int)
	dict["Desktop"] = 7
	dict["Projector"] = 39
	dict["Whiteboard"] = 23
	// taken from database for venue with venueID = 3
	expected := []models.SearchPage{
		{
			ID:             3,
			Facilitiesdict: dict,
		},
	}

	if err := MakeVenueFacilitiesDict(DB, input); err != nil || !reflect.DeepEqual(input, expected) {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !reflect.DeepEqual(input, expected) {
			t.Errorf("Dict not made properly. Expected to get dict %v but got value %v",
				expected, input)
		}
	}
}

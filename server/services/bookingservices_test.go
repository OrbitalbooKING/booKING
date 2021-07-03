package services

import (
	"database/sql"
	"errors"
	"fmt"
	"reflect"
	"regexp"
	"server/models"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

func setupBookings(table string) (sqlmock.Sqlmock, *Repository, *sqlmock.Rows, error) {
	type Table struct {
		Headers []string
	}

	tables := map[string]Table{
		"GetBookingsOfDay": {
			Headers: []string{"cb.eventstart", "sumpax"},
		},
		"GetVenueIDAndMaxCapacity": {
			Headers: []string{"id", "maxcapacity"},
		},
		"GetAllBookingStatusCodes": {
			Headers: []string{"id", "bookingstatusdescription"},
		},
		"GetBookingStatusCode": {
			Headers: []string{"id", "bookingstatusdescription"},
		},
		"GetOperatingHours": {
			Headers: []string{"venuename", "unit", "maxcapacity", "buildingname", "starthour", "endhour"},
		},
		"GetPendingBookings": {
			Headers: []string{"venueid", "venuename", "pax", "eventstart", "eventend", "bookingid"},
		},
		"CheckIfOverLimitAndTime_False": {
			Headers: []string{"eventStart", "sumpax"},
		},
		"CheckIfOverLimitAndTime_OverPax": {
			Headers: []string{"eventStart", "sumpax"},
		},
		"CheckIfOverLimitAndTime_OverTime": {
			Headers: []string{"eventStart", "sumpax"},
		},
		"GetVenueFromBuildingAndUnit": {
			Headers: []string{"id", "venuename", "unit", "maxcapacity", "buildingid", "roomtypeid", "venuestatusid",
				"mapphoto", "floorplan"},
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
	if table == "GetBookingsOfDay" {
		rows = rows.AddRow("test1", 10).
			AddRow("test2", 20)
	} else if table == "GetVenueIDAndMaxCapacity" {
		rows = rows.AddRow(1, 10)
	} else if table == "GetAllBookingStatusCodes" {
		rows = rows.AddRow(1, "In the midst of booking").
			AddRow(2, "Pending approval").
			AddRow(3, "Approved")
	} else if table == "GetBookingStatusCode" {
		rows = rows.AddRow(1, "In the midst of booking")
	} else if table == "GetOperatingHours" {
		rows = rows.AddRow("test", "test", 10, "test", time.Time{}, time.Time{})
	} else if table == "CheckIfOverLimitAndTime_False" {
		rows = rows.AddRow(time.Time{}, 5)
	} else if table == "CheckIfOverLimitAndTime_OverPax" {
		rows = rows.AddRow(time.Time{}, 100)
	} else if table == "CheckIfOverLimitAndTime_OverTime" {
		rows = rows.AddRow(time.Time{}, 5)
	} else if table == "GetVenueFromBuildingAndUnit" {
		rows = rows.AddRow(1, "test", "test", 10, 1, 1, 1, "test", "test")
	}

	return mock, repository, rows, nil
}

func TestMakeTimeslotArr(t *testing.T) {
	start, _ := time.Parse(time.RFC3339, "0001-01-01T09:00:00.000Z")
	end, _ := time.Parse(time.RFC3339, "0001-01-01T13:00:00.000Z")
	booking1Start, _ := time.Parse(time.RFC3339, "0001-01-01T11:00:00.000Z")
	booking1End, _ := time.Parse(time.RFC3339, "0001-01-01T12:00:00.000Z")

	operatingHours := models.UnavailableTimings{
		Venuename:    "",
		Unit:         "",
		Maxcapacity:  0,
		Buildingname: "",
		Starthour:    start,
		Endhour:      end,
		Eventstart:   time.Time{},
		Eventend:     time.Time{},
		Sumpax:       0,
	}

	timingWithPax := []models.UnavailableTimings{
		{
			Venuename:    "",
			Unit:         "",
			Maxcapacity:  0,
			Buildingname: "",
			Starthour:    time.Time{},
			Endhour:      time.Time{},
			Eventstart:   booking1Start,
			Eventend:     booking1End,
			Sumpax:       10,
		},
	}

	input := models.TimingSearchInput{
		UnitNo:       "",
		Buildingname: "",
		Eventstart:   time.Time{},
		Eventend:     time.Time{},
		Pax:          10,
	}

	venue := models.Venues{
		ID:            0,
		Venuename:     "",
		Unit:          "",
		Maxcapacity:   15,
		Buildingid:    0,
		Roomtypeid:    0,
		Venuestatusid: 0,
		Mapphoto:      "",
		Floorplan:     "",
	}

	ten, _ := time.Parse(time.RFC3339, "0001-01-01T10:00:00.000Z")

	expected := []models.Timeslots{
		{
			EventStart: start,
			EventEnd:   ten,
			Available:  true,
		},
		{
			EventStart: ten,
			EventEnd:   booking1Start,
			Available:  true,
		},
		{
			EventStart: booking1Start,
			EventEnd:   booking1End,
			Available:  false,
		},
		{
			EventStart: booking1End,
			EventEnd:   end,
			Available:  true,
		},
	}

	timeslots := MakeTimeslotArr(operatingHours, timingWithPax, input, venue)
	if !reflect.DeepEqual(timeslots, expected) {
		t.Errorf("Expected to get array with %v, but got: %v", expected, timeslots)
	}
	for i := range timeslots {
		if timeslots[i].Available != expected[i].Available {
			t.Errorf("At start timing %v, expected to get timeslot available is %t, but got %t",
				expected[i].EventStart, expected[i].Available, timeslots[i].Available)
		}
	}
}

func TestGetBookingsOfDay(t *testing.T) {
	mock, repo, rows, err := setupBookings("GetBookingsOfDay")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	input := models.TimingSearchInput{
		UnitNo:       "",
		Buildingname: "",
		Eventstart:   time.Time{},
		Eventend:     time.Time{},
		Pax:          0,
	}
	venue := models.Venues{
		ID:            1,
		Venuename:     "",
		Unit:          "",
		Maxcapacity:   0,
		Buildingid:    0,
		Roomtypeid:    0,
		Venuestatusid: 0,
		Mapphoto:      "",
		Floorplan:     "",
	}
	statusIDArr := []int{1, 2, 3}

	expected := []models.UnavailableTimings{
		{
			Eventstart: time.Time{},
			Sumpax:     10,
		},
		{
			Eventstart: time.Time{},
			Sumpax:     20,
		},
	}

	query := regexp.
		QuoteMeta(`SELECT cb.eventstart, SUM(pax) AS sumpax FROM currentBookings AS cb 
						JOIN venues ON venues.id = cb.venueid 
						WHERE (cb.eventStart >= $1 OR cb.eventEnd <= $2) 
						AND cb.venueid = $3 
						AND cb.bookingstatusid IN ($4,$5,$6) 
						GROUP BY cb.eventstart`)
	mock.ExpectQuery(query).WithArgs(AnyTime{}, AnyTime{}, 1, 1, 2, 3).WillReturnRows(rows)

	if timingWithPax, err := GetBookingsOfDay(repo.db, input, venue, statusIDArr); !reflect.DeepEqual(expected, timingWithPax) || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !reflect.DeepEqual(expected, timingWithPax) {
			t.Errorf("Expected to get array %v. Got %v instead", expected, timingWithPax)
		}
	}
}

func TestGetVenueIDAndMaxCapacity(t *testing.T) {
	mock, repo, rows, err := setupBookings("GetVenueIDAndMaxCapacity")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	input := models.TimingSearchInput{
		UnitNo:       "test",
		Buildingname: "test",
		Eventstart:   time.Time{},
		Eventend:     time.Time{},
		Pax:          0,
	}

	expected := models.Venues{
		ID:            1,
		Venuename:     "",
		Unit:          "",
		Maxcapacity:   10,
		Buildingid:    0,
		Roomtypeid:    0,
		Venuestatusid: 0,
		Mapphoto:      "",
		Floorplan:     "",
	}

	query := regexp.
		QuoteMeta(`SELECT v.id, v.maxcapacity FROM venues AS v 
						JOIN buildings on buildings.id = v.buildingid 
						WHERE unit = $1 AND buildingname = $2`)
	mock.ExpectQuery(query).WithArgs(input.UnitNo, input.Buildingname).WillReturnRows(rows)

	if venue, err := GetVenueIDAndMaxCapacity(repo.db, input); !reflect.DeepEqual(expected, venue) || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !reflect.DeepEqual(expected, venue) {
			t.Errorf("Expected to get venue struct %v. Got venue struct %v instead", expected, venue)
		}
	}
}

func TestGetAllBookingStatusCodes(t *testing.T) {
	mock, repo, rows, err := setupBookings("GetAllBookingStatusCodes")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT * FROM "bookingstatuses" WHERE (bookingstatusdescription IN ($1,$2,$3))`)
	mock.ExpectQuery(query).
		WithArgs("In the midst of booking", "Pending approval", "Approved").
		WillReturnRows(rows)
	expected := []int{1, 2, 3}

	if statusIDArr, err := GetAllBookingStatusCodes(repo.db); reflect.DeepEqual(statusIDArr, expected) || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !reflect.DeepEqual(statusIDArr, expected) {
			t.Errorf("Expected to get array %v. Got %v instead",
				expected, statusIDArr)
		}
	}
}

func TestGetBookingStatusCode(t *testing.T) {
	mock, repo, rows, err := setupBookings("GetBookingStatusCode")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT * FROM bookingstatuses WHERE bookingstatusdescription = $1`)
	mock.ExpectQuery(query).
		WithArgs("In the midst of booking").
		WillReturnRows(rows)
	expected := models.Bookingstatuses{
		ID:                       1,
		Bookingstatusdescription: "In the midst of booking",
	}

	if statusCode, err := GetBookingStatusCode(repo.db, expected.Bookingstatusdescription); statusCode != expected || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if statusCode != expected {
			t.Errorf("Expected to get statuscode %v. Got %v instead", expected, statusCode)
		}
	}
}

func TestGetOperatingHours(t *testing.T) {
	mock, repo, rows, err := setupBookings("GetOperatingHours")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.
		QuoteMeta(`SELECT DISTINCT venuename, unit, maxcapacity, buildingname, starthour, endhour FROM Venues
		JOIN buildings ON Venues.buildingid = buildings.id
		JOIN venuetimings on Venues.id = venuetimings.venueid
		WHERE unit = $1 AND buildingname = $2 AND dayofweek = $3`)
	mock.ExpectQuery(query).
		WithArgs("test", "test", 1).
		WillReturnRows(rows)
	monday, _ := time.Parse(time.RFC3339, "2021-06-21T15:00:00.000Z")

	input := models.TimingSearchInput{
		UnitNo:       "test",
		Buildingname: "test",
		Eventstart:   monday,
		Eventend:     time.Time{},
		Pax:          0,
	}
	expected := models.UnavailableTimings{
		Venuename:    "test",
		Unit:         "test",
		Maxcapacity:  10,
		Buildingname: "test",
		Starthour:    time.Time{},
		Endhour:      time.Time{},
		Eventstart:   time.Time{},
		Eventend:     time.Time{},
		Sumpax:       0,
	}

	if operatingHours, err := GetOperatingHours(repo.db, input); operatingHours != expected || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if operatingHours != expected {
			t.Errorf("Expected to get operating hours %v. Got %v instead", expected, operatingHours)
		}
	}
}

func TestUpdateBookingsStatus(t *testing.T) {
	mock, repo, _, err := setupBookings("GetBookingsOfDay")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	bookingOne, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}
	bookingTwo, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}
	bookingThree, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}

	query := regexp.QuoteMeta(`UPDATE currentbookings SET bookingstatusid = $1 WHERE id = $2`)
	mock.ExpectExec(query).
		WithArgs(1, bookingOne).
		WillReturnResult(sqlmock.NewResult(0, 1))
	mock.ExpectExec(query).
		WithArgs(1, bookingTwo).
		WillReturnResult(sqlmock.NewResult(0, 1))
	mock.ExpectExec(query).
		WithArgs(1, bookingThree).
		WillReturnResult(sqlmock.NewResult(0, 1))

	input := models.MakeDeleteBookings{
		BookingID: []string{bookingOne.String(), bookingTwo.String(), bookingThree.String()},
	}

	statusCode := models.Bookingstatuses{
		ID: 1,
	}

	if counter, err := UpdateBookingsStatus(repo.db, input, statusCode); counter != len(input.BookingID) || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if counter != len(input.BookingID) {
			t.Errorf("Expected to update %d bookings. Got %d instead", len(input.BookingID), counter)
		}
	}
}

func TestGetPendingBookings(t *testing.T) {
	mock, repo, rows, err := setupBookings("GetPendingBookings")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	bookingOne, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}
	bookingTwo, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}
	rows = rows.AddRow(1, "test", 10, time.Time{}, time.Time{}, bookingOne).
		AddRow(2, "test", 10, time.Time{}, time.Time{}, bookingTwo)

	query := regexp.
		QuoteMeta(`SELECT v.id AS venueid, v.venuename, currentbookings.id AS bookingid, pax, eventstart, eventend 
		FROM venues AS v
		JOIN currentBookings ON v.id = currentBookings.venueid
		WHERE nusnetid = $1 AND bookingstatusid = $2`)
	mock.ExpectQuery(query).
		WithArgs("e001", bookingOne).
		WillReturnRows(rows)
	expected := []models.PendingBookings{
		{
			Venueid:    1,
			Venuename:  "test",
			Pax:        10,
			Eventstart: time.Time{},
			Eventend:   time.Time{},
			Bookingid:  bookingOne,
		},
		{
			Venueid:    2,
			Venuename:  "test",
			Pax:        10,
			Eventstart: time.Time{},
			Eventend:   time.Time{},
			Bookingid:  bookingTwo,
		},
	}

	input := models.User{
		Nusnetid: "e001",
	}
	statusCode := models.Bookingstatuses{
		ID: 1,
	}

	if pendingBookings, err := GetPendingBookings(repo.db, input, statusCode); reflect.DeepEqual(pendingBookings, expected) || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !reflect.DeepEqual(pendingBookings, expected) {
			t.Errorf("Expected to get array %v. Got %v instead",
				expected, pendingBookings)
		}
	}
}

func TestInsertBooking_UnderLimit(t *testing.T) {
	mock, repo, _, err := setupBookings("")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.
		QuoteMeta(`INSERT INTO "currentbookings" ("nusnetid","venueid","pax","createdat","eventstart","eventend","bookingstatusid","lastupdated") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING "currentbookings".*`)

	mock.ExpectBegin()
	mock.ExpectExec(query).
		WithArgs("e001", 1, 10, AnyTime{}, AnyTime{}, AnyTime{}, 1, AnyTime{}).
		WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	overLimitAndTime := false
	s := models.BookingInput{
		Nusnetid:   "e001",
		Pax:        10,
		Eventstart: time.Time{},
		Eventend:   time.Time{},
		Venueid:    1,
	}
	venue := models.Venues{
		ID:        1,
		Venuename: "test",
	}
	statusCode := models.Bookingstatuses{
		ID: 1,
	}

	expectedSuccess := true
	if success, err := InsertBooking(repo.db, overLimitAndTime, s, venue, statusCode); !success || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !success {
			t.Errorf("Expected success to be %t, but got it to be %t", expectedSuccess, success)
		}
	}
}

func TestCheckIfOverLimitAndTime_False(t *testing.T) {
	mock, repo, rows, err := setupBookings("CheckIfOverLimitAndTime_False")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.
		QuoteMeta(`SELECT cb.eventstart, SUM(pax) AS sumpax FROM currentBookings AS cb
		JOIN venues ON venues.id = cb.venueid
		WHERE (cb.eventStart = $1 OR cb.eventEnd = $2)
		AND cb.venueid = $3
		AND cb.bookingstatusid IN ($4,$5,$6)
		GROUP BY cb.eventstart`)
	mock.ExpectQuery(query).WithArgs(AnyTime{}, AnyTime{}, 1, 1, 2, 3).WillReturnRows(rows)

	s := models.BookingInput{
		Eventstart: time.Now().Add(time.Hour),
		Eventend:   time.Time{},
		Pax:        1,
	}
	venue := models.Venues{
		ID:          1,
		Maxcapacity: 20,
	}
	statusIDArr := []int{1, 2, 3}

	expected := false
	if result, err := CheckIfOverLimitAndTime(repo.db, s, venue, statusIDArr); err != nil || result {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if result {
			t.Errorf("Expected this input to be over limit: %t. Got it as %t instead", expected, result)
		}
	}
}

func TestCheckIfOverLimitAndTime_OverPax(t *testing.T) {
	mock, repo, rows, err := setupBookings("CheckIfOverLimitAndTime_OverPax")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.
		QuoteMeta(`SELECT cb.eventstart, SUM(pax) AS sumpax FROM currentBookings AS cb
		JOIN venues ON venues.id = cb.venueid
		WHERE (cb.eventStart = $1 OR cb.eventEnd = $2)
		AND cb.venueid = $3
		AND cb.bookingstatusid IN ($4,$5,$6)
		GROUP BY cb.eventstart`)
	mock.ExpectQuery(query).
		WithArgs(AnyTime{}, AnyTime{}, 1, 1, 2, 3).
		WillReturnRows(rows)

	s := models.BookingInput{
		Eventstart: time.Now().Add(time.Hour),
		Eventend:   time.Time{},
		Pax:        1,
	}
	venue := models.Venues{
		ID:          1,
		Maxcapacity: 20,
	}
	statusIDArr := []int{1, 2, 3}

	expected := true
	if result, err := CheckIfOverLimitAndTime(repo.db, s, venue, statusIDArr); err != nil || result != expected {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if result != expected {
			t.Errorf("Expected this input to be over limit: %t. Got it as %t instead", expected, result)
		}
	}
}

func TestCheckIfOverLimitAndTime_OverTime(t *testing.T) {
	mock, repo, rows, err := setupBookings("CheckIfOverLimitAndTime_OverTime")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.
		QuoteMeta(`SELECT cb.eventstart, SUM(pax) AS sumpax FROM currentBookings AS cb
		JOIN venues ON venues.id = cb.venueid
		WHERE (cb.eventStart = $1 OR cb.eventEnd = $2)
		AND cb.venueid = $3
		AND cb.bookingstatusid IN ($4,$5,$6)
		GROUP BY cb.eventstart`)
	mock.ExpectQuery(query).
		WithArgs(AnyTime{}, AnyTime{}, 1, 1, 2, 3).
		WillReturnRows(rows)

	s := models.BookingInput{
		Eventstart: time.Now().Add(-time.Hour),
		Eventend:   time.Now(),
		Pax:        1,
	}
	venue := models.Venues{
		ID:          1,
		Maxcapacity: 20,
	}
	statusIDArr := []int{1, 2, 3}

	expected := true
	if result, err := CheckIfOverLimitAndTime(repo.db, s, venue, statusIDArr); err != nil || result != expected {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if result != expected {
			t.Errorf("Expected this input to be over time: %t. Got it as %t instead", expected, result)
		}
	}
}

func TestCheckIfOverLimitAndTime_OverBoth(t *testing.T) {
	mock, repo, rows, err := setupBookings("CheckIfOverLimitAndTime_OverPax")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.
		QuoteMeta(`SELECT cb.eventstart, SUM(pax) AS sumpax FROM currentBookings AS cb
		JOIN venues ON venues.id = cb.venueid
		WHERE (cb.eventStart = $1 OR cb.eventEnd = $2)
		AND cb.venueid = $3
		AND cb.bookingstatusid IN ($4,$5,$6)
		GROUP BY cb.eventstart`)
	mock.ExpectQuery(query).
		WithArgs(AnyTime{}, AnyTime{}, 1, 1, 2, 3).
		WillReturnRows(rows)

	s := models.BookingInput{
		Eventstart: time.Now().Add(-time.Hour),
		Eventend:   time.Now(),
		Pax:        1,
	}
	venue := models.Venues{
		ID:          1,
		Maxcapacity: 20,
	}
	statusIDArr := []int{1, 2, 3}

	expected := true
	if result, err := CheckIfOverLimitAndTime(repo.db, s, venue, statusIDArr); err != nil || result != expected {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if result != expected {
			t.Errorf("Expected this input to be over time: %t. Got it as %t instead", expected, result)
		}
	}
}

func TestGetVenueFromBuildingAndUnit(t *testing.T) {
	mock, repo, rows, err := setupBookings("GetVenueFromBuildingAndUnit")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT * FROM venues
		JOIN buildings ON venues.buildingid = buildings.id
		WHERE unit = $1 AND buildingname = $2`)
	mock.ExpectQuery(query).WithArgs("test", "test").WillReturnRows(rows)

	s := models.BookingInput{
		UnitNo:       "test",
		Buildingname: "test",
	}

	expected := models.Venues{
		ID:            1,
		Venuename:     "test",
		Unit:          "test",
		Maxcapacity:   10,
		Buildingid:    1,
		Roomtypeid:    1,
		Venuestatusid: 1,
		Mapphoto:      "test",
		Floorplan:     "test",
	}

	if venue, err := GetVenueFromBuildingAndUnit(repo.db, s); venue != expected || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if venue != expected {
			t.Errorf("Expected venue to be %v, but got %v", expected, venue)
		}
	}
}

func TestDeleteBookingFromTable_Success(t *testing.T) {
	mock, repo, _, err := setupBookings("")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	bookingOne, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}
	bookingTwo, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}

	query := regexp.QuoteMeta(`DELETE FROM currentBookings WHERE id = $1`)
	mock.MatchExpectationsInOrder(false)
	mock.ExpectBegin()
	mock.ExpectExec(query).WithArgs(bookingOne).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec(query).WithArgs(bookingTwo).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	input := models.MakeDeleteBookings{
		BookingID: []uuid.UUID{bookingOne, bookingTwo},
	}
	expected := len(input.BookingID)

	if count, err := DeleteBookingFromTable(repo.db, input); count != expected || err != nil {
		if err != nil {
			t.Errorf("Unexpected error: %s", err.Error())
		}
		if count != expected {
			t.Errorf("Expected deleted count to be %d, but got %d instead", expected, count)
		}
	}
}

func TestDeleteBookingFromTable_Error(t *testing.T) {
	mock, repo, _, err := setupBookings("")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	bookingOne, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}
	bookingTwo, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("Unexpectedly unable to generate uuid. " + err.Error())
	}

	errorMessage := fmt.Sprintf("Error in deleting booking for booking with booking id = %v\n", bookingTwo)
	expected := errors.New(errorMessage)

	query := regexp.QuoteMeta(`DELETE FROM currentBookings WHERE id = $1`)
	mock.MatchExpectationsInOrder(false)
	mock.ExpectBegin()
	mock.ExpectExec(query).WithArgs(bookingOne).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec(query).WithArgs(bookingTwo).WillReturnError(expected)
	mock.ExpectCommit()

	input := models.MakeDeleteBookings{
		BookingID: []uuid.UUID{bookingOne, bookingTwo},
	}

	expectedCount := 1
	if count, err := DeleteBookingFromTable(repo.db, input); expectedCount != count || err == nil || err.Error() != expected.Error() {
		if err == nil {
			t.Fatalf("Expected there to be an error but there is none")
		}
		if err.Error() != expected.Error() {
			t.Errorf("Expected the error: %s but got: %s", expected.Error(), err.Error())
		}
		if expectedCount != count {
			t.Errorf("Expected deleted count to be %d, but got %d instead", expectedCount, count)
		}
	}
}

package services

import (
	"errors"
	"fmt"
	"github.com/jinzhu/gorm"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// GET /timings
// get all the timings of the particular venue on that day
// and a boolean on whether it is available based on search
func GetTimings(c *gin.Context) {
	// parse input
	var input models.TimingSearchInput
	if err := c.ShouldBindQuery(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input fields"})
		fmt.Println("Error in getting date and venues. " + err.Error() + "\n")
		return
	}

	operatingHours, err := GetOperatingHours(DB, input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for unavailable timings."})
		fmt.Println("Check tempQuery " + err.Error() + "\n")
	}

	statusIDArr, err := GetAllBookingStatusCodes(DB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for booking statusID."})
		fmt.Println("Check bookingstatus query " + err.Error() + "\n")
	}

	venue, err := GetVenueIDAndMaxCapacity(DB, input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for venueID."})
		fmt.Println("Check venueQuery. " + err.Error() + "\n")
	}

	timingWithPax, err := GetBookingsOfDay(DB, input, venue, statusIDArr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for unavailable timings."})
		fmt.Println("Check timingsQuery " + err.Error() + "\n")
	}

	timeslots := MakeTimeslotArr(operatingHours, timingWithPax, input, venue)

	c.JSON(http.StatusOK, gin.H{"data": timeslots})
	fmt.Println("Return successful!")
}

// PUT /make_booking
// updates a (confirms an 'In the midst of booking') booking to 'Pending approval' and updates the db
func MakeBooking(c *gin.Context) {
	const (
		ERROR_STRING = "MakeBooking"
	)
	var input models.MakeDeleteBookings
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input fields"})
		fmt.Sprintln("Error in getting all inputs for function %s. "+err.Error()+"\n", ERROR_STRING)
		return
	}

	statusCode, err := GetBookingStatusCode(DB, "Pending approval")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for status code."})
		fmt.Println("Check statusQuery. " + err.Error() + "\n")
	}

	counter, err := UpdateBookingsStatus(DB, input, statusCode)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		fmt.Println("Check execQuery." + err.Error())
	}

	returnMessage := fmt.Sprintf("Successfully confirmed %d bookings!", counter)
	c.JSON(http.StatusOK, gin.H{"success": true, "message": returnMessage})
	fmt.Println(returnMessage)
}

// GET /get_pending_booking
// get all the pending bookings of the user (to populate shopping cart on frontend)
func GetPendingBooking(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindQuery(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input NUSNET_ID on URL parameter"})
		fmt.Println("Error in getting NUSNET_ID. " + err.Error() + "\n")
		return
	}

	statusCode, err := GetBookingStatusCode(DB, "In the midst of booking")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for status code."})
		fmt.Println("Check statusQuery. " + err.Error() + "\n")
	}

	pendingBookings, err := GetPendingBookings(DB, input, statusCode)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Unable to retrieve pending bookings."})
		fmt.Println("Unable to retrieve pending bookings. " + err.Error() + "\n")
	}

	c.JSON(http.StatusOK, gin.H{"data": pendingBookings})
	fmt.Println("Return successful!")
}

// POST /make_pending_booking
// makes a pending ('In the midst of booking') booking and updates the db
func MakePendingBooking(c *gin.Context) {
	const (
		ERROR_STRING = "MakePendingBooking"
	)
	var input []models.BookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input fields"})
		fmt.Sprintln("Error in getting all inputs for function %s. "+err.Error()+"\n", ERROR_STRING)
		return
	}

	// get pending booking status
	statusCode, err := GetBookingStatusCode(DB, "In the midst of booking")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for status code."})
		fmt.Println("Check statusQuery. " + err.Error() + "\n")
	}

	statusIDArr, err := GetAllBookingStatusCodes(DB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for booking statusID."})
		fmt.Println("Check bookingstatus query " + err.Error() + "\n")
	}

	counter := 0
	for _, s := range input {
		venue, err := GetVenueFromBuildingAndUnit(DB, s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for venueID."})
			fmt.Printf("Error in querying for venueID for function %s. "+err.Error()+"\n", ERROR_STRING)
		}
		s.Venueid = venue.ID

		overLimitAndTime, err := CheckIfOverLimitAndTime(DB, s, venue, statusIDArr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for unavailable timings."})
			fmt.Println("Check timingsQuery " + err.Error() + "\n")
		}

		added, err := InsertBooking(DB, overLimitAndTime, s, venue, statusCode)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
			fmt.Println(err.Error())
		}
		if added {
			counter++
		}
	}

	successMsg := fmt.Sprintf("Successfully recorded %d bookings!", counter)
	c.JSON(http.StatusOK, gin.H{"message": successMsg})
	fmt.Println(successMsg)
}

// DELETE /delete_pending_booking
// deletes a pending booking and updated the db
func DeletePendingBooking(c *gin.Context) {
	const (
		ERROR_STRING = "DeletePendingBooking"
	)

	var input models.MakeDeleteBookings
	if err := c.ShouldBindQuery(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input booking IDs in URL parameter."})
		fmt.Println("Error in getting booking IDs. " + err.Error() + "\n")
		return
	}

	counter, err := DeleteBookingFromTable(DB, input)
	if err != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"error": err.Error(), "message": err.Error()})
		fmt.Printf(err.Error())
	}

	returnMessage := fmt.Sprintf("Successfully deleted %d pending bookings.", counter)
	c.JSON(http.StatusOK, gin.H{"success": true, "message": returnMessage})
	fmt.Println(returnMessage)
}

func MakeTimeslotArr(operatingHours models.UnavailableTimings, timingWithPax []models.UnavailableTimings,
	input models.TimingSearchInput, venue models.Venues) []models.Timeslots {
	// need to populate an array of [{"eventstart" : timing, "eventend" : timing, "available" : true}]
	timeslots := make([]models.Timeslots, 0)
	for start := operatingHours.Starthour; start.Before(operatingHours.Endhour); start = start.Add(time.Hour) {
		var temp models.Timeslots
		temp.EventStart = start
		temp.EventEnd = start.Add(time.Hour)
		temp.Available = true

		for _, s := range timingWithPax {
			if s.Eventstart.Hour() == start.Hour() && (input.Pax > venue.Maxcapacity-s.Sumpax) { // edit here to use a proper equals method
				temp.Available = false
			}
		}

		timeslots = append(timeslots, temp)
	}
	return timeslots
}

func GetBookingsOfDay(DB *gorm.DB, input models.TimingSearchInput,
	venue models.Venues, statusIDArr []int) ([]models.UnavailableTimings, error) {
	var timingWithPax []models.UnavailableTimings
	timingsQuery := "SELECT cb.eventstart, SUM(pax) AS sumpax FROM currentBookings AS cb" +
		" JOIN venues ON venues.id = cb.venueid" +
		" WHERE (cb.eventStart >= ?" +
		" OR cb.eventEnd <= ?)" +
		" AND cb.venueid = ?" +
		" AND cb.bookingstatusid IN (?)" +
		" GROUP BY cb.eventstart"

	if err := DB.Raw(timingsQuery, input.Eventstart, input.Eventend, venue.ID, statusIDArr).Scan(&timingWithPax).Error;
		err != nil {
		return nil, err
	}
	return timingWithPax, nil
}

func GetVenueIDAndMaxCapacity(DB *gorm.DB, input models.TimingSearchInput) (models.Venues, error) {
	var venue models.Venues
	venueQuery := "SELECT v.id, v.maxcapacity FROM venues AS v JOIN buildings on buildings.id = v.buildingid WHERE unit = ? AND buildingname = ?"
	if err := DB.Raw(venueQuery, input.UnitNo, input.Buildingname).Scan(&venue).Error; err != nil {
		return models.Venues{}, err
	}
	return venue, nil
}

func GetAllBookingStatusCodes(DB *gorm.DB) ([]int, error) {
	var bookingstatus []models.Bookingstatuses
	if err := DB.Where("bookingstatusdescription IN (?)", []string{"In the midst of booking", "Pending approval", "Approved"}).
		Find(&bookingstatus).Error; err != nil {
		return nil, err
	}
	statusIDArr := make([]int, 0)
	for _, s := range bookingstatus {
		statusIDArr = append(statusIDArr, s.ID)
	}
	return statusIDArr, nil
}

func GetBookingStatusCode(DB *gorm.DB, statusName string) (models.Bookingstatuses, error) {
	// get 'pending approval' booking status code
	var statusCode models.Bookingstatuses
	statusQuery := "SELECT * FROM bookingstatuses WHERE bookingstatusdescription = ?"
	if err := DB.Raw(statusQuery, statusName).Scan(&statusCode).Error; err != nil {
		return models.Bookingstatuses{}, err
	}
	return statusCode, nil
}

func GetOperatingHours(DB *gorm.DB, input models.TimingSearchInput) (models.UnavailableTimings, error) {
	// need to factor in dayofweek
	dayOfWeek := int(input.Eventstart.Weekday())

	// need to get operating hour of the venue for that day
	var operatingHours models.UnavailableTimings
	operatingHoursQuery := "SELECT DISTINCT venuename, unit, maxcapacity, buildingname, starthour, endhour FROM Venues" +
		" JOIN buildings ON Venues.buildingid = buildings.id" +
		" JOIN venuetimings on Venues.id = venuetimings.venueid" +
		" WHERE unit = ? AND buildingname = ? AND dayofweek = ?"
	if err := DB.Raw(operatingHoursQuery, input.UnitNo, input.Buildingname, dayOfWeek).Scan(&operatingHours).Error; err != nil {
		return models.UnavailableTimings{}, err
	}
	return operatingHours, nil
}

func UpdateBookingsStatus(DB *gorm.DB, input models.MakeDeleteBookings, statusCode models.Bookingstatuses) (int, error) {
	execQuery := "UPDATE currentbookings SET bookingstatusid = ? WHERE id = ?"
	counter := 0
	var errorMessage string
	for _, bookingID := range input.BookingID {
		if err := DB.Exec(execQuery, statusCode.ID, bookingID).Error; err != nil {
			errorMessage += fmt.Sprintf("Error in confirming booking with bookingid %d. with error\n"+ err.Error(), bookingID)
		} else {
			counter++
		}
	}
	if errorMessage != "" {
		return counter, errors.New(errorMessage)
	} else {
		return counter, nil
	}
}

func GetPendingBookings(DB *gorm.DB, input models.User, statusCode models.Bookingstatuses) ([]models.PendingBookings, error) {
	var pendingBookings []models.PendingBookings
	pendingQuery := "SELECT v.id AS venueid, v.venuename, currentbookings.id AS bookingid, pax, eventstart, eventend FROM venues AS v" +
		" JOIN currentBookings ON v.id = currentBookings.venueid" +
		" WHERE nusnetid = ? AND bookingstatusid = ?"
	if result := DB.Raw(pendingQuery, input.Nusnetid, statusCode.ID).Scan(&pendingBookings); result.Error != nil {
		if result.RowsAffected == 0 {

		} else {
			return nil, result.Error
		}
	}
	return pendingBookings, nil
}

func InsertBooking(DB *gorm.DB, overLimitAndTime bool, s models.BookingInput, venue models.Venues, statusCode models.Bookingstatuses) (bool, error) {
	// pump into bookings table
	if overLimitAndTime {
		errorMessage := fmt.Sprintf("Unable to make booking for venue %s at time %s to time %s as there are not enough available slots left, or event time has already past.",
			s.Eventstart, s.Eventend, venue.Venuename)
		return false, errors.New(errorMessage)
	} else {
		currentBooking := models.Currentbookings{
			Nusnetid:        s.Nusnetid,
			Venueid:         s.Venueid,
			Pax:             s.Pax,
			Createdat:       time.Now(),
			Eventstart:      s.Eventstart,
			Eventend:        s.Eventend,
			Bookingstatusid: statusCode.ID,
			Lastupdated:     time.Now(),
		}
		fmt.Println(currentBooking)
		if err := DB.Create(&currentBooking).Error; err != nil {
			errorMessage := "Error in creating pending booking. " + err.Error()
			return false, errors.New(errorMessage)
		}
		return true, nil
	}
}

func CheckIfOverLimitAndTime(DB *gorm.DB, s models.BookingInput, venue models.Venues, statusIDArr []int) (bool, error) {
	var paxCheck models.UnavailableTimings
	paxQuery := "SELECT cb.eventstart, SUM(pax) AS sumpax FROM currentBookings AS cb" +
		" JOIN venues ON venues.id = cb.venueid" +
		" WHERE (cb.eventStart = ? OR cb.eventEnd = ?)" +
		" AND cb.venueid = ?" +
		" AND cb.bookingstatusid IN (?)" +
		" GROUP BY cb.eventstart"
	if result := DB.Raw(paxQuery, s.Eventstart, s.Eventend, venue.ID, statusIDArr).Scan(&paxCheck);
	result.Error != nil {
		if result.RowsAffected == 0 {
		} else {
			return false, result.Error
		}
	}

	overLimitAndTime := s.Pax > venue.Maxcapacity-paxCheck.Sumpax || s.Eventstart.Before(time.Now())
	return overLimitAndTime, nil
}

func GetVenueFromBuildingAndUnit(DB *gorm.DB, s models.BookingInput) (models.Venues, error) {
	// get venue id from unit and buildingname by querying venues table
	var venue models.Venues
	venueIDQuery := "SELECT * FROM venues" +
		" JOIN buildings ON venues.buildingid = buildings.id" +
		" WHERE unit = ? AND buildingname = ?"
	if err := DB.Raw(venueIDQuery, s.UnitNo, s.Buildingname).Scan(&venue).Error; err != nil {
		return models.Venues{}, err
	}
	return venue, nil
}

func DeleteBookingFromTable(DB *gorm.DB, input models.MakeDeleteBookings) (int, error) {
	deleteQuery := "DELETE FROM currentBookings WHERE id = ?"
	counter := 0
	var errorMessage string
	for _, s := range input.BookingID {
		if err := DB.Exec(deleteQuery, s).Error; err != nil {
			errorMessage += fmt.Sprintf("Error in deleting booking for booking with booking id = %d\n", s)
		} else {
			counter++
		}
	}
	if counter != len(input.BookingID) {
		return counter, errors.New(errorMessage)
	}
	return counter, nil
}

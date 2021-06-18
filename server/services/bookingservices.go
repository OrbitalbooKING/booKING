package services

import (
	"fmt"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// GET /timings
// get all the UNAVAILABLE timings of the particular venue on that day
func GetUnavailableTimings(c *gin.Context) {
	// parse input
	var input models.TimingSearchInput
	if err := c.ShouldBindQuery(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input fields"})
		fmt.Println("Error in getting date and venues. " + err.Error() + "\n")
		return
	}

	// need to factor in dayofweek
	dayOfWeek := int(input.Eventstart.Weekday())

	var unavailableTimings []models.UnavailableTimings
	timingsQuery := "SELECT venuename, unit, maxcapacity, buildingname, starthour, endhour, eventstart, eventend, pax FROM Venues" +
		" JOIN currentBookings ON Venues.id = currentBookings.venueid" +
		" JOIN buildings ON Venues.buildingid = buildings.id" +
		" JOIN venuetimings on Venues.id = venuetimings.venueid" +
		" WHERE unit = ? AND buildingname = ?" +
		" AND eventstart >= ? AND eventend < ? AND dayofweek = ?"
	if err := DB.Raw(timingsQuery, input.UnitNo, input.Buildingname, input.Eventstart, input.Eventend, dayOfWeek).Scan(&unavailableTimings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for unavailable timings."})
		fmt.Println("Check tempQuery " + err.Error() + "\n")
		return
	}

	// get operating hours and sum of pax at that timing
	var operatingHours models.UnavailableTimings
	operatingHoursQuery := "SELECT venuename, unit, maxcapacity, buildingname, starthour, endhour FROM Venues" +
		" JOIN buildings ON Venues.buildingid = buildings.id" +
		" JOIN venuetimings on Venues.id = venuetimings.venueid" +
		" WHERE unit = ? AND buildingname = ? AND dayofweek = ?"
	if err := DB.Raw(operatingHoursQuery, input.UnitNo, input.Buildingname, dayOfWeek).Scan(&operatingHours).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for unavailable timings."})
		fmt.Println("Check tempQuery " + err.Error() + "\n")
		return
	}

	if len(unavailableTimings) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": operatingHours})
	} else {
		c.JSON(http.StatusOK, gin.H{"data": unavailableTimings})
	}
	fmt.Println("Return successful!")
}

// POST /make_booking
// makes a booking and updates the db
func MakeBooking(c *gin.Context) {
	const (
		ERROR_STRING = "MakeBooking"
	)
	var input []models.BookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input fields"})
		fmt.Sprintln("Error in getting all inputs for function %s. "+err.Error()+"\n", ERROR_STRING)
		return
	}

	// get venue id from unit and buildingname by querying venues table
	var venue models.Venues
	venueIDQuery := "SELECT * FROM venues" +
		" JOIN buildings ON venues.buildingid = buildings.id" +
		" WHERE unit = ? AND buildingname = ?"

	// get pending booking status code
	bookingStatusQuery := "SELECT id FROM bookingStatuses WHERE bookingstatusdescription = 'Pending'"
	var statusCode models.Bookingstatuses
	if err := DB.Raw(bookingStatusQuery).Scan(&statusCode).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for pending status ID."})
		fmt.Printf("Error in querying for pending status ID for function %s. "+err.Error()+"\n", ERROR_STRING)
		return
	}

	counter := 0
	for _, s := range input {
		if err := DB.Raw(venueIDQuery, s.UnitNo, s.Buildingname).Scan(&venue).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for venueID."})
			fmt.Printf("Error in querying for venueID for function %s. "+err.Error()+"\n", ERROR_STRING)
			return
		}
		s.Venueid = venue.ID

		// pump into bookings table
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

		if err := DB.Create(&currentBooking).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in updating database for capacity."})
			fmt.Printf("Error in creatingbooking for function %s. "+err.Error()+"\n", ERROR_STRING)
			return
		}

		// retrieve ID of the row you just inserted
		var retrieveBooking models.Retrievebookings
		if err := DB.Table("currentbookings").First(&retrieveBooking, "nusnetid = ? AND venueid = ? AND pax = ? AND eventstart = ?",
			currentBooking.Nusnetid, currentBooking.Venueid, currentBooking.Pax, currentBooking.Eventstart).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in retrieving bookingID."})
			fmt.Printf("Error in retrieving bookingID for function %s. "+err.Error()+"\n", ERROR_STRING)
			return
		}

		// add into venueSchedule table this booking
		newSchedule := models.Venueschedules{
			Venueid:   venue.ID,
			Dayofweek: int(s.Eventstart.Weekday()),
			Bookingid: retrieveBooking.ID,
			Starthour: currentBooking.Eventstart,
			Endhour:   currentBooking.Eventend,
		}
		if err := DB.Create(&newSchedule).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in updating venueSchedules for new booking."})
			fmt.Printf("Error in updating venueSchedules for function %s. "+err.Error()+"\n", ERROR_STRING)
			return
		}

		counter++
	}

	successMsg := fmt.Sprintf("Successfully recorded %d bookings!", counter)
	c.JSON(http.StatusOK, gin.H{"message": successMsg})
	fmt.Println(successMsg)
}

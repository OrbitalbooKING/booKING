package services

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/OrbitalbooKING/booKING/server/config"
	"github.com/OrbitalbooKING/booKING/server/models"
	"github.com/google/uuid"

	"github.com/jinzhu/gorm"

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

	counter, deducted, err := ConfirmBooking(DB, input, statusCode)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		fmt.Println("Check execQuery." + err.Error())
	}

	var bookings []models.BookingRequests
	for _, s := range input.BookingID {
		booking, exists, err := RetrieveBooking(DB, models.URLBooking{BookingID: s})
		if !exists {
			errorMessage := fmt.Sprintf("Booking %s does not exist!", s)
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
			fmt.Println(errorMessage)
		}
		if err != nil {
			errorMessage := fmt.Sprintf("Error retrieving booking %s "+err.Error(), s)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
			fmt.Println(errorMessage)
		}

		bookings = append(bookings, booking)
	}

	emailInfo, err := PopulatePendingEmailInfo(bookings)
	if err != nil {
		errorMessage := "Encountered error when retrieving info to send email. " + err.Error()
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
	}

	if err := SendPendingApprovalEmail(emailInfo); err != nil {
		errorMessage := fmt.Sprintf("Unable to send pending approval email. " + err.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
	}

	returnMessage := fmt.Sprintf("Successfully confirmed %d booking(s) and deducted %.1f point(s)!", counter, deducted)
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

	bookingCart, err := BookingCartDetails(pendingBookings, input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err.Error()})
		fmt.Println(err.Error() + "\n")
	}

	c.JSON(http.StatusOK, gin.H{"data": bookingCart})
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

		ID, added, err := InsertBooking(DB, overLimitAndTime, s, venue, statusCode)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
			fmt.Println(err.Error())
		}
		if added {
			counter++
		}
		// after 15 min, pending booking should be deleted
		time.AfterFunc(time.Minute*15, func() {
			// do not execute if booking becomes confirmed/already deleted
			checkBooking, exists, err := RetrieveBooking(DB, models.URLBooking{BookingID: ID.String()})
			if err != nil {
				errorMessage := fmt.Sprintf("Unable to check on status of booking %s after 15 minutes", ID.String())
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
			} else if exists && checkBooking.Bookingstatusdescription == "In the midst of booking" {
				var temp models.MakeDeleteBookings
				temp.BookingID = []string{ID.String()}
				if _, err := DeletePendingBookingFromTable(DB, temp); err != nil {
					errorMessage := fmt.Sprintf("Unable to remove pending booking %s after 15 minutes.", ID.String())
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
				} else {
					deletedMessage := fmt.Sprintf("Deleted pending booking %s as it has been 15 minutes.", ID.String())
					fmt.Println(deletedMessage)
				}
			}
		})
	}

	successMsg := fmt.Sprintf("Successfully recorded %d booking(s)!", counter)
	c.JSON(http.StatusOK, gin.H{"message": successMsg})
	fmt.Println(successMsg)
}

// DELETE /delete_pending_bookings
// deletes a pending booking and updated the db
func DeletePendingBookings(c *gin.Context) {
	var input models.MakeDeleteBookings
	if err := c.ShouldBindQuery(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input booking IDs in URL parameter."})
		fmt.Println("Error in getting booking IDs. " + err.Error() + "\n")
		return
	}

	counter, err := DeletePendingBookingFromTable(DB, input)
	if err != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"error": err.Error(), "message": err.Error()})
		fmt.Println(err.Error())
	}

	returnMessage := fmt.Sprintf("Successfully deleted %d pending booking(s).", counter)
	c.JSON(http.StatusOK, gin.H{"success": true, "message": returnMessage})
	fmt.Println(returnMessage)
}

// DELETE /delete_confirmed_bookings
// deletes a confirmed booking and updated the db
func DeleteConfirmedBookings(c *gin.Context) {
	var input models.MakeDeleteBookings
	if err := c.ShouldBindQuery(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input booking IDs in URL parameter."})
		fmt.Println("Error in getting booking IDs. " + err.Error() + "\n")
		return
	}

	refundedTotal, counter, err := DeleteConfirmedBookingFromTable(c, DB, input)
	if err != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"error": err.Error(), "message": err.Error()})
		fmt.Println(err.Error())
	}

	returnMessage := fmt.Sprintf("Successfully deleted %d pending booking(s), and refunded total of %.1f points", counter, refundedTotal)
	c.JSON(http.StatusOK, gin.H{"success": true, "message": returnMessage})
	fmt.Println(returnMessage)
}

// GET /get_bookings
// Find all the current and past bookings tied to a particular account
func GetBookings(c *gin.Context) {
	var user models.User
	if err := c.BindQuery(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input NUSNET_ID"})
		fmt.Println("Error in reading input NUSNET_ID. " + err.Error() + "\n")
		return
	}

	booking, exists, err := RetrieveUserBookings(DB, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check database query"})
		fmt.Println("Error in retrieving booking details from Database. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusOK, gin.H{"message": "User has no bookings"})
		fmt.Println("User has no bookings")
	} else {
		c.JSON(http.StatusOK, gin.H{"data": booking})
		fmt.Println("Successfully retrieved booking details.")
	}
}

// GET /populate_bookings
// get all the pending/incoming bookings on server
func GetBookingRequests(c *gin.Context) {
	// get status codes
	statusIDs := make([]int, 0)
	if temp, err := GetBookingStatusCode(DB, "Pending approval"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to retrieve booking status code."})
		fmt.Println("Unable to retrieve booking status code. " + err.Error() + "\n")
	} else {
		statusIDs = append(statusIDs, temp.ID)
	}

	if temp, err := GetBookingStatusCode(DB, "Approved"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to retrieve booking status code."})
		fmt.Println("Unable to retrieve booking status code. " + err.Error() + "\n")
	} else {
		statusIDs = append(statusIDs, temp.ID)
	}

	booking, exists, err := RetrieveBookingRequests(DB, statusIDs)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check database query"})
		fmt.Println("Error in retrieving booking details from Database. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusOK, gin.H{"message": "No pending or approved bookings."})
		fmt.Println("User has no bookings")
	} else {
		c.JSON(http.StatusOK, gin.H{"data": booking})
		fmt.Println("Successfully retrieved pending and approved booking(s).")
	}
}

// PUT /approve_bookings
// approve bookings
func ApproveBookings(c *gin.Context) {
	var input models.MakeDeleteBookings
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input bookingID"})
		fmt.Println("Error in reading input NUSNET_ID. " + err.Error() + "\n")
		return
	}

	// get ID to update status to
	statusID, err := GetBookingStatusCode(DB, "Approved")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to query for booking status ID."})
		fmt.Println("Unable to query for booking status ID. " + err.Error() + "\n")
		return
	}

	count, err := UpdateBookingsStatus(DB, input, statusID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to update booking successfully."})
		fmt.Println("Unable to update booking successfully. " + err.Error() + "\n")
	} else {
		successMsg := fmt.Sprintf("Successfully approved %d booking(s)!", count)
		c.JSON(http.StatusOK, gin.H{"success": true, "message": successMsg})
		fmt.Println(successMsg)
	}
}

// GET /check_booking
// gets a specific booking based on its booking id
func CheckBooking(c *gin.Context) {
	var input models.URLBooking
	if err := c.BindQuery(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input booking ID"})
		fmt.Println("Error in reading input booking ID. " + err.Error() + "\n")
		return
	}

	booking, exists, err := RetrieveBooking(DB, input)
	if err != nil {
		errorMessage := fmt.Sprintf("Error retrieving booking. " + err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": errorMessage})
		fmt.Println(errorMessage)
	}
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No such booking."})
		fmt.Println("No such booking found.")
	} else {
		c.JSON(http.StatusOK, gin.H{"data": booking})
		fmt.Println("Successfully retrieved booking.")
	}
}

// GET /get_user_with_temp_points
// gets a user with temporary points from deleting a booking
func GetUserWithTempPoints(c *gin.Context) {
	var input models.EditBookingInput
	if err := c.ShouldBindQuery(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input Booking ID on URL parameter"})
		fmt.Println("Error in getting Booking ID. " + err.Error() + "\n")
		return
	}

	oldBooking, exists, err := RetrieveBooking(DB, models.URLBooking{BookingID: input.OldBookingID})
	if !exists {
		errorMessage := fmt.Sprintf("Booking with ID %s does not exist.", input.OldBookingID)
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return
	}
	if err != nil {
		errorMessage := fmt.Sprintf("Error in retrieving Booking with ID %s."+err.Error(), input.OldBookingID)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
		return
	}

	statusCode, err := GetBookingStatusCode(DB, "In the midst of booking")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for status code."})
		fmt.Println("Check statusQuery. " + err.Error() + "\n")
	}

	pendingBookings, err := GetPendingBookings(DB, models.User{Nusnetid: input.NUSNET_ID}, statusCode)
	if err != nil {
		errorMessage := fmt.Sprintf("Error in retrieving pending bookings with for user with NUSNET ID %s."+err.Error(), input.NUSNET_ID)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
		return
	}

	editCart, err := EditCartDetails(oldBooking, pendingBookings, models.User{Nusnetid: input.NUSNET_ID})
	if err != nil {
		errorMessage := fmt.Sprint("Error in making bookng cart." + err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": editCart})
	fmt.Println("Return successful!")
}

// PUT /reject_booking
// rejects a booking with a reason given
func RejectBooking(c *gin.Context) {
	var input models.RejectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input bookingID"})
		fmt.Println("Error in reading input NUSNET_ID. " + err.Error() + "\n")
		return
	}

	// get ID to update status to
	statusID, err := GetBookingStatusCode(DB, "Rejected")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to query for booking status ID."})
		fmt.Println("Unable to query for booking status ID. " + err.Error() + "\n")
		return
	}

	count, err := UpdateBookingsStatus(DB, models.MakeDeleteBookings{BookingID: []string{input.BookingID}}, statusID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to update booking successfully."})
		fmt.Println("Unable to update booking successfully. " + err.Error() + "\n")
		return
	} else {
		successMsg := fmt.Sprintf("Successfully rejected %d booking(s)!", count)
		fmt.Println(successMsg)
	}

	// get booking to refund points
	booking, exists, err := RetrieveBooking(DB, models.URLBooking{BookingID: input.BookingID})
	if !exists {
		errorMessage := fmt.Sprintf("No booking with ID %s exists.", booking.ID)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return
	}
	if err != nil {
		errorMessage := fmt.Sprintf("No booking with ID %s exists.", booking.ID)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return
	}

	refunded, err := AddPoints(DB, booking.Nusnetid, booking.Cost)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to refund points for booking with ID %s to user %s. "+err.Error(), booking.ID, booking.Nusnetid)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
		return
	}

	emailInfo, err := PopulateRejectEmailInfo(booking.ID.String(), input.Reason)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to populate reject email for booking with ID %s to user %s. "+err.Error(), booking.ID, booking.Nusnetid)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
	}

	if err := SendRejectBookingEmail(emailInfo); err != nil {
		errorMessage := fmt.Sprintf("Unable to send reject email for booking with ID %s to user %s. "+err.Error(), booking.ID, booking.Nusnetid)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
	}

	successMessage := fmt.Sprintf("Successfully rejected booking with ID %s. Total of %.1f point(s) refunded to user %s.",
		booking.ID, refunded, booking.Nusnetid)
	c.JSON(http.StatusOK, gin.H{"success": true, "message": successMessage})
	fmt.Println(successMessage)
}

func RetrieveBookingRequests(DB *gorm.DB, statusIDs []int) ([]models.BookingRequests, bool, error) {
	// get list of bookings that fit into the statusIDs
	query := "SELECT * FROM currentbookings" +
		" JOIN venues ON venues.id = currentbookings.venueid" +
		" JOIN buildings ON buildings.id = venues.buildingid" +
		" JOIN bookingstatuses ON bookingstatuses.id = currentbookings.bookingstatusid" +
		" JOIN accounts ON accounts.nusnetid = currentbookings.nusnetid" +
		" JOIN faculties ON accounts.facultyid = faculties.id" +
		" WHERE bookingstatusid IN (?) ORDER BY bookingstatusid ASC"

	var bookings []models.BookingRequests
	result := DB.Raw(query, statusIDs).Scan(&bookings)

	if result.Error == gorm.ErrRecordNotFound {
		return []models.BookingRequests{}, false, nil
	}
	if result.Error != nil {
		return []models.BookingRequests{}, false, result.Error
	}
	return bookings, true, nil
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
			if s.Eventstart.Hour() == start.Hour() { // edit here to use a proper equals method
				if input.Pax > venue.Maxcapacity-s.Sumpax {
					temp.Available = false
				}

				// not sharable means if venue already has booking it should not be available
				if !input.Sharable && s.Sumpax > 0 {
					temp.Available = false
				}
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
		" AND cb.eventEnd <= ?)" +
		" AND cb.venueid = ?" +
		" AND cb.bookingstatusid IN (?)" +
		" GROUP BY cb.eventstart"

	if err := DB.Raw(timingsQuery, input.Eventstart, input.Eventend, venue.ID, statusIDArr).Scan(&timingWithPax).Error; err != nil {
		return nil, err
	}
	return timingWithPax, nil
}

func RetrieveUserBookings(DB *gorm.DB, user models.User) ([]models.BookingDetails, bool, error) {
	var bookings []models.BookingDetails
	query := "SELECT venuename, buildingname, buildings.id AS buildingid, unit, eventstart, pax, currentbookings.id as bookingid," +
		" bookingstatusdescription" +
		" FROM currentbookings" +
		" JOIN venues ON venues.id = currentbookings.venueid" +
		" JOIN buildings ON buildings.id = venues.buildingid" +
		" JOIN bookingstatuses ON bookingstatuses.id = currentbookings.bookingstatusid" +
		" WHERE nusnetid = ? ORDER BY bookingstatusid ASC"
	result := DB.Raw(query, user.Nusnetid).Scan(&bookings)
	if result.Error == gorm.ErrRecordNotFound {
		return []models.BookingDetails{}, false, nil
	}
	if result.Error != nil {
		return []models.BookingDetails{}, false, result.Error
	}
	return bookings, true, nil
}

func RetrieveBooking(DB *gorm.DB, input models.URLBooking) (models.BookingRequests, bool, error) {
	var bookings models.BookingRequests
	query := "SELECT * FROM currentbookings" +
		" JOIN venues ON venues.id = currentbookings.venueid" +
		" JOIN buildings ON buildings.id = venues.buildingid" +
		" JOIN bookingstatuses ON bookingstatuses.id = currentbookings.bookingstatusid" +
		" JOIN accounts ON accounts.nusnetid = currentbookings.nusnetid" +
		" JOIN faculties ON accounts.facultyid = faculties.id" +
		" WHERE currentbookings.id = ?"
	result := DB.Raw(query, input.BookingID).Scan(&bookings)
	if result.Error == gorm.ErrRecordNotFound {
		return models.BookingRequests{}, false, nil
	}
	if result.Error != nil {
		return models.BookingRequests{}, false, result.Error
	}
	if bookings.Pax < bookings.Maxcapacity {
		bookings.Sharable = true
	}
	return bookings, true, nil
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
			errorMessage += fmt.Sprintf("Error in confirming booking with bookingid %d. with error\n"+err.Error(), bookingID)
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

func ConfirmBooking(DB *gorm.DB, input models.MakeDeleteBookings, statusCode models.Bookingstatuses) (int, float64, error) {
	execQuery := "UPDATE currentbookings SET bookingstatusid = ? WHERE id = ?"
	counter := 0
	var pointsDeducted float64
	var errorMessage string
	for _, bookingID := range input.BookingID {
		booking, exists, err := RetrieveBooking(DB, models.URLBooking{BookingID: bookingID})
		if !exists {
			errorMessage += fmt.Sprintf("No pending booking with bookingid %d. with error\n"+err.Error(), bookingID)
			continue
		}
		if err != nil {
			errorMessage += fmt.Sprintf("Error in retrieving pending booking with bookingid %d. with error\n"+err.Error(), bookingID)
			continue
		}

		if deduction, err := DeductPoints(DB, booking.Nusnetid, booking.Cost); err != nil {
			errorMessage += fmt.Sprintf("Error in deducting point(s) for bookingid %d. with error\n Point(s) not deducted and booking not made."+err.Error(), bookingID)
			continue
		} else {
			pointsDeducted += deduction
		}

		if err := DB.Exec(execQuery, statusCode.ID, bookingID).Error; err != nil {
			errorMessage += fmt.Sprintf("Error in confirming booking with bookingid %d. with error\n"+err.Error(), bookingID)
			if refund, err := AddPoints(DB, booking.Nusnetid, booking.Cost); err != nil {
				errorMessage += fmt.Sprintf("Error in refunding point(s) for booking with bookingid %d. with error\n"+err.Error(), bookingID)
			} else {
				errorMessage += fmt.Sprintf("%.1f point(s) refunded for booking with bookingid %d. with error\n"+err.Error(), refund, bookingID)
				pointsDeducted -= refund
			}
		} else {
			counter++
		}
	}
	if errorMessage != "" {
		return counter, pointsDeducted, errors.New(errorMessage)
	} else {
		return counter, pointsDeducted, nil
	}
}

func DeductPoints(DB *gorm.DB, nusnetID string, points float64) (float64, error) {
	query := "UPDATE accounts SET points = points - ? WHERE nusnetid = ?"
	if result := DB.Exec(query, points, nusnetID); result.Error != nil {
		return 0, result.Error
	} else {
		return points, nil
	}
}

func AddPoints(DB *gorm.DB, nusnetID string, points float64) (float64, error) {
	query := "UPDATE accounts SET points = points + ? WHERE nusnetid = ?"
	if result := DB.Exec(query, points, nusnetID); result.Error != nil {
		return 0, result.Error
	} else {
		return points, nil
	}
}

func GetPendingBookings(DB *gorm.DB, input models.User, statusCode models.Bookingstatuses) ([]models.PendingBookings, error) {
	var pendingBookings []models.PendingBookings
	pendingQuery := "SELECT v.id AS venueid, v.venuename, v.unit, buildings.id AS buildingid, buildingname," +
		" currentbookings.id AS bookingid, pax, eventstart, eventend, v.maxcapacity as venuemaxcapacity, cost FROM venues AS v" +
		" JOIN currentBookings ON v.id = currentBookings.venueid " +
		" JOIN buildings ON v.buildingid = buildings.id" +
		" WHERE nusnetid = ? AND bookingstatusid = ?"
	if result := DB.Raw(pendingQuery, input.Nusnetid, statusCode.ID).Scan(&pendingBookings); result.Error != nil {
		if result.RowsAffected != 0 {
			return nil, result.Error
		}
	}
	return pendingBookings, nil
}

func InsertBooking(DB *gorm.DB, overLimitAndTime bool, s models.BookingInput, venue models.Venues, statusCode models.Bookingstatuses) (uuid.UUID, bool, error) {
	// pump into bookings table
	if overLimitAndTime {
		errorMessage := fmt.Sprintf("Unable to make booking for venue %s at time %s to time %s as there are not enough available slots left, or event time has already past.",
			s.Eventstart, s.Eventend, venue.Venuename)
		return uuid.UUID{}, false, errors.New(errorMessage)
	} else {
		if !s.Sharable {
			s.Pax = venue.Maxcapacity
		}
		eventDuration := s.Eventend.Hour() - s.Eventstart.Hour()
		currentBooking := models.Currentbookings{
			Nusnetid:        s.Nusnetid,
			Venueid:         s.Venueid,
			Pax:             s.Pax,
			Createdat:       time.Now(),
			Eventstart:      s.Eventstart,
			Eventend:        s.Eventend,
			Bookingstatusid: statusCode.ID,
			Lastupdated:     time.Now(),
			Cost:            CostComputation(s.Pax, eventDuration, s.Sharable),
		}
		if result := DB.Create(&currentBooking); result.Error != nil {
			errorMessage := "Error in creating pending booking. " + result.Error.Error()
			return uuid.UUID{}, false, errors.New(errorMessage)
		} else {
			return currentBooking.ID, true, nil
		}
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
	if result := DB.Raw(paxQuery, s.Eventstart, s.Eventend, venue.ID, statusIDArr).Scan(&paxCheck); result.Error != nil {
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

func DeletePendingBookingFromTable(DB *gorm.DB, input models.MakeDeleteBookings) (int, error) {
	deleteQuery := "DELETE FROM currentBookings WHERE id = ?"
	counter := 0
	var errorMessage string
	for _, s := range input.BookingID {
		if err := DB.Exec(deleteQuery, s).Error; err != nil {
			errorMessage += err.Error()
		} else {
			counter++
		}
	}
	if counter != len(input.BookingID) {
		return counter, errors.New(errorMessage)
	}
	return counter, nil
}

func DeleteConfirmedBookingFromTable(c *gin.Context, DB *gorm.DB, input models.MakeDeleteBookings) (float64, int, error) {
	deleteQuery := "DELETE FROM currentBookings WHERE id = ?"
	counter := 0
	var refundedTotal float64
	var errorMessage string
	for _, s := range input.BookingID {
		booking, exists, err := RetrieveBooking(DB, models.URLBooking{BookingID: s})
		if !exists {
			errorMessage := fmt.Sprintf("Booking %s does not exist.", s)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
			fmt.Println(errorMessage + err.Error() + "\n")
			continue
		}
		if err != nil {
			errorMessage := fmt.Sprintf("Error in retreieving booking %s.", s)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
			fmt.Println(errorMessage + err.Error() + "\n")
		}

		if err := DB.Exec(deleteQuery, s).Error; err != nil {
			errorMessage += err.Error()
		} else {
			counter++
		}

		refunded, err := AddPoints(DB, booking.Nusnetid, booking.Cost)
		if err != nil {
			errorMessage := fmt.Sprintf("Error refunding points for booking %s.", s)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
			fmt.Println(errorMessage + err.Error() + "\n")
			continue
		} else {
			refundedTotal += refunded
		}

	}
	if counter != len(input.BookingID) {
		return refundedTotal, counter, errors.New(errorMessage)
	}
	return refundedTotal, counter, nil
}

func BookingCartDetails(pendingBookings []models.PendingBookings, user models.User) (models.BookingCart, error) {
	var totalCost float64
	for _, s := range pendingBookings {
		totalCost += s.Cost
	}

	account, exists, err := GetAccount(DB, user)
	if !exists {
		return models.BookingCart{}, errors.New("account does not exist")
	}
	if err != nil {
		return models.BookingCart{}, err
	}

	toReturn := models.BookingCart{
		PendingBookings: pendingBookings,
		TotalCost:       totalCost,
		UserPoints:      account.Points,
	}

	if account.Points < totalCost {
		toReturn.ValidCheckout = false
		return toReturn, nil
	}

	toReturn.ValidCheckout = true
	return toReturn, nil
}

func EditCartDetails(oldBooking models.BookingRequests, pendingBookings []models.PendingBookings, user models.User) (models.EditBookingCart, error) {
	var totalCost float64
	for _, s := range pendingBookings {
		totalCost += s.Cost
	}

	account, exists, err := GetAccount(DB, user)
	if !exists {
		return models.EditBookingCart{}, errors.New("account does not exist")
	}
	if err != nil {
		return models.EditBookingCart{}, err
	}

	toReturn := models.EditBookingCart{
		OldBooking:      oldBooking,
		PendingBookings: pendingBookings,
		TotalCost:       totalCost,
		UserPoints:      account.Points + oldBooking.Cost,
	}
	if account.Points+oldBooking.Cost < totalCost {
		toReturn.ValidCheckout = false
		return toReturn, nil
	}

	toReturn.ValidCheckout = true
	return toReturn, nil
}

func CostComputation(pax int, hours int, sharable bool) float64 {
	if sharable {
		return (float64)(pax*hours) * (1 - config.POINTS_DISCOUNT)
	} else {
		return (float64)(pax * hours)
	}
}

package services

import (
	"fmt"
	"net/http"
	"server/models"

	"github.com/gin-gonic/gin"
)

// GET /timings
// get all the UNAVAILABLE timings of the particular venue on that day
func GetUnavailableTimings(c *gin.Context) {
	// parse input
	var input models.TimingSearchInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input fields"})
		fmt.Println("Error in getting date and venues. " + err.Error() + "\n")
		return
	}

	var unavailableTimings []models.UnavailableTimings
	timingsQuery := "SELECT venuename, unit, maxcapacity, remainingcapacity, buildingname, eventstart, eventend FROM Venues" +
		" JOIN currentBookings ON Venues.id = currentBookings.venueid" +
		" JOIN buildings ON Venues.buildingid = buildings.id;"
	if err := DB.Raw(timingsQuery).Scan(&unavailableTimings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for unavailable timings."})
		fmt.Println("Check tempQuery " + err.Error() + "\n")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": unavailableTimings})
	fmt.Println("Return successful!")
}

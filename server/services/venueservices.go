package services

import (
	"fmt"
	"log"
	"net/http"
	"server/models"

	"github.com/gin-gonic/gin"
)

// GET /home
// get all venues
func GetVenues(c *gin.Context) {
	// get all the venues
	var homepage []models.Homepage
	query1 := "SELECT * FROM public.Venues;"
	if err := DB.Raw(query1).Scan(&homepage).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// get all facilities in the venue and put into homepage struct
	var venuesandfacilities []models.VenuesAndFacilities

	for i, s := range homepage {
		homepage[i].Facilitiesdict = make(map[string]int)
		tempQuery := "SELECT * FROM public.Venuefacilities " +
			"JOIN public.Facilities ON public.Venuefacilities.facilityid = public.facilities.id " +
			"WHERE venueid = ?;"
		if err := DB.Raw(tempQuery, s.ID).Scan(&venuesandfacilities).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// make dict that contains all equipment and its quantity
		for _, y := range venuesandfacilities {
			homepage[i].Facilitiesdict[y.Facilityname] = y.Quantity
		}
	}

	venueArrayDict := make([]map[string]string, 0)
	for _, s := range homepage {
		temp := make(map[string]string)
		temp["Venuename"] = s.Venuename
		venueArrayDict = append(venueArrayDict, temp)
	}

	c.JSON(http.StatusOK, gin.H{"data": venueArrayDict})
	log.Println("Return successful!")
}

// POST /search
// search for venues based on filters applied
func SearchVenues(c *gin.Context) {
	// first get array of facilities
	var searchInput models.SearchInput
	if err := c.ShouldBindJSON(&searchInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Have you input correctly? " + err.Error()})
		return
	}

	// retrieve array of facilityID by querying using facilityname
	var facility models.Facilities
	facilityIDArr := make([]int, 0)
	for _, s := range searchInput.Equipment {
		facilityQuery := "SELECT id FROM facilities WHERE name = ?"
		if err := DB.Raw(facilityQuery, s).Scan(&facility).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check facilityID query"})
			return
		}
		facilityIDArr = append(facilityIDArr, facility.ID)
	}

	// get all the venueid, from venuefacilities table, with equipment filter applied
	var venuefacility []models.Venuefacilities
	venueFacilityQuery := "SELECT venueid FROM public.Venuefacilities ORDER BY venueid"
	for _, s := range facilityIDArr {
		venueFacilityQuery += fmt.Sprintf(" INTERSECT SELECT venueid FROM public.Venuefacilities WHERE facilityid = %d", s)
	}
	if err := DB.Raw(venueFacilityQuery).Scan(&venuefacility).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check venueFacilityQuery"})
		return
	}
	// make them all into a single array
	venueIDArr := make([]int, 0)
	for _, s := range venuefacility {
		venueIDArr = append(venueIDArr, s.Venueid)
	}

	// get all venues, from venues table, with venueid, capacity, buildingNo, unitNo filters applied filter applied
	var homepage []models.Homepage
	homepageQuery := "SELECT * FROM Venues" +
		" JOIN Buildings ON Venues.buildingid = Buildings.id" +
		" JOIN RoomTypes ON Venues.roomtypeid = RoomTypes.id" +
		" JOIN VenueStatuses ON Venues.venuestatusid = VenueStatuses.id" +
		" WHERE Venues.id IN (?) AND maxcapacity >= ?"
	if searchInput.UnitNo != "" && searchInput.BuildingName != "" {
		homepageQuery += " AND unit = ? AND buildingname = ?"
		if err := DB.Raw(homepageQuery, venueIDArr, searchInput.Capacity, searchInput.UnitNo, searchInput.BuildingName).Scan(&homepage).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else if searchInput.UnitNo != "" {
		homepageQuery += " AND unit = ?"
		if err := DB.Raw(homepageQuery, venueIDArr, searchInput.Capacity, searchInput.UnitNo).Scan(&homepage).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else if searchInput.BuildingName != "" {
		homepageQuery += " AND buildingname = ?"
		if err := DB.Raw(homepageQuery, venueIDArr, searchInput.Capacity, searchInput.BuildingName).Scan(&homepage).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else {
		if err := DB.Raw(homepageQuery, venueIDArr, searchInput.Capacity).Scan(&homepage).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// get all facilities in the venue and put into homepage struct
	var venuesandfacilities []models.VenuesAndFacilities

	for i, s := range homepage {
		homepage[i].Facilitiesdict = make(map[string]int)
		tempQuery := "SELECT * FROM public.Venuefacilities " +
			"JOIN public.Facilities ON public.Venuefacilities.facilityid = public.facilities.id " +
			"WHERE venueid = ?;"
		if err := DB.Raw(tempQuery, s.ID).Scan(&venuesandfacilities).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check tempQuery"})
			return
		}

		// make dict that contains all equipment and its quantity
		for _, y := range venuesandfacilities {
			homepage[i].Facilitiesdict[y.Facilityname] = y.Quantity
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": homepage})
	log.Println("Return successful!")
}

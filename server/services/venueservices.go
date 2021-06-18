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
	var searchPage []models.SearchPage
	query1 := "SELECT * FROM Venues" +
		" JOIN Buildings ON Venues.buildingid = Buildings.id" +
		" JOIN RoomTypes ON Venues.roomtypeid = RoomTypes.id" +
		" JOIN VenueStatuses ON Venues.venuestatusid = VenueStatuses.id"
	if err := DB.Raw(query1).Scan(&searchPage).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// get all facilities in the venue and put into homepage struct
	var venuesandfacilities []models.VenuesAndFacilities

	for i, s := range searchPage {
		searchPage[i].Facilitiesdict = make(map[string]int)
		tempQuery := "SELECT * FROM public.Venuefacilities " +
			"JOIN public.Facilities ON public.Venuefacilities.facilityid = public.facilities.id " +
			"WHERE venueid = ?;"
		if err := DB.Raw(tempQuery, s.ID).Scan(&venuesandfacilities).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// make dict that contains all equipment and its quantity
		for _, y := range venuesandfacilities {
			searchPage[i].Facilitiesdict[y.Facilityname] = y.Quantity
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": searchPage})
	log.Println("Return successful!")
}

// GET /search
// search for venues based on filters applied
func SearchVenues(c *gin.Context) {
	// first get array of facilities
	var searchInput models.SearchInput
	if err := c.BindQuery(&searchInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Check input fields. " + err.Error()})
		fmt.Println("Error in getting search input. " + err.Error() + "\n")
		return
	}

	// retrieve array of facilityID by querying using facilityname
	var facility models.Facilities
	facilityIDArr := make([]int, 0)
	for _, s := range searchInput.Equipment {
		facilityQuery := "SELECT id FROM facilities WHERE facilityname = ?"
		if err := DB.Raw(facilityQuery, s).Scan(&facility).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for facilityID. "})
			fmt.Println("Check facilityQuery. " + err.Error() + "\n")
			return
		}
		facilityIDArr = append(facilityIDArr, facility.ID)
	}

	// get all the venueid, from venuefacilities table, with equipment filter applied
	var venuefacility []models.Venuefacilities
	venueFacilityQuery := "SELECT venueid FROM public.Venuefacilities"
	for _, s := range facilityIDArr {
		venueFacilityQuery += fmt.Sprintf(" INTERSECT SELECT venueid FROM public.Venuefacilities WHERE facilityid = %d", s)
	}
	venueFacilityQuery += " ORDER BY venueid"
	if err := DB.Raw(venueFacilityQuery).Scan(&venuefacility).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for venueFacility. "})
		fmt.Println("Check venueFacilityQuery. " + err.Error() + "\n")
		return
	}
	// make them all into a single array
	venueIDArr := make([]int, 0)
	for _, s := range venuefacility {
		venueIDArr = append(venueIDArr, s.Venueid)
	}

	// get dayofweek from searchinput
	var dayOfWeek interface{} // to hold either int or nil
	if searchInput.StartHour != nil {
		dayOfWeek = int(searchInput.StartHour.Weekday())
	}

	// get all venues, from venues table, with venueid, venuename, capacity, buildingNo, unitNo filters applied filter applied
	var searchPage []models.SearchPage
	var query1, query2, query3 string

	if searchInput.StartHour != nil {
		query1 = " JOIN Venuetimings ON v1.id = Venuetimings.venueid"
		query2 = fmt.Sprintf(" AND starthour <= coalesce('%02d:%02d', starthour) AND endHour >= coalesce('%02d:%02d', endHour) AND dayofweek = %d",
			searchInput.StartHour.Hour(), searchInput.StartHour.Minute(), searchInput.EndHour.Hour(), searchInput.EndHour.Minute(), dayOfWeek)
		query3 = " JOIN Venuetimings ON v2.id = Venuetimings.venueid"
	} else {
		query1, query2, query3 = " ", " ", " "
	}

	searchPageQuery := fmt.Sprintf("SELECT * FROM Venues AS v1"+
		" JOIN Buildings ON v1.buildingid = Buildings.id"+
		" JOIN RoomTypes ON v1.roomtypeid = RoomTypes.id"+
		" JOIN VenueStatuses ON v1.venuestatusid = VenueStatuses.id"+
		"%s"+
		" LEFT JOIN currentBookings ON v1.id = currentBookings.venueid"+
		" WHERE v1.id IN (?) AND venuename = coalesce(?, venuename)"+
		" AND unit = coalesce(?, unit) AND buildingname = coalesce(?, buildingname)"+
		" AND roomtypename = coalesce(?, roomtypename)"+
		"%s"+
		" AND (eventstart >= coalesce(?, eventstart) OR eventstart IS NULL) AND (eventend <= coalesce(?, eventend) OR eventend IS NULL)"+
		" EXCEPT"+
		" SELECT * FROM Venues AS v2"+
		" JOIN Buildings ON v2.buildingid = Buildings.id"+
		" JOIN RoomTypes ON v2.roomtypeid = RoomTypes.id"+
		" JOIN VenueStatuses ON v2.venuestatusid = VenueStatuses.id"+
		"%s"+
		" LEFT JOIN currentBookings ON v2.id = currentBookings.venueid"+
		" WHERE (eventstart >= coalesce(?, eventstart) AND eventend <= coalesce(?, eventend))"+
		" AND coalesce(?, v2.maxcapacity) < v2.maxcapacity"+
		" AND coalesce(?, 0) > v2.maxcapacity - coalesce((SELECT MAX(pax) FROM Venueschedules"+
		" JOIN currentBookings ON Venueschedules.bookingid = currentBookings.id"+
		" WHERE Venueschedules.venueid = v2.id AND eventstart >= coalesce(?, eventstart) AND eventend <= coalesce(?, eventend)), 0)"+
		" ORDER BY venuename", query1, query2, query3)

	fmt.Println(searchPageQuery)

	if err := DB.Raw(searchPageQuery, venueIDArr, searchInput.Venuename,
		searchInput.UnitNo, searchInput.BuildingName,
		searchInput.RoomType,
		searchInput.StartHour, searchInput.EndHour,
		searchInput.StartHour, searchInput.EndHour,
		searchInput.Capacity,
		searchInput.Capacity,
		searchInput.StartHour, searchInput.EndHour).Scan(&searchPage).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for buildings, roomtypes, venuestatuses. "})
		fmt.Println("Check searchPageQuery. " + err.Error() + "\n")
		return
	}

	// NEED TO get remaining capacity from bookings
	// var bookings []models.Currentbookings

	// get all facilities in the venue and put into homepage struct
	var venuesandfacilities []models.VenuesAndFacilities

	for i, s := range searchPage {
		searchPage[i].Facilitiesdict = make(map[string]int)
		tempQuery := "SELECT * FROM public.Venuefacilities " +
			"JOIN public.Facilities ON public.Venuefacilities.facilityid = public.facilities.id " +
			"WHERE venueid = ?;"
		if err := DB.Raw(tempQuery, s.ID).Scan(&venuesandfacilities).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in getting facilities. "})
			fmt.Println("Check tempQuery. " + err.Error() + "\n")
			return
		}

		// make dict that contains all equipment and its quantity
		for _, y := range venuesandfacilities {
			searchPage[i].Facilitiesdict[y.Facilityname] = y.Quantity
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": searchPage})
	fmt.Println("Return successful!")
}

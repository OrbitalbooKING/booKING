package services

import (
	"fmt"
	"log"
	"net/http"
	"server/models"
	"time"

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

	// get dayofweek from searchinput
	var dayOfWeek interface{} // to hold either int or nil
	if searchInput.StartHour != nil {
		dayOfWeek = int(searchInput.StartHour.Weekday())
	}

	// get all venues, from venues table, with venueid, venuename, capacity, buildingNo, unitNo filters applied filter applied
	var filters []models.SearchPage
	searchPageQuery := "SELECT DISTINCT v.id FROM venues AS v"
	firstWhereAdded := false

	// timing filter
	var query1 string
	if searchInput.StartHour != nil {
		query1 = fmt.Sprintf(" AND vt.startHour <= coalesce('%02d:%02d', startHour) AND vt.endHour >= coalesce('%02d:%02d', endHour)",
			searchInput.StartHour.Hour(), searchInput.StartHour.Minute(), searchInput.EndHour.Hour(), searchInput.EndHour.Minute())
	} else {
		query1 = " "
	}
	if searchInput.StartHour != nil {
		searchPageQuery += fmt.Sprintf(" WHERE v.id NOT IN ("+
			" SELECT cb.venueID FROM currentBookings AS cb"+
			" WHERE cb.venueID = v.id"+
			" AND cb.eventStart > TIMESTAMP '%s' AND cb.eventEnd < TIMESTAMP '%s')"+
			" AND v.id IN ("+
			" SELECT vt.venueID FROM venueTimings AS vt"+
			" WHERE vt.venueID = v.id"+
			" AND vt.dayOfWeek = %d"+
			"%s)", searchInput.StartHour.Format(time.RFC3339), searchInput.EndHour.Format(time.RFC3339), dayOfWeek, query1)

		// timing with capacity filter (so as to check if venues with bookings can still fit the capacity stated)
		if searchInput.Capacity != 0 {
			searchPageQuery += fmt.Sprintf(" AND v.id NOT IN ("+
				" SELECT cb.venueID FROM currentBookings AS cb"+
				" WHERE cb.venueID = v.id"+
				" AND (cb.eventStart >= TIMESTAMP '%s' OR cb.eventEnd <= TIMESTAMP '%s')"+
				" GROUP BY cb.venueID"+
				" HAVING SUM(cb.pax) > v.maxCapacity - %d)", searchInput.StartHour.Format(time.RFC3339), searchInput.EndHour.Format(time.RFC3339), searchInput.Capacity)
		}
		firstWhereAdded = true
	}

	// capacity filter
	if searchInput.Capacity != 0 {
		if firstWhereAdded {
			searchPageQuery += fmt.Sprintf(" AND v.id IN ("+
				" SELECT ID FROM venues"+
				" WHERE maxcapacity >= %d)", searchInput.Capacity)
		} else {
			searchPageQuery += fmt.Sprintf(" WHERE v.id IN ("+
				" SELECT ID FROM venues"+
				" WHERE maxcapacity >= %d)", searchInput.Capacity)
			firstWhereAdded = true
		}
	}

	// equipment filter
	if searchInput.Equipment != nil {
		if firstWhereAdded {
			searchPageQuery += fmt.Sprintf(" AND v.id IN (" +
				" SELECT venueID FROM venueFacilities AS vf" +
				" WHERE vf.venueID = v.id" +
				" AND vf.facilityid IN (")
		} else {
			searchPageQuery += fmt.Sprintf(" WHERE v.id IN (" +
				" SELECT venueID FROM venueFacilities AS vf" +
				" WHERE vf.venueID = v.id" +
				" AND vf.facilityid IN (")
			firstWhereAdded = true
		}
		// add array elements
		for i, s := range facilityIDArr {
			if i == len(facilityIDArr)-1 {
				searchPageQuery += fmt.Sprintf("%d)", s)
			} else {
				searchPageQuery += fmt.Sprintf("%d,", s)
			}
		}
		searchPageQuery += fmt.Sprintf(" GROUP BY vf.venueid"+
			" HAVING COUNT(vf.facilityid) > %d)", len(facilityIDArr))
	}

	// venuename filter
	if searchInput.Venuename != nil {
		if firstWhereAdded {
			searchPageQuery += fmt.Sprintf(" AND v.id IN ("+
				" SELECT ID FROM venues"+
				" WHERE venuename = %s)", *searchInput.Venuename)
		} else {
			searchPageQuery += fmt.Sprintf(" WHERE v.id IN ("+
				" SELECT ID FROM venues"+
				" WHERE venuename = '%s')", *searchInput.Venuename)
			firstWhereAdded = true
		}
	}

	// building filter
	if searchInput.Buildingid != 0 {
		if firstWhereAdded {
			searchPageQuery += fmt.Sprintf(" AND v.id IN ("+
				" SELECT ID from venues"+
				" WHERE buildingid = %d)", searchInput.Buildingid)
		} else {
			searchPageQuery += fmt.Sprintf(" WHERE v.id IN ("+
				" SELECT ID from venues"+
				" WHERE buildingid = %d)", searchInput.Buildingid)
			firstWhereAdded = true
		}
	}
	// unit filter
	if searchInput.UnitNo != nil {
		if firstWhereAdded {
			searchPageQuery += fmt.Sprintf(" AND v.id IN ("+
				" SELECT ID from venues"+
				" WHERE unit = '%s')", *searchInput.UnitNo)
		} else {
			searchPageQuery += fmt.Sprintf(" WHERE v.id IN ("+
				" SELECT ID from venues"+
				" WHERE unit = '%s')", *searchInput.UnitNo)
			firstWhereAdded = true
		}
	}

	// roomtype filter
	if searchInput.RoomType != 0 {
		if firstWhereAdded {
			searchPageQuery += fmt.Sprintf(" AND v.id IN ("+
				" SELECT ID from venues"+
				" WHERE roomtypeid = %d)", searchInput.RoomType)
		} else {
			searchPageQuery += fmt.Sprintf(" WHERE v.id IN ("+
				" SELECT ID from venues"+
				" WHERE roomtypeid = %d)", searchInput.RoomType)
			firstWhereAdded = true
		}
	}

	searchPageQuery += " ORDER BY v.id"
	fmt.Println(searchPageQuery)

	if err := DB.Raw(searchPageQuery).Scan(&filters).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for buildings, roomtypes, venuestatuses. "})
		fmt.Println("Check searchPageQuery. " + err.Error() + "\n")
		return
	}

	// make into v.id in filters into an array
	filterArray := make([]int, 0)
	for _, s := range filters {
		filterArray = append(filterArray, s.ID)
	}

	// get all the venue information with venueid
	searchPage := make([]models.SearchPage, 0)
	returnQuery := "SELECT DISTINCT v.id, v.venuename, v.unit, buildingname, buildingid, v.maxcapacity, roomtypename, v.roomtypeid, venuestatusname, v.mapphoto, v.floorplan" +
		" FROM venues AS v" +
		" JOIN buildings ON buildings.id = v.buildingid" +
		" JOIN roomtypes ON roomtypes.id = v.roomtypeid" +
		" JOIN venuestatuses ON venuestatuses.id = v.venuestatusid" +
		" WHERE v.id IN (?)"

	if err := DB.Raw(returnQuery, filterArray).Scan(&searchPage).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for buildings, roomtypes, venuestatuses. "})
		fmt.Println("Check searchPageQuery. " + err.Error() + "\n")
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

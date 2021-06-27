package services

import (
	"fmt"
	"github.com/jinzhu/gorm"
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
	searchPage, err := GetSearchPage(DB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to populate venues. "+ err.Error()})
		fmt.Println("Unable to populate venues. "+ err.Error())
		return
	}

	if err := MakeVenueFacilitiesDict(DB, searchPage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false,
			"message": "Unable to get venues and facilities. " + err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"data": searchPage})
	log.Println("Return successful!")
}

// GET /search
// search for venues based on filters applied
func SearchVenues(c *gin.Context) {
	var searchInput models.SearchInput
	if err := c.BindQuery(&searchInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Check input fields. " + err.Error()})
		fmt.Println("Error in getting search input. " + err.Error() + "\n")
		return
	}

	facilityIDArr, err := GetFacilityIDArr(DB, searchInput)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for facilityID. "})
		fmt.Println("Check facilityQuery. " + err.Error() + "\n")
	}

	filters, err := GetVenueIDArrAfterFilter(DB, searchInput, facilityIDArr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for buildings, roomtypes, venuestatuses. "})
		fmt.Println("Check searchPageQuery. " + err.Error() + "\n")
	}

	searchPage, exists, err := GetVenueArr(DB, filters)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error in querying for buildings, roomtypes, venuestatuses. "})
		fmt.Println("Check searchPageQuery. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Venues do not exist in database."})
		fmt.Println("Check searchPageQuery. " + err.Error() + "\n")
	}

	if err := MakeVenueFacilitiesDict(DB, searchPage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false,
			"message": "Unable to get venues and facilities. " + err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"data": searchPage})
	fmt.Println("Return successful!")
}


func GetVenueArr(DB *gorm.DB, filters []models.SearchPage) ([]models.SearchPage, bool, error) {
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

	result := DB.Raw(returnQuery, filterArray).Scan(&searchPage)
	if result.Error == gorm.ErrRecordNotFound {
		return nil, false, nil
	}
	if result.Error != nil {
		return nil, false, result.Error
	}
	return searchPage, true, nil
}

func GetVenueIDArrAfterFilter(DB *gorm.DB, searchInput models.SearchInput, facilityIDArr []int) ([]models.SearchPage, error) {
	// get dayofweek from searchinput
	var dayOfWeek interface{} // to hold either int or nil
	if searchInput.StartHour != nil {
		dayOfWeek = int(searchInput.StartHour.Weekday())
	}

	// get all venues, from venues table, with venueid, venuename, capacity, buildingNo, unitNo filters applied filter applied
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
				" WHERE venuename = '%s')", *searchInput.Venuename)
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
	var filters []models.SearchPage
	if err := DB.Raw(searchPageQuery).Scan(&filters).Error; err != nil {
		return nil, err
	}
	return filters, nil
}

func GetFacilityIDArr(DB *gorm.DB, searchInput models.SearchInput) ([]int, error) {
	// retrieve array of facilityID by querying using facilityname
	var facility models.Facilities
	facilityIDArr := make([]int, 0)
	for _, s := range searchInput.Equipment {
		facilityQuery := "SELECT id FROM facilities WHERE facilityname = ?"
		if err := DB.Raw(facilityQuery, s).Scan(&facility).Error; err != nil {
			return nil, err
		}
		facilityIDArr = append(facilityIDArr, facility.ID)
	}
	return facilityIDArr, nil
}

func GetVenueFacilities(DB *gorm.DB, s models.SearchPage) ([]models.VenuesAndFacilities, error) {
	var venuesandfacilities []models.VenuesAndFacilities
	tempQuery := "SELECT * FROM public.Venuefacilities " +
		"JOIN public.Facilities ON public.Venuefacilities.facilityid = public.facilities.id " +
		"WHERE venueid = ?;"
	if err := DB.Raw(tempQuery, s.ID).Scan(&venuesandfacilities).Error; err != nil {
		return []models.VenuesAndFacilities{}, err
	}
	return venuesandfacilities, nil
}

func GetSearchPage(DB *gorm.DB) ([]models.SearchPage, error) {
	var searchPage []models.SearchPage
	query1 := "SELECT * FROM Venues" +
		" JOIN Buildings ON Venues.buildingid = Buildings.id" +
		" JOIN RoomTypes ON Venues.roomtypeid = RoomTypes.id" +
		" JOIN VenueStatuses ON Venues.venuestatusid = VenueStatuses.id"
	if err := DB.Raw(query1).Scan(&searchPage).Error; err != nil {
		return []models.SearchPage{}, err
	}
	return searchPage, nil
}

func MakeVenueFacilitiesDict(DB *gorm.DB, searchPage []models.SearchPage) error{
	for i, s := range searchPage {
		// get all facilities in the venue and put into homepage struct
		searchPage[i].Facilitiesdict = make(map[string]int)
		venuesandfacilities, err := GetVenueFacilities(DB, s)
		if err != nil {
			return err
		}

		// make dict that contains all equipment and its quantity
		for _, y := range venuesandfacilities {
			searchPage[i].Facilitiesdict[y.Facilityname] = y.Quantity
		}
	}
	return nil
}

package services

import (
	"encoding/csv"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"server/config"
	"server/models"
	"strconv"
	"strings"
)

// reads accountTypes.csv and loads into db for accountTypes
func LoadAccountTypesCSV() {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	exPath := filepath.Dir(ex)
	fmt.Println(" WE REACHED HERE !!!!! \n" + exPath)

	csvFile, err := os.Open(config.ACCOUNTTYPES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened accountTypes.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		} else {
			tempHold = int(s)
		}

		accountType := models.Accounttypes{
			ID:                     tempHold,
			Accounttypename:        line[1],
			Accounttypedescription: line[2],
		}
		if err := DB.Create(&accountType).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		}
		counter++
	}

	fmt.Printf("Successfully written %d lines on accountTypes table.\n", counter-1)
}

// reads accountStatuses.csv and loads into db for accountStatuses
func LoadAccountStatusesCSV() {
	csvFile, err := os.Open(config.ACCOUNTSTATUSES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened accountStatuses.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		} else {
			tempHold = int(s)
		}

		accountStatus := models.Accountstatuses{
			ID:                       tempHold,
			Accountstatusname:        line[1],
			Accountstatusdescription: line[2],
		}
		if err := DB.Create(&accountStatus).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		}
		counter++
	}

	fmt.Printf("Successfully written %d lines on accountStatuses table.\n", counter-1)
}

// reads notificationTypes.csv and loads into db for notificationTypes
func LoadNotificationTypesCSV() {
	csvFile, err := os.Open(config.NOTIFICATIONTYPES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened notificationTypes.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		} else {
			tempHold = int(s)
		}

		notificationType := models.Notificationtypes{
			ID:                          tempHold,
			Notificationtype:            line[1],
			Notificationtypedescription: line[2],
		}
		if err := DB.Create(&notificationType).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		}
		counter++
	}

	fmt.Printf("Successfully written %d lines on notificationTypes table.\n", counter-1)
}

// reads venueStatuses.csv and loads into db for venueStatuses
func LoadVenueStatusesCSV() {
	csvFile, err := os.Open(config.VENUESTATUSES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened venueStatuses.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		} else {
			tempHold = int(s)
		}

		venueStatus := models.Venuestatuses{
			ID:                     tempHold,
			Venuestatusname:        line[1],
			Venuestatusdescription: line[2],
		}
		if err := DB.Create(&venueStatus).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		}
		counter++
	}

	fmt.Printf("Successfully written %d lines on venueStatuses table.\n", counter-1)
}

// reads bookingStatuses.csv and loads into db for bookingStatuses
func LoadBookingStatusesCSV() {
	csvFile, err := os.Open(config.BOOKINGSTATUSES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened bookingStatuses.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		} else {
			tempHold = int(s)
		}

		bookingStatus := models.Bookingstatuses{
			ID:                       tempHold,
			Bookingstatusdescription: line[1],
		}
		if err := DB.Create(&bookingStatus).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		}
		counter++
	}

	fmt.Printf("Successfully written %d lines on bookingStatuses table.\n", counter-1)
}

// reads faculties.csv and loads into db for faculties
func LoadFacultiesCSV() {
	csvFile, err := os.Open(config.FACULTIES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened faculties.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		} else {
			tempHold = int(s)
		}

		faculty := models.Faculties{
			ID:                 tempHold,
			Facultyname:        line[1],
			Facultydescription: line[2],
		}
		if err := DB.Create(&faculty).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		}
		counter++
	}

	fmt.Printf("Successfully written %d lines on Faculties table.\n", counter-1)
}

// reads socvenues.csv and loads into db for roomTypes
func LoadRoomTypes() {
	csvFile, err := os.Open(config.SOCVENUES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened socvenues.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	for _, line := range csvLines[1:] {
		// check if room type already exist in table
		var roomType models.Roomtypes
		roomType_name := line[4]

		if err := DB.First(&roomType, "roomtypename = ?", line[4]); err.Error != nil {
			if err.RowsAffected == 0 {
				// inserting this way so that primary key from old csv is not copied over
				query := "INSERT INTO roomtypes (id, roomtypename) VALUES (?, ?)"
				if err := DB.Exec(query, counter, roomType_name); err.Error != nil {
					fmt.Printf("Error in writing entry at RoomTypes, at csv file line %d\n"+err.Error.Error()+"\n", counter-1)
					return
				}
				counter++
			} else {
				fmt.Printf("Error in querying DB, check roomType query. " + err.Error.Error() + "\n")
				return
			}
		} else {
			continue
		}
	}
	fmt.Printf("Successfully written %d lines. on roomTypes table \n", counter-1)
}

// reads socvenues.csv and loads into db for buildings
func LoadBuildings() {
	csvFile, err := os.Open(config.SOCVENUES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened socvenues.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	for _, line := range csvLines[1 : len(csvLines)-1] {
		var building models.Buildings
		building_name := strings.Split(line[1], " ")[0]

		if building_name == "" { // prevents insertion of the incompleted building
			continue
		} else if err := DB.First(&building, "buildingname = ?", building_name); err.Error != nil {
			if err.RowsAffected == 0 {
				// check which faculty this building is in
				var faculty models.Faculties
				if strings.Contains(building_name, "COM") || strings.EqualFold(string(building_name[0]), "i") {
					if err := DB.First(&faculty, "facultyname = ?", "SoC").Error; err != nil {
						fmt.Printf("Error in query for faculty (for SoC). " + err.Error() + "\n")
						return
					}
				} else if strings.Contains(building_name, "AS") {
					if err := DB.First(&faculty, "facultyname = ?", "FASS").Error; err != nil {
						fmt.Printf("Error in query for faculty (for FASS). " + err.Error() + "\n")
						return
					}
				} else {
					if err := DB.First(&faculty, "facultyname = ?", "Others").Error; err != nil {
						fmt.Printf("Error in query for faculty (for Others). " + err.Error() + "\n")
						return
					}
				}

				// inserting this way so that primary key from old csv is not copied over
				query := "INSERT INTO buildings (id, buildingname, facultyid) VALUES (?, ?, ?)"
				if err := DB.Exec(query, counter, building_name, faculty.ID).Error; err != nil {
					fmt.Printf("Error in writing entry at Buildings, at csv file line %d\n"+err.Error()+"\n", counter-1)
					return
				}
				counter++
			} else {
				fmt.Printf("Error in querying DB, check Buildings query. " + err.Error.Error() + "\n")
				return
			}
		} else {
			continue
		}
	}
	var building models.Buildings
	fmt.Printf("Successfully written %d lines. on Buildings table \n", counter)
	query := "SELECT * FROM buildings WHERE id = 1"
	DB.Raw(query).Scan(&building)
}

// reads and loads venues.csv into db for venues
func LoadVenues() {
	csvFile, err := os.Open(config.SOCVENUES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened socvenues.csv file")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}

	counter := 1
	for _, line := range csvLines[1:] {
		// get venue name
		venue_name := line[0]

		// split line[1] and get index #1 to get unit number
		locationArr := strings.SplitN(line[1], " ", 2)
		var unit_no string
		if len(locationArr) > 1 {
			unit_no = locationArr[1]
		} else {
			unit_no = locationArr[0]
		}

		// RNG maxCapacity (1 - 100)
		maxcapacity := rand.Intn(100) + 1

		// split line[1] and get index #0 to retrieve buildingID from buildings table
		var building models.Buildings
		buildingQuery := "SELECT * FROM buildings WHERE buildingname = ?;"
		tempName := locationArr[0]
		if tempName == "" {
			continue
		}
		if err := DB.Raw(buildingQuery, tempName).Scan(&building).Error; err != nil {
			fmt.Println("Error in querying for buildingID. " + err.Error() + "\n")
			return
		}
		buildingID := building.ID

		// get use RoomType name to get RoomTypeID from roomtypes table
		var roomType models.Roomtypes
		roomTypeQuery := "SELECT * FROM roomtypes WHERE roomtypename = ?"
		if err := DB.Raw(roomTypeQuery, line[4]).Scan(&roomType).Error; err != nil {
			fmt.Println("Error in querying for roomTypeID. " + err.Error() + "\n")
			return
		}
		roomTypeID := roomType.ID

		// RNG venueStatusID (1 - 3)
		tempRand := rand.Intn(4)
		for tempRand < 1 || tempRand > 3 {
			tempRand = rand.Intn(4)
		}
		venuestatusID := tempRand

		// get mapPhoto href
		mapPhotoLink := line[2]

		// get floorPlan href
		floorPlanLink := line[3]

		// put all into venues struct then insert into venues table
		venue := models.Venues{
			ID:            counter,
			Venuename:     venue_name,
			Unit:          unit_no,
			Maxcapacity:   maxcapacity,
			Buildingid:    buildingID,
			Roomtypeid:    roomTypeID,
			Venuestatusid: venuestatusID,
			Mapphoto:      mapPhotoLink,
			Floorplan:     floorPlanLink,
		}

		if err := DB.Create(&venue).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d\n"+err.Error()+"\n", counter-1)
			return
		}
		counter++
	}
	fmt.Printf("Successfully written %d lines. on Venues table \n", counter-1)
}

// reads and loads venueTimings.csv into db for venueTimings
func LoadVenueTimingsCSV() {
	csvFile, err := os.Open(config.VENUETIMINGS_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened venueTimings.CSV")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}
	counter := 0
	toConvert := [3]int{0, 1, 2}
	var tempHold [3]int
	for _, line := range csvLines[1:] {
		counter++

		// convert string to int, for index #0 to #2
		for index, number := range toConvert {
			if s, err := strconv.ParseInt(line[number], 10, 0); err != nil {
				fmt.Printf("Error in conversion from int to string, at csv file line %d\n"+err.Error()+"\n", counter)
				return
			} else {
				tempHold[index] = int(s)
			}
		}

		venueTiming := models.Venuetimings{
			ID:        tempHold[0],
			Venueid:   tempHold[1],
			Dayofweek: tempHold[2],
			Starthour: line[3],
			Endhour:   line[4],
		}
		if err := DB.Create(&venueTiming).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		}
	}

	fmt.Printf("Successfully written %d lines on venueTimings table.\n", counter-1)
}

// reads and loads facility.csv into db for venues
func LoadFacilityCSV() {
	csvFile, err := os.Open(config.FACILITIES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened facility.CSV")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}
	counter := 0
	var tempHold int
	for _, line := range csvLines[1:] {
		counter++

		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		} else {
			tempHold = int(s)
		}

		facility := models.Facilities{
			ID:                  tempHold,
			Facilityname:        line[1],
			Facilitydescription: line[2],
		}
		if err := DB.Create(&facility).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
			return
		}
	}

	fmt.Printf("Successfully written %d lines on Facilities table.\n", counter-1)
}

// reads and loads venuefacility.csv into db for venues
func LoadVenueFacilityCSV() {
	csvFile, err := os.Open(config.VENUEFACILITIES_CSV)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Successfully opened venueFacility.CSV")
	defer csvFile.Close()

	csvLines, err := csv.NewReader(csvFile).ReadAll()
	if err != nil {
		fmt.Println(err)
		return
	}
	counter := 0
	toConvert := [4]int{0, 1, 2, 3}
	var tempHold [4]int
	for _, line := range csvLines[1:] {
		counter++

		// convert string to int, for index #0 to #2
		for index, number := range toConvert {
			if s, err := strconv.ParseInt(line[number], 10, 0); err != nil {
				fmt.Printf("Error in conversion from int to string, at csv file line %d\n"+err.Error()+"\n", counter)
				return
			} else {
				tempHold[index] = int(s)
			}
		}

		venuefacility := models.Venuefacilities{
			ID:         tempHold[0],
			Venueid:    tempHold[1],
			Facilityid: tempHold[2],
			Quantity:   tempHold[3],
		}
		if err := DB.Create(&venuefacility).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter)
			return
		}
	}

	fmt.Printf("Successfully written %d lines on Venuefacilities table.\n", counter)
}

func LoadAllCSV() {
	LoadAccountTypesCSV()
	LoadAccountStatusesCSV()
	LoadBookingStatusesCSV()
	LoadNotificationTypesCSV()
	LoadVenueStatusesCSV()

	LoadFacultiesCSV()
	LoadRoomTypes()
	LoadFacilityCSV()
	LoadBuildings()
	LoadVenues()
	LoadVenueTimingsCSV()
	// load notifications here
	LoadVenueFacilityCSV()
}

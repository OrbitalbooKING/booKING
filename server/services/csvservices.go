package services

import (
	"encoding/csv"
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"

	"github.com/OrbitalbooKING/booKING/server/config"
	"github.com/OrbitalbooKING/booKING/server/models"
)

// func to read csv files from URL
func ReadCSVFromUrl(url string) ([][]string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	statusCode := resp.StatusCode
	if statusCode != 200 {
		if statusCode == 401 || statusCode == 402 || statusCode == 403 || statusCode == 451 {
			return nil, errors.New("unable to gain access to website")
		} else if statusCode == 408 {
			return nil, errors.New("request timed out")
		} else if statusCode == 414 || statusCode == 431 {
			return nil, errors.New("URI too long")
		} else if statusCode == 429 {
			return nil, errors.New("too many requests sent at on time")
		} else if statusCode == 500 {
			return nil, errors.New("internal server error")
		} else if statusCode == 503 {
			return nil, errors.New("bad gateway")
		} else if statusCode == 504 {
			return nil, errors.New("gateway timeout")
		} else if statusCode == 507 {
			return nil, errors.New("server has insufficient storage to complete request")
		} else if statusCode == 508 {
			return nil, errors.New("infinite loop detected and server terminated process")
		} else if statusCode == 511 {
			return nil, errors.New("network authentication required to gain network access")
		} else {
			return nil, fmt.Errorf("unable to reach website with status code %d", resp.StatusCode)
		}
	}

	noCSV := errors.New("nothing to read at this URL")
	if resp == nil {
		return nil, noCSV
	}
	defer resp.Body.Close()

	reader := csv.NewReader(resp.Body)
	reader.Comma = ','
	reader.LazyQuotes = true
	data, err := reader.ReadAll()
	if err != nil || data == nil {
		return nil, noCSV // use own error
	}

	return data, nil
}

// reads accountTypes.csv and loads into db for accountTypes
func LoadAccountTypesCSV() {
	FILE_NAME := config.ACCOUNTTYPES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			continue
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
		} else {
			counter++
		}
	}

	fmt.Printf("Successfully written %d lines on accountTypes table.\n", counter-1)
}

// reads accountStatuses.csv and loads into db for accountStatuses
func LoadAccountStatusesCSV() {
	FILE_NAME := config.ACCOUNTSTATUSES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			continue
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
		} else {
			counter++
		}
	}

	fmt.Printf("Successfully written %d lines on accountStatuses table.\n", counter-1)
}

// reads notificationTypes.csv and loads into db for notificationTypes
func LoadNotificationTypesCSV() {
	FILE_NAME := config.NOTIFICATIONTYPES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			continue
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
		} else {
			counter++
		}
	}

	fmt.Printf("Successfully written %d lines on notificationTypes table.\n", counter-1)
}

// reads venueStatuses.csv and loads into db for venueStatuses
func LoadVenueStatusesCSV() {
	FILE_NAME := config.VENUESTATUSES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			continue
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
		} else {
			counter++
		}
	}

	fmt.Printf("Successfully written %d lines on venueStatuses table.\n", counter-1)
}

// reads bookingStatuses.csv and loads into db for bookingStatuses
func LoadBookingStatusesCSV() {
	FILE_NAME := config.BOOKINGSTATUSES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			continue
		} else {
			tempHold = int(s)
		}

		bookingStatus := models.Bookingstatuses{
			ID:                       tempHold,
			Bookingstatusdescription: line[1],
		}
		if err := DB.Create(&bookingStatus).Error; err != nil {
			fmt.Printf("Error in writing entry, at csv file line %d. "+err.Error()+"\n", counter-1)
		} else {
			counter++
		}
	}

	fmt.Printf("Successfully written %d lines on bookingStatuses table.\n", counter-1)
}

// reads faculties.csv and loads into db for faculties
func LoadFacultiesCSV() {
	FILE_NAME := config.FACULTIES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			continue
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
		} else {
			counter++
		}
	}

	fmt.Printf("Successfully written %d lines on Faculties table.\n", counter-1)
}

// reads socvenues.csv and loads into db for roomTypes
func LoadRoomTypes() {
	FILE_NAME := config.SOCVENUES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
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
				} else {
					counter++
				}
			} else {
				fmt.Printf("Error in querying DB, check roomType query. " + err.Error.Error() + "\n")
				continue
			}
		} else {
			continue
		}
	}
	fmt.Printf("Successfully written %d lines. on roomTypes table \n", counter-1)
}

// reads socvenues.csv and loads into db for buildings
func LoadBuildings() {
	FILE_NAME := config.SOCVENUES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
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
						continue
					}
				} else if strings.Contains(building_name, "AS") {
					if err := DB.First(&faculty, "facultyname = ?", "FASS").Error; err != nil {
						fmt.Printf("Error in query for faculty (for FASS). " + err.Error() + "\n")
						continue
					}
				} else {
					if err := DB.First(&faculty, "facultyname = ?", "Others").Error; err != nil {
						fmt.Printf("Error in query for faculty (for Others). " + err.Error() + "\n")
						continue
					}
				}

				// inserting this way so that primary key from old csv is not copied over
				query := "INSERT INTO buildings (id, buildingname, facultyid) VALUES (?, ?, ?)"
				if err := DB.Exec(query, counter, building_name, faculty.ID).Error; err != nil {
					fmt.Printf("Error in writing entry at Buildings, at csv file line %d\n"+err.Error()+"\n", counter-1)
					continue
				} else {
					counter++
				}
			} else {
				fmt.Printf("Error in querying DB, check Buildings query. " + err.Error.Error() + "\n")
				continue
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
	FILE_NAME := config.SOCVENUES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
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
			continue
		}
		buildingID := building.ID

		// get use RoomType name to get RoomTypeID from roomtypes table
		var roomType models.Roomtypes
		roomTypeQuery := "SELECT * FROM roomtypes WHERE roomtypename = ?"
		if err := DB.Raw(roomTypeQuery, line[4]).Scan(&roomType).Error; err != nil {
			fmt.Println("Error in querying for roomTypeID. " + err.Error() + "\n")
			continue
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
			continue
		} else {
			counter++
		}
	}
	fmt.Printf("Successfully written %d lines. on Venues table \n", counter-1)
}

// reads and loads venueTimings.csv into db for venueTimings
func LoadVenueTimingsCSV() {
	FILE_NAME := config.VENUETIMINGS_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	toConvert := [3]int{0, 1, 2}
	var tempHold [3]int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0 to #2
		for index, number := range toConvert {
			if s, err := strconv.ParseInt(line[number], 10, 0); err != nil {
				fmt.Printf("Error in conversion from int to string, at csv file line %d\n"+err.Error()+"\n", counter)
				continue
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
			continue
		} else {
			counter++
		}
	}

	fmt.Printf("Successfully written %d lines on venueTimings table.\n", counter-1)
}

// reads and loads facility.csv into db for venues
func LoadFacilityCSV() {
	FILE_NAME := config.FACILITIES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	var tempHold int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0
		if s, err := strconv.ParseInt(line[0], 10, 0); err != nil {
			fmt.Printf("Error in conversion from int to string, at csv file line %d. "+err.Error()+"\n", counter-1)
			continue
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
			continue
		} else {
			counter++
		}
	}

	fmt.Printf("Successfully written %d lines on Facilities table.\n", counter-1)
}

// reads and loads venuefacility.csv into db for venues
func LoadVenueFacilityCSV() {
	FILE_NAME := config.VENUEFACILITIES_CSV
	csvLines, err := ReadCSVFromUrl(FILE_NAME)
	if err != nil {
		errorMessage := fmt.Sprintf("Unable to read %s files. "+err.Error()+"\n", FILE_NAME)
		fmt.Println(errorMessage)
	} else {
		successMessage := fmt.Sprintf("Successfully opened %s.", FILE_NAME)
		fmt.Println(successMessage)
	}

	counter := 1
	toConvert := [4]int{0, 1, 2, 3}
	var tempHold [4]int
	for _, line := range csvLines[1:] {
		// convert string to int, for index #0 to #2
		for index, number := range toConvert {
			if s, err := strconv.ParseInt(line[number], 10, 0); err != nil {
				fmt.Printf("Error in conversion from int to string, at csv file line %d\n"+err.Error()+"\n", counter)
				continue
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
			continue
		} else {
			counter++
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

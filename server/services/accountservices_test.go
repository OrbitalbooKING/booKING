package services

import (
	"bytes"
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"math/rand"
	"mime/multipart"
	"net/http"
	"regexp"
	"strconv"
	"testing"
	"time"

	unitTest "github.com/Valiben/gin_unit_test"

	"github.com/google/uuid"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/OrbitalbooKING/booKING/server/config"
	"github.com/OrbitalbooKING/booKING/server/models"
	"github.com/jinzhu/gorm"
)

type Repository struct {
	db *gorm.DB
}

type StandardSuccess struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type StandardError struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

type AnyTime struct{}

func (a AnyTime) Match(v driver.Value) bool {
	_, ok := v.(time.Time)
	return ok
}

func setupAccounts(table string) (sqlmock.Sqlmock, *Repository, *sqlmock.Rows, error) {
	type Table struct {
		Headers []string
	}

	tables := map[string]Table{
		"Accounts": {
			Headers: []string{"id", "nusnetID", "passwordHash", "name", "facultyID", "gradYear", "profilePic",
				"accountTypeID", "points", "createdAt", "lastUpdated", "accountStatusID"},
		},
		"AccountStatuses": {
			Headers: []string{"id", "accountStatusName", "accountStatusDescription"},
		},
		"AccountTypes": {
			Headers: []string{"id", "accountTypeName", "accountTypeDescription"},
		},
		"Faculties": {
			Headers: []string{"id", "facultyName", "facultyDescription"},
		},
		"CurrentBookings": {
			Headers: []string{"id", "nusnetID", "venueID", "pax", "createdAt", "eventStart",
				"eventEnd", "bookingStatusID", "lastUpdated"},
		},
	}
	var repository *Repository
	var mock sqlmock.Sqlmock
	var db *sql.DB
	var err error

	db, mock, err = sqlmock.New()
	if err != nil {
		return nil, nil, nil, err
	}
	gdb, err := gorm.Open("postgres", db)
	if err != nil {
		return nil, nil, nil, err
	}
	repository = &Repository{db: gdb}

	rows := sqlmock.NewRows(tables[table].Headers)
	if table == "Accounts" {
		rows = rows.AddRow(1, "e001", "pass", "test", 1, 2022, "testURL", 1, 50, time.Time{}, time.Time{}, 1)
	} else if table == "AccountStatuses" {
		rows = rows.AddRow(1, "Online", "Currently logged in.")
	} else if table == "AccountTypes" {
		rows = rows.AddRow(1, "Student", "For students, basic rights")
	} else if table == "Faculties" {
		rows = rows.AddRow(1, "SoC", "School of Computing").
			AddRow(2, "FASS", "Faculty of Arts and Social Sciences").
			AddRow(3, "Others", "Others")
	} else if table == "CurrentBookings" {
		rows = rows.AddRow(uuid.UUID{}, "e001", 1, 10, time.Time{}, time.Time{}, time.Time{}, 1, time.Time{}).
			AddRow(uuid.UUID{}, "e001", 1, 10, time.Time{}, time.Time{}, time.Time{}, 1, time.Time{}).
			AddRow(uuid.UUID{}, "e001", 1, 10, time.Time{}, time.Time{}, time.Time{}, 1, time.Time{})
	}

	return mock, repository, rows, nil
}

func TestGetAccountTypeDetails_ValidInput(t *testing.T) {
	mock, repo, rows, err := setupAccounts("AccountTypes")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	input := "Student"
	query := regexp.QuoteMeta("SELECT * FROM accounttypes WHERE accounttypename = $1")
	mock.ExpectQuery(query).WithArgs("Student").WillReturnRows(rows)

	expected := models.Accounttypes{
		ID:                     1,
		Accounttypename:        input,
		Accounttypedescription: "For students, basic rights",
	}
	if accountType, exists, err := GetAccountTypeDetails(repo.db, input); err != nil || !exists || accountType != expected {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !exists && err == nil {
			t.Fatalf("Unexpected error that accountType does not exist for a valid input.")
		}
		if accountType.ID != expected.ID {
			t.Fatalf("Expected to get that accountType is %d, but got %d.", expected.ID, accountType.ID)
		}
	}
}

func TestGetAccountTypeDetails_InvalidInput(t *testing.T) {
	mock, repo, _, err := setupAccounts("AccountTypes")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}
	input := "InvalidInput"
	query := regexp.QuoteMeta("SELECT * FROM accounttypes WHERE accounttypename = $1")
	mock.ExpectQuery(query).WithArgs("InvalidInput").WillReturnRows(sqlmock.NewRows(nil))

	if _, exists, err := GetAccountTypeDetails(repo.db, input); !exists || err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if exists {
			t.Fatalf("Unexpected error that accountType does exists for an invalid input.")
		}
	}
}

func TestGetAccountExists_True(t *testing.T) {
	mock, repo, rows, err := setupAccounts("Accounts")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT * FROM "accounts" WHERE (nusnetid = $1)`)
	mock.ExpectQuery(query).WithArgs("e001").WillReturnRows(rows)

	input := models.CreateAccountInput{
		Nusnetid:   "e001",
		Password:   "test",
		Name:       "test",
		Facultyid:  0,
		Gradyear:   0,
		Profilepic: &multipart.FileHeader{},
	}
	if !GetAccountExists(repo.db, input) {
		t.Fatalf("Expected to get that account exists is true, but got false.")
	}
}

func TestGetAccountExists_False(t *testing.T) {
	mock, repo, _, err := setupAccounts("Accounts")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT * FROM "accounts" WHERE (nusnetid = $1)`)
	mock.ExpectQuery(query).WithArgs("e002").WillReturnRows(sqlmock.NewRows(nil))

	input := models.CreateAccountInput{
		Nusnetid:   "e002",
		Password:   "test",
		Name:       "test",
		Facultyid:  0,
		Gradyear:   0,
		Profilepic: &multipart.FileHeader{},
	}
	if GetAccountExists(repo.db, input) {
		t.Fatalf("Expected to get that account exists is false, but got true.")
	}
}

func TestGetAccountStatus_ValidInput(t *testing.T) {
	mock, repo, rows, err := setupAccounts("AccountStatuses")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}
	input := "online"
	query := regexp.QuoteMeta("SELECT * FROM accountstatuses WHERE accountstatusname = $1")
	mock.ExpectQuery(query).WithArgs("Online").WillReturnRows(rows)

	expected := models.Accountstatuses{
		ID:                       1,
		Accountstatusname:        input,
		Accountstatusdescription: "Currently logged in.",
	}
	if accountStatus, exists, err := GetAccountStatus(repo.db, "Online"); err != nil || !exists || accountStatus.ID != expected.ID {
		fmt.Println(accountStatus)
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !exists && err == nil {
			t.Fatalf("Unexpected error that accountStatus does not exist for a valid input.")
		}
		if accountStatus.ID != expected.ID {
			t.Fatalf("Expected to get that accountStatus is %d, but got %d.", expected.ID, accountStatus.ID)
		}
	}
}

func TestGetAccountStatus_InvalidInput(t *testing.T) {
	mock, repo, _, err := setupAccounts("AccountStatuses")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta("SELECT * FROM accountstatuses WHERE accountstatusname = $1")
	mock.ExpectQuery(query).WithArgs("InvalidInput").WillReturnRows(sqlmock.NewRows(nil))

	if _, exists, err := GetAccountStatus(repo.db, "InvalidInput"); err == nil || exists {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if exists {
			t.Fatalf("Unexpected error that accountStatus does exist for an invalid input.")
		}
	}
}

func TestGetAccountStatus_Error(t *testing.T) {
	mock, repo, _, err := setupAccounts("AccountStatuses")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta("SELECT * FROM accountstatuses WHERE accountstatusname = $1")
	mock.ExpectQuery(query).WithArgs().WillReturnRows(sqlmock.NewRows(nil))

	if _, exists, err := GetAccountStatus(repo.db, "InvalidInput"); err == nil || exists {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if exists {
			t.Fatalf("Unexpected error that accountStatus does exist for an invalid input.")
		}
	}
}

func TestCreateAccount_ValidInput(t *testing.T) {
	mock, repo, _, err := setupAccounts("Accounts")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	//inputArgs := []interface{}{"1", "e001", "pass", "test", "1", "2022", "testURL", "1", "50", AnyTime{}, AnyTime{}, "1"}
	query := regexp.QuoteMeta(`INSERT INTO "accounts" ("id","nusnetid","passwordhash","name","facultyid","gradyear","profilepic","accounttypeid","points","createdat","lastupdated","accountstatusid") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING "accounts"."id"`)
	mock.ExpectBegin()
	mock.ExpectQuery(query).
		WithArgs(1, "e001", "pass", "test", 1, 2022, uuid.Nil.String(), 1,
			50.0, AnyTime{}, AnyTime{}, 1).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow("1"))
	mock.ExpectCommit()

	input := models.Accounts{
		ID:              1,
		Nusnetid:        "e001",
		Passwordhash:    "pass",
		Name:            "test",
		Facultyid:       1,
		Gradyear:        2022,
		Profilepic:      uuid.UUID{},
		Accounttypeid:   1,
		Points:          50.0,
		Createdat:       time.Time{},
		Lastupdated:     time.Time{},
		Accountstatusid: 1,
	}

	if err := CreateAccount(repo.db, input); err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
	}
}

func TestGetFacultyList_Exists(t *testing.T) {
	mock, repo, rows, err := setupAccounts("Faculties")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta("SELECT * FROM faculties")
	mock.ExpectQuery(query).WillReturnRows(rows)

	expected := []models.Faculties{
		{ID: 1,
			Facultyname:        "SoC",
			Facultydescription: "School of Computing",
		},
		{ID: 2,
			Facultyname:        "FASS",
			Facultydescription: "Faculty of Arts and Social Sciences",
		},
		{ID: 3,
			Facultyname:        "Others",
			Facultydescription: "Others",
		},
	}
	if faculties, exists, err := GetFacultyList(repo.db); err != nil || !exists || len(faculties) != len(expected) {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !exists && err == nil {
			t.Fatalf("Unexpected error that faculties do not exist for a valid input.")
		}
		if len(faculties) != len(expected) {
			t.Fatalf("Expected to get that number of faculties are %d, but got %d.", len(expected), len(faculties))
		}
	}
}

func TestGetFacultyList_EmptyList(t *testing.T) {
	mock, repo, _, err := setupAccounts("")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta("SELECT * FROM faculties")
	mock.ExpectQuery(query).WillReturnError(gorm.ErrRecordNotFound)

	if _, exists, err := GetFacultyList(repo.db); err != nil || exists {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if exists {
			t.Fatalf("Unexpected error that faculties exists for a database with no faculties.")
		}
	}
}

func TestGetAccount_True(t *testing.T) {
	mock, repo, rows, err := setupAccounts("Accounts")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT * FROM "accounts" WHERE (nusnetid = $1)`)
	mock.ExpectQuery(query).WithArgs("e001").WillReturnRows(rows)

	input := models.User{
		Nusnetid: "e001",
		Password: "test",
	}

	expected := models.Accounts{
		ID:              1,
		Nusnetid:        "e001",
		Passwordhash:    "pass",
		Name:            "test",
		Facultyid:       1,
		Gradyear:        2022,
		Profilepic:      uuid.UUID{},
		Accounttypeid:   1,
		Points:          50,
		Createdat:       time.Time{},
		Lastupdated:     time.Time{},
		Accountstatusid: 1,
	}
	if account, exists, err := GetAccount(repo.db, input); err != nil || !exists || account.ID != expected.ID {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !exists && err == nil {
			t.Fatalf("Unexpected error that account does not exist for a valid input.")
		}
		if account.ID != expected.ID {
			t.Fatalf("Expected to get that accountID is %d, but got %d.", expected.ID, account.ID)
		}
	}
}

func TestGetAccount_False(t *testing.T) {
	mock, repo, _, err := setupAccounts("Accounts")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT * FROM "accounts" WHERE (nusnetid = $1)`)
	mock.ExpectQuery(query).WithArgs("e002").WillReturnRows(sqlmock.NewRows(nil))

	input := models.User{
		Nusnetid: "e002",
		Password: "test",
	}

	if _, exists, err := GetAccount(repo.db, input); err != nil || exists {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if exists {
			t.Fatalf("Unexpected error that account does exist for an invalid input.")
		}
	}
}

func TestUpdateAccountStatus(t *testing.T) {
	mock, repo, _, err := setupAccounts("Accounts")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`UPDATE accounts SET accountstatusid = $1, lastupdated = $2 WHERE nusnetid = $3`)
	mock.ExpectExec(query).
		WithArgs(2, AnyTime{}, "e001").
		WillReturnResult(sqlmock.NewResult(1, 1))

	inputUser := models.User{
		Nusnetid: "e001",
		Password: "test",
	}

	inputStatus := models.Accountstatuses{
		ID:                       2,
		Accountstatusname:        "Offline",
		Accountstatusdescription: "Currently logged out.",
	}

	if err := UpdateAccountStatus(repo.db, inputStatus, inputUser); err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
	}
}

func TestUpdateAccountPassword(t *testing.T) {
	mock, repo, _, err := setupAccounts("Accounts")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`UPDATE accounts SET passwordHash = $1 WHERE id = $2`)
	mock.ExpectExec(query).WithArgs("test", 1).WillReturnResult(sqlmock.NewResult(1, 1))

	input := models.CreateAccountInput{
		Nusnetid:   "e001",
		Password:   "test",
		Name:       "test",
		Facultyid:  1,
		Gradyear:   2022,
		Profilepic: &multipart.FileHeader{},
	}

	expected := models.Accounts{
		ID:              1,
		Nusnetid:        "e001",
		Passwordhash:    "pass",
		Name:            "test",
		Facultyid:       1,
		Gradyear:        2022,
		Profilepic:      uuid.UUID{},
		Accounttypeid:   1,
		Points:          50,
		Createdat:       time.Time{},
		Lastupdated:     time.Time{},
		Accountstatusid: 1,
	}

	if err := UpdateAccountPassword(repo.db, expected, input); err != nil {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
	}
}

func TestRetrieveUserBookings_Exists(t *testing.T) {
	mock, repo, rows, err := setupAccounts("CurrentBookings")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT venuename, buildingname, buildings.id AS buildingid, unit, eventstart, pax, 
		currentbookings.id as bookingid, bookingstatusdescription
		FROM currentbookings
		JOIN venues ON venues.id = currentbookings.venueid
		JOIN buildings ON buildings.id = venues.buildingid
		JOIN bookingstatuses ON bookingstatuses.id = currentbookings.bookingstatusid
		WHERE nusnetid = $1 ORDER BY bookingstatusid ASC`)
	mock.ExpectQuery(query).WithArgs("e001").WillReturnRows(rows)

	expected := []models.Currentbookings{
		{
			Nusnetid:        "e001",
			Venueid:         1,
			Pax:             10,
			Createdat:       time.Time{},
			Eventstart:      time.Time{},
			Eventend:        time.Time{},
			Bookingstatusid: 1,
			Lastupdated:     time.Time{},
		},
		{Nusnetid: "e001",
			Venueid:         1,
			Pax:             10,
			Createdat:       time.Time{},
			Eventstart:      time.Time{},
			Eventend:        time.Time{},
			Bookingstatusid: 1,
			Lastupdated:     time.Time{},
		},
		{Nusnetid: "e001",
			Venueid:         1,
			Pax:             10,
			Createdat:       time.Time{},
			Eventstart:      time.Time{},
			Eventend:        time.Time{},
			Bookingstatusid: 1,
			Lastupdated:     time.Time{},
		},
	}

	input := models.User{
		Nusnetid: "e001",
		Password: "test",
	}

	if booking, exists, err := RetrieveUserBookings(repo.db, input); err != nil || !exists || len(booking) != len(expected) {
		fmt.Println(booking)
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if !exists && err == nil {
			t.Fatalf("Unexpected error that bookings do not exist for a valid input.")
		}
		if len(booking) != len(expected) {
			t.Fatalf("Expected to get that number of bookings are %d, but got %d.", len(expected), len(booking))
		}
	}
}

func TestRetrieveUserBookings_EmptyList(t *testing.T) {
	mock, repo, _, err := setupAccounts("CurrentBookings")
	if err != nil {
		t.Errorf("unexpected error: %s", err.Error())
	}

	query := regexp.QuoteMeta(`SELECT venuename, buildingname, buildings.id AS buildingid, unit, eventstart, pax, 
		currentbookings.id as bookingid, bookingstatusdescription
		FROM currentbookings
		JOIN venues ON venues.id = currentbookings.venueid
		JOIN buildings ON buildings.id = venues.buildingid
		JOIN bookingstatuses ON bookingstatuses.id = currentbookings.bookingstatusid
		WHERE nusnetid = $1 ORDER BY bookingstatusid ASC`)
	mock.ExpectQuery(query).WithArgs("e002").WillReturnError(gorm.ErrRecordNotFound)

	input := models.User{
		Nusnetid: "e002",
		Password: "test",
	}

	if _, exists, err := RetrieveUserBookings(repo.db, input); err != nil || exists {
		if err != nil {
			t.Fatalf("Unexpected error: %s", err.Error())
		}
		if exists && err == nil {
			t.Fatalf("Unexpected error that bookings exist for an invalid input.")
		}

	}
}

func init() {
	// to generate random number everytime
	rand.Seed(time.Now().UTC().UnixNano())
}

func TestRegister_ValidNewAcc(t *testing.T) {
	// using e9xxxxx to prevent testing with an actual id as current nusnet id starts with e0
	toUseID := "e9" + strconv.Itoa(rand.Intn(1000000))
	testCorrectInput := models.CreateAccountInput{
		Nusnetid:   toUseID, // must be brand new un-used nusnetid
		Password:   "11",
		Name:       "TestStudent",
		Facultyid:  1,
		Gradyear:   2022,
		Profilepic: &multipart.FileHeader{},
	}
	toSendCorrect, err := json.Marshal(testCorrectInput)
	if err != nil {
		t.Fatalf("Unexpected error: %s", err.Error())
		return
	}
	URL := config.HEROKU_HOST + "/sign-up"
	responseCorrect, err := http.Post(URL, "application/json", bytes.NewBuffer(toSendCorrect))
	if err != nil {
		t.Fatal(err)
	}
	if responseCorrect.StatusCode != 200 {
		t.Fatalf("expected response status code 200, got %d", responseCorrect.StatusCode)
	}

	//var receive struct {
	//	Success bool   `json:"success"`
	//	Message string `json:"message"`
	//}
	//if err := json.NewDecoder(responseCorrect.Body).Decode(&receive); err != nil {
	//	t.Fatalf("Unexpected error: %s", err.Error())
	//}
	//expectedSuccess := true
	//expectedMessage := "Account successfully created!"
	//if receive.Success != expectedSuccess && receive.Message != expectedMessage {
	//	t.Errorf("Expected Success to be %v, got %v\n"+
	//		"Expected message to be '%v' but got %s\n",
	//		expectedSuccess, receive.Success, expectedMessage, receive.Message)
	//}
}

func TestRegister_InvalidUsedAcc(t *testing.T) {
	toUseID := "e0123456" // test an already used input
	testExistingInput := models.CreateAccountInput{
		Nusnetid:   toUseID,
		Password:   "Ab@123",
		Name:       "test",
		Facultyid:  1,
		Gradyear:   2022,
		Profilepic: &multipart.FileHeader{},
	}
	toSendExisting, err := json.Marshal(testExistingInput)
	if err != nil {
		t.Fatalf("Unexpected error: %s", err.Error())
		return
	}
	response, err := http.Post(config.HEROKU_HOST+"/sign-up", "application/json", bytes.NewBuffer(toSendExisting))
	if err != nil {
		t.Fatalf("Unexpected error: %s", err.Error())
	}
	if response.StatusCode != 200 {
		t.Fatalf("expected response status code 200, got %d", response.StatusCode)
	}

	//var receive struct {
	//	Success bool   `json:"success"`
	//	Message string `json:"message"`
	//}
	//
	//fmt.Println(response.Body)
	//if err := json.NewDecoder(response.Body).Decode(&receive); err != nil {
	//	t.Fatalf("Unexpected error: %s", err.Error())
	//}
	//
	//expectedSuccess := false
	//expectedMessage := "Account already exists!"
	//if receive.Success != expectedSuccess && receive.Message != expectedMessage {
	//	t.Errorf("Expected Success to be %v, got %v\n"+
	//		"Expected message to be '%v' but got %s\n",
	//		expectedSuccess, receive.Success, expectedMessage, receive.Message)
	//}
}

func TestGetFaculties(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	router.GET("/get_faculty", GetFaculties)

	type Temp struct {
		Data []models.Faculties `json:"data"`
	}
	response := Temp{}
	err = unitTest.TestHandlerUnMarshalResp("GET", "/get_faculty", "form", nil, &response)
	if err != nil {
		t.Errorf("Error encountered receiving response: %s", err)
		return
	}
}

func TestLogin(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	router.POST("/login", Login)

	input := models.User{
		Nusnetid: "e0123456",
		Password: "Ab@123",
	}
	param := make(map[string]interface{})
	param["NUSNET_ID"] = input.Nusnetid
	param["password"] = input.Password

	type Special struct {
		Success bool               `json:"success"`
		Message models.LoginOutput `json:"message"`
	}
	var response Special

	err = unitTest.TestHandlerUnMarshalResp("POST", "/login", "json", input, &response)
	if err != nil {
		t.Errorf("Unexpected error testing Login API: %s", err)
	}
	if response.Message.Accounttypename != "Student" {
		t.Errorf("Expected to get type Student but got %s instead.", response.Message.Accounttypename)
	}
}

func TestPointsUpdate(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	router.POST("/points_update", PointsUpdate)

	var response StandardSuccess
	expected := "No points refilled as week has not past."
	input := models.User{Nusnetid: "e0123456"}
	err = unitTest.TestHandlerUnMarshalResp("POST", "/points_update", "json", input, &response)
	if err != nil {
		t.Errorf("Unexpected error testing PointsUpdate API: %s", err)
	}
	if response.Message != expected {
		t.Errorf("Expected this message:\n%s but got this instead:\n%s", expected, response.Message)
	}
}

func TestResetPassword(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	router.PATCH("/reset_password", ResetPassword)

	input := models.PasswordReset{
		Nusnetid:    "e0123456",
		OldPassword: "Ab@123",
		NewPassword: "aB@123",
	}
	var response StandardSuccess
	expected := "Password successfully reset!"
	err = unitTest.TestHandlerUnMarshalResp("PATCH", "/reset_password", "json", input, &response)
	if err != nil {
		t.Errorf("Unexpected error testing ResetPassword API: %s", err)
	}
	if response.Message != expected {
		t.Errorf("Expected this message:\n%s but got this instead:\n%s", expected, response.Message)
	}
}

func TestTriggerPasswordReset(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	router.POST("/trigger_password_reset", TriggerPasswordReset)

	input := models.User{Nusnetid: "e0123456"}
	var response StandardSuccess
	err = unitTest.TestHandlerUnMarshalResp("POST", "/trigger_password_reset", "json", input, &response)
	if err != nil {
		t.Errorf("Unexpected error testing TriggerPasswordReset API: %s", err)
	}
}

func TestGetProfile(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	router.GET("/get_profile", GetProfile)

	input := models.User{
		Nusnetid: "e0123456",
	}
	var response StandardSuccess
	err = unitTest.TestHandlerUnMarshalResp("GET", "/get_profile", "json", input, &response)
	if err != nil {
		t.Errorf("Unexpected error testing GetProfile API: %s", err)
	}
}

func TestTransferPoints(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Errorf("Unexpected error: %s", err)
	}
	router.POST("/transfer_points", TransferPoints)

	input := models.PointsTarget{
		User:   "e0123456",
		Target: "e1234567",
		Points: 5.0,
	}
	var response StandardSuccess
	expected := fmt.Sprintf("Successfully transferred %.1f points to account with NUSNET ID %s!",
		input.Points, input.Target)
	err = unitTest.TestHandlerUnMarshalResp("POST", "/transfer_points", "json", input, &response)
	if err != nil {
		t.Errorf("Unexpected error testing TransferPoints API: %s", err)
	}
	if response.Message != expected {
		t.Errorf("Expected this message:\n%s but got this instead:\n%s", expected, response.Message)
	}
}

func TestEditProfile(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	router.POST("/edit_profile", EditProfile)

	input := models.EditProfile{
		Nusnetid:   "e0123456",
		Name:       "TEST",
		Facultyid:  1,
		Gradyear:   2099,
		Profilepic: nil,
	}
	var response StandardSuccess
	expected := "Profile successfully updated!"
	err = unitTest.TestHandlerUnMarshalResp("POST", "/edit_profile", "json", input, &response)
	if err != nil {
		t.Errorf("Unexpected error testing EditProfile API: %s", err)
	}
	if response.Message != expected {
		t.Errorf("Expected this message:\n%s but got this instead:\n%s", expected, response.Message)
	}
}

func TestRegister(t *testing.T) {
	router, err := APISetupForTest()
	router.POST("/register", Register)

	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	toUseID := "e9" + strconv.Itoa(rand.Intn(1000000))
	account := models.CreateAccountInput{
		Nusnetid:   toUseID,
		Password:   "Test@123",
		Name:       "Test",
		Facultyid:  1,
		Gradyear:   2099,
		Profilepic: nil,
	}
	var response StandardError
	err = unitTest.TestHandlerUnMarshalResp("POST", "/register", "json", account, &response)
}

func TestCreateStaff(t *testing.T) {
	router, err := APISetupForTest()
	if err != nil {
		t.Fatalf("Unexpected error: %s", err)
	}
	router.POST("/create_staff", CreateStaff)

	toUseID := "e9" + strconv.Itoa(rand.Intn(1000000))
	input := models.CreateStaffAccountInput{
		NUSNET_ID: toUseID,
		Name:      "TESTSTAFF",
	}
	var response StandardSuccess
	err = unitTest.TestHandlerUnMarshalResp("POST", "/create_staff", "json", input, &response)
	if err != nil {
		t.Errorf("Unexpected error testing CreateStaff API: %s", err)
	}
}

package services

import (
	"fmt"
	"github.com/jinzhu/gorm"
	"log"
	"net/http"
	"server/models"
	"server/utils"
	"time"

	"github.com/gin-gonic/gin"
)

// POST /register
// register account
func Register(c *gin.Context) {
	// Validate input
	var input models.CreateAccountInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input fields."})
		fmt.Println("Error in parsing inputs for account creation.")
		return
	}

	// check if account already exists
	if GetAccountExists(DB, input) {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account already exists!"})
		fmt.Println("Account already exists.")
	}

	// hashing the password
	user := models.User{
		Nusnetid: input.Nusnetid,
		Password: input.Password,
	}
	err := utils.HashPassword(&user)
	if err != nil {
		fmt.Println("Error in hashing user password. " + err.Error())
	}
	input.Password = user.Password

	// get accountTypeID
	accountType, err := GetAccountTypeDetails(DB, "Student")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to determine account type"})
		fmt.Println("Unable to get accountTypeID. " + err.Error() + "\n")
	}

	// get accountStatusID
	accountStatus, err := GetAccountStatus(DB, "Offline")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to determine account status"})
		fmt.Println("Unable to get accountStatusID. " + err.Error() + "\n")
	}

	account := models.Accounts{
		Nusnetid:        input.Nusnetid,
		Passwordhash:    input.Password,
		Name:            input.Name,
		Facultyid:       input.Facultyid,
		Gradyear:        input.Facultyid,
		Profilepic:      input.Profilepic,
		Accounttypeid:   accountType.ID,
		Points:          50,
		Createdat:       time.Now(),
		Lastupdated:     time.Now(),
		Accountstatusid: accountStatus.ID,
	}

	if err := CreateAccount(DB, account); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Unable to create account"})
		fmt.Println("Unable to crete account. " + err.Error() + "\n")
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Account successfully created!"})
	log.Println("Account successfully created!")
}

// GET /get_faculty
// get a list of faculties to populate registration field
func GetFaculty(c *gin.Context) {
	facultyList, err := GetFacultyList(DB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to get list of faculties."})
		fmt.Println("Error getting list of faculties. " + err.Error() + "\n")
	}

	c.JSON(http.StatusOK, gin.H{"data": facultyList})
	fmt.Println("Return successful!")
}

// POST /login
func Login(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil { // MUST USE SHOULDBINDJSON instead of Bind!!
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Have you input correctly? " + err.Error()})
		fmt.Println("Error parsing reset inputs. " + err.Error() + "\n")
		return
	}

	retrieved, err := GetAccount(DB, input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid NUSNET ID!"})
		fmt.Println("Invalid NUSNET ID input. " + err.Error() + "\n")
	}

	match := utils.CheckPasswordHash(input, retrieved.Passwordhash) // non hashed input first, followed by hashed one retrieved from DB
	if !match {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid password!"})
		fmt.Println("Invalid password.")
		return
	}

	// get online status code
	statusCode, err := GetAccountStatus(DB, "Online")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrieve online status code. "})
		fmt.Println("Unable to retrieve online status code. " + err.Error() + "\n")
		return
	}

	// change account status
	if err := UpdateAccountStatus(DB, statusCode, input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to update account logged in status. " + err.Error() + "\n"})
		fmt.Println("Unable to update account logged in status. " + err.Error() + "\n")
	}

	user := models.LoginOutput{
		Nusnetid: input.Nusnetid,
		Name:     retrieved.Name,
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": user})
	fmt.Println("Log in successful!")
}

// PATCH /reset
// Reset password
func ResetPassword(c *gin.Context) {
	var input models.CreateAccountInput
	// Validate input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Have you input correctly? " + err.Error()})
		fmt.Println("Error parsing reset inputs. " + err.Error())
		return
	}

	// check if account already exists
	if !GetAccountExists(DB, input) {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist!"})
		fmt.Println("Unable to find account.")
		return
	}

	// get account
	user := models.User{
		Nusnetid: input.Nusnetid,
		Password: input.Password,
	}
	retrieved, err := GetAccount(DB, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to get account!" + err.Error()})
		fmt.Println("Unable to get account." + err.Error())
		return
	}

	// check if new password is same as the old password
	match := utils.CheckPasswordHash(user, retrieved.Passwordhash) // non hashed input first, followed by hashed one retrieved from DB
	if match {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "New password cannot be the same as old password!"})
		fmt.Println("Old password reused.")
		return
	}

	// hashing the password
	if err := utils.HashPassword(&user); err != nil {
		fmt.Println("Error in hashing user password: " + err.Error())
	}
	input.Password = user.Password

	// update password
	if err := UpdateAccountPassword(DB, retrieved, input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to reset password."})
		fmt.Println("Error in updating database. " + err.Error() + "\n")
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Account successfully reset!"})
	log.Println("Password successfully reset!")
}

// GET /get_profile
// Find a particular account and its details
func GetProfile(c *gin.Context) {
	var user models.User
	if err := c.BindQuery(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input NUSNET_ID"})
		fmt.Println("Error in reading input NUSNET_ID. " + err.Error() + "\n")
		return
	}

	// get account from user input
	account, err := GetAccount(DB, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check database query"})
		fmt.Println("Error in retrieving profile details from Database. " + err.Error() + "\n")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": account})
	fmt.Println("Successfully retrieved profile details.")
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

	booking, err := RetrieveUserBookings(DB, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check database query"})
		fmt.Println("Error in retrieving booking details from Database. " + err.Error() + "\n")
	}

	c.JSON(http.StatusOK, gin.H{"data": booking})
	fmt.Println("Successfully retrieved booking details.")
}


func GetAccountTypeDetails(DB *gorm.DB, theType string) (models.Accounttypes, error) {
	var accountType models.Accounttypes
	query := "SELECT * FROM accounttypes WHERE accounttypename = ?"
	if err := DB.Raw(query, theType).Scan(&accountType).Error; err != nil {
		return models.Accounttypes{}, err
	}
	return accountType, nil
}

func GetAccountExists(DB *gorm.DB, input models.CreateAccountInput) bool {
	var retrieved models.Accounts
	return DB.Where("nusnetid = ?", input.Nusnetid).First(&retrieved).RowsAffected != 0
}

// get accountStatusID
func GetAccountStatus(DB *gorm.DB, statusName string) (models.Accountstatuses, error) {
	var accountStatus models.Accountstatuses
	if err := DB.Where("accountstatusname = ?", statusName).First(&accountStatus).Error; err != nil {
		return models.Accountstatuses{}, err
	}
	return accountStatus, nil
}

// create account
func CreateAccount(DB *gorm.DB, account models.Accounts) error {
	if err := DB.Create(&account).Error; err != nil {
		return err
	}
	return nil
}

func GetFacultyList(DB *gorm.DB) ([]models.Faculties, error) {
	var facultyList []models.Faculties
	if err := DB.Find(&facultyList).Error; err != nil {
		return nil, err
	}
	return facultyList, nil
}

func GetAccount(DB *gorm.DB, input models.User) (models.Accounts, error) {
	var retrieved models.Accounts
	row := DB.Where("nusnetid = ?", input.Nusnetid).First(&retrieved)
	if row.Error != nil {
		return models.Accounts{}, row.Error
	}
	return retrieved, nil
}

func UpdateAccountStatus(DB *gorm.DB, statusCode models.Accountstatuses, input models.User) error {
	updateQuery := "UPDATE accounts SET accountstatusid = ?, lastupdated = ? WHERE nusnetid = ?"
	if err := DB.Exec(updateQuery, statusCode.ID, time.Now(), input.Nusnetid).Error; err != nil {
		return err
	}
	return nil
}

func UpdateAccountPassword(DB *gorm.DB, retrieved models.Accounts, input models.CreateAccountInput) error {
	if err := DB.Model(&retrieved).UpdateColumn("password", input.Password).Error; err != nil {
		return err
	}
	return nil
}

func RetrieveUserBookings(DB *gorm.DB, user models.User) ([]models.Currentbookings, error) {
	var booking []models.Currentbookings
	if err := DB.Find(&booking).Where("nusnetid = ?", user.Nusnetid).Scan(&booking).Error; err != nil {
		return nil, err
	}
	return booking, nil
}

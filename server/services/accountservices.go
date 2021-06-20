package services

import (
	"fmt"
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
	var retrieved models.Accounts
	if DB.Where("nusnetid = ?", input.Nusnetid).First(&retrieved).RowsAffected != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account already exists!"})
		fmt.Println("Account already exists.")
		return
	}

	// hashing the password
	input.Password = utils.CreateHashedPassword(input.Password)

	// get accountTypeID
	var accountType models.Accounttypes
	if err := DB.Where("accounttypename = ?", "Student").First(&accountType).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to determine account type"})
		fmt.Println("Unable to get accountTypeID. " + err.Error() + "\n")
		return
	}

	// get accountStatusID
	var accountStatus models.Accountstatuses
	if err := DB.Where("accountstatusname = ?", "Active").First(&accountStatus).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to determine account status"})
		fmt.Println("Unable to get accountStatusID. " + err.Error() + "\n")
		return
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
	if err := DB.Create(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Unable to create account"})
		fmt.Println("Unable to crete account. " + err.Error() + "\n")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Account successfully created!"})
	log.Println("Account successfully created!")
}

// GET /get_faculty
// get a list of faculties to populate registration field
func GetFaculty(c *gin.Context) {
	var facultyList []models.Faculties
	if err := DB.Find(&facultyList).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to get list of faculties."})
		fmt.Println("Error getting list of faculties. " + err.Error() + "\n")
		return
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

	var retrieved models.Accounts
	row := DB.Where("nusnetid = ?", input.Nusnetid).First(&retrieved)
	if row.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid NUSNET ID!"})
		fmt.Println("Invalid NUSNET ID input. " + row.Error.Error() + "\n")
		return
	}

	match := utils.CheckPasswordHash(input.Password, retrieved.Passwordhash) // non hashed input first, followed by hashed one retrieved from DB

	if !match {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid password!"})
		fmt.Println("Invalid password.")
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"success": true})
		fmt.Println("Log in successful!")
	}
}

// PATCH /reset
// Reset password
func ResetPassword(c *gin.Context) {
	var input models.CreateAccountInput
	// Validate input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Have you input correctly? " + err.Error()})
		fmt.Println("Error parsing reset inputs. " + err.Error() + "\n")
		return
	}

	// check if account already exists
	var retrieved models.Accounts
	if DB.Where("nusnetid = ?", input.Nusnetid).First(&retrieved).RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist!"})
		fmt.Println("Unable to find account.")
		return
	}

	// check if new password is same as the old password
	match := utils.CheckPasswordHash(input.Password, retrieved.Passwordhash) // non hashed input first, followed by hashed one retrieved from DB
	if match {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "New password cannot be the same as old password!"})
		fmt.Println("Old password reused.")
		return
	}

	// hashing the password
	input.Password = utils.CreateHashedPassword(input.Password)

	if err := DB.Model(&retrieved).UpdateColumn("password", input.Password).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to reset password."})
		fmt.Println("Error in updating database. " + err.Error() + "\n")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
	log.Println("Password successfully reset!")
}

// GET /accounts
// get accounts, only shows the ID
func GetAccounts(c *gin.Context) {
	var accounts []models.Accounts
	if err := DB.Select("id", "nusnetid").Find(&accounts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": accounts})
	fmt.Println("Return successful!")
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

	var account models.Accounts
	if err := DB.Find(&account).Where("nusnetid = ?", user.Nusnetid).Scan(&account).Error; err != nil {
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

	var booking []models.Currentbookings
	if err := DB.Find(&booking).Where("nusnetid = ?", user.Nusnetid).Scan(&booking).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check database query"})
		fmt.Println("Error in retrieving booking details from Database. " + err.Error() + "\n")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": booking})
	fmt.Println("Successfully retrieved booking details.")
}

// DELETE /accounts/:id
// Delete an account
func DeleteAccount(c *gin.Context) {
	// Get model if exist
	var account models.Accounts
	if err := DB.Where("nusnetid = ?", c.Param("nusnetid")).First(&account).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	if err := DB.Delete(&account).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": true})
	log.Println("Account successfully deleted!")
}

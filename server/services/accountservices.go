package services

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/OrbitalbooKING/booKING/server/config"
	"github.com/OrbitalbooKING/booKING/server/models"
	"github.com/OrbitalbooKING/booKING/server/utils"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
	"github.com/sethvargo/go-password/password"

	"github.com/jinzhu/gorm"

	"github.com/gin-gonic/gin"
)

// POST /register
// register account
func Register(c *gin.Context) {
	// Validate input
	var input models.CreateAccountInput
	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "All input fields required."})
		fmt.Println("Error in parsing inputs for account creation.")
		return
	}

	// converts id to lowercase
	input.Nusnetid = strings.ToLower(input.Nusnetid)

	// check valid nusnetid and password strength
	if !regexIDCheck(c, input.Nusnetid) || !regexPasswordCheck(c, input.Password) {
		return
	}

	// check if name is blank space
	if input.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Input name cannot be blank!"})
		fmt.Println("Input name cannot be blank!")
		return
	}

	// check if account already exists
	if GetAccountExists(DB, input) {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account already exists!"})
		fmt.Println("Account already exists.")
		return
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
	accountType, exists, err := GetAccountTypeDetails(DB, "Student")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Unable to determine account type"})
		fmt.Println("Unable to get accountTypeID. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Trying to set account to invalid type"})
		fmt.Println("accountType does not exist. " + err.Error() + "\n")
	}

	// get accountStatusID
	accountStatus, exists, err := GetAccountStatus(DB, "Offline")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Unable to determine account status"})
		fmt.Println("Unable to get accountStatusID. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Trying to set account to invalid status"})
		fmt.Println("accountStatus does not exist. " + err.Error() + "\n")
	}

	// create S3 session for profile pic upload
	s, err := CreateS3Session()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to create AWS session for profile pic upload"})
		fmt.Println("Unable to create AWS session for profile pic upload " + err.Error())
	}

	var picID uuid.UUID
	if input.Profilepic != nil {
		file, err := input.Profilepic.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to parse profile pic upload"})
			fmt.Println("Unable to parse profile pic upload " + err.Error())
		}

		picID, err = UploadFileToS3(s, file, input.Profilepic)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Unable to upload profile pic to S3"})
			fmt.Println("Unable to upload profile pic to S3. " + err.Error() + "\n")
		} else {
			fmt.Println("Image uploaded successfully!")
		}
	}

	account := models.Accounts{
		Nusnetid:        input.Nusnetid,
		Passwordhash:    input.Password,
		Name:            input.Name,
		Facultyid:       input.Facultyid,
		Gradyear:        input.Gradyear,
		Profilepic:      picID,
		Accounttypeid:   accountType.ID,
		Points:          50,
		Createdat:       time.Now(),
		Lastupdated:     time.Now(),
		Accountstatusid: accountStatus.ID,
	}

	if err := CreateAccount(DB, account); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Unable to create account"})
		fmt.Println("Unable to create account. " + err.Error() + "\n")
	} else {
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Account successfully created!"})
		fmt.Println("Account successfully created!")
	}
}

// GET /get_faculty
// get a list of faculties to populate registration field
func GetFaculties(c *gin.Context) {
	facultyList, exists, err := GetFacultyList(DB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to get list of faculties."})
		fmt.Println("Error getting list of faculties. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "System has nothing in list of faculties"})
		fmt.Println("List of faculties is empty. " + err.Error() + "\n")
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

	// converts id to lowercase
	input.Nusnetid = strings.ToLower(input.Nusnetid)
	retrieved, exists, err := GetAccount(DB, input)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Invalid NUSNET ID!"})
		fmt.Println("Invalid NUSNET ID input. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist"})
		fmt.Println("account does not exist. " + err.Error() + "\n")
	}

	match := utils.CheckPasswordHash(input, retrieved.Passwordhash) // non hashed input first, followed by hashed one retrieved from DB
	if !match {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid password!"})
		fmt.Println("Invalid password.")
		return
	}

	// get online status code
	statusCode, exists, err := GetAccountStatus(DB, "Online")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve online status code. "})
		fmt.Println("Unable to retrieve online status code. " + err.Error() + "\n")
		return
	}
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Trying to set account to invalid status"})
		fmt.Println("accountStatus does not exist. " + err.Error() + "\n")
	}

	// change account status
	if err := UpdateAccountStatus(DB, statusCode, input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to update account logged in status. " + err.Error() + "\n"})
		fmt.Println("Unable to update account logged in status. " + err.Error() + "\n")
	}

	accountType, exists, err := GetAccountType(DB, retrieved.Accounttypeid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve account type. "})
		fmt.Println("Unable to retrieve account type. " + err.Error() + "\n")
		return
	}
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Account type does not exist."})
		fmt.Println("Account type does not exist. " + err.Error() + "\n")
	} else {
		user := models.LoginOutput{
			Nusnetid:        input.Nusnetid,
			Name:            retrieved.Name,
			Accounttypename: accountType.Accounttypename,
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": user})
		fmt.Println("Log in successful!")
	}
}

// POST /points_update
// resets the points for the user for the week
func PointsUpdate(c *gin.Context) {
	var input models.User
	// Validate input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Have you input correctly? " + err.Error()})
		fmt.Println("Error parsing reset inputs. " + err.Error())
		return
	}

	// check if account already exists
	if !GetAccountExists(DB, models.CreateAccountInput{Nusnetid: input.Nusnetid}) {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist!"})
		fmt.Println("Unable to find account.")
		return
	}

	// get account
	user := models.User{
		Nusnetid: input.Nusnetid,
	}
	retrieved, exists, err := GetAccount(DB, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to get account!" + err.Error()})
		fmt.Println("Unable to get account." + err.Error())
		return
	}
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist"})
		fmt.Println("account does not exist. " + err.Error() + "\n")
		return
	}

	added, err := RefillPoints(retrieved)
	if err != nil {
		errorMessage := fmt.Sprintf("Error refilling points for user" + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
		return
	}
	if added == 0.0 {
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "No points refilled as week has not past."})
		fmt.Println("No points refilled as week has not past.")
	} else {
		successMessage := fmt.Sprintf("Added %.1f points to user %s's account.", added, retrieved.Name)
		c.JSON(http.StatusOK, gin.H{"success": true, "message": successMessage})
		fmt.Println(successMessage)
	}
}

// PATCH /reset_password
// Reset password
func ResetPassword(c *gin.Context) {
	var input models.PasswordReset
	// Validate input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Have you input correctly? " + err.Error()})
		fmt.Println("Error parsing reset inputs. " + err.Error())
		return
	}

	if !regexPasswordCheck(c, input.NewPassword) {
		return
	}

	// get account
	user := models.User{
		Nusnetid: input.Nusnetid,
		Password: input.OldPassword,
	}
	retrieved, exists, err := GetAccount(DB, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to get account!" + err.Error()})
		fmt.Println("Unable to get account." + err.Error())
		return
	}
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist"})
		fmt.Println("account does not exist. " + err.Error() + "\n")
		return
	}

	// check if old password is same as system records
	matchOld := utils.CheckPasswordHash(models.User{Password: input.OldPassword}, retrieved.Passwordhash)
	if !matchOld {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Old password input wrongly!"})
		fmt.Println("Old password input wrongly.")
		return
	}

	// check if new password is same as the old password
	matchNew := input.OldPassword == input.NewPassword
	if matchNew {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "New password cannot be the same as old password!"})
		fmt.Println("Old password reused.")
		return
	}

	user.Password = input.NewPassword
	// hashing the password
	if err := utils.HashPassword(&user); err != nil {
		fmt.Println("Error in hashing user password: " + err.Error())
		return
	}
	input.NewPassword = user.Password

	// update password
	if err := UpdateAccountPassword(DB, retrieved, models.CreateAccountInput{Password: input.NewPassword}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to reset password."})
		fmt.Println("Error in updating database. " + err.Error() + "\n")
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Password successfully reset!"})
	log.Println("Password successfully reset!")
}

// POST /trigger_password_reset
// Resets account to a temporary password
func TriggerPasswordReset(c *gin.Context) {
	var input models.User
	// Validate input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Have you input correctly? " + err.Error()})
		fmt.Println("Error parsing reset inputs. " + err.Error())
		return
	}

	// check if account already exists
	if !GetAccountExists(DB, models.CreateAccountInput{Nusnetid: input.Nusnetid}) {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist!"})
		fmt.Println("Unable to find account.")
		return
	}

	// get account
	user := models.User{
		Nusnetid: input.Nusnetid,
	}
	retrieved, exists, err := GetAccount(DB, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Unable to get account!" + err.Error()})
		fmt.Println("Unable to get account." + err.Error())
		return
	}
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist"})
		fmt.Println("account does not exist. " + err.Error() + "\n")
		return
	}

	// generate new password
	tempPass, err := password.Generate(10, 3, 3, false, false)
	for !regexPasswordCheck(c, tempPass) {
		tempPass, err = password.Generate(10, 3, 3, false, false)
	}
	if err != nil {
		errorMessage := fmt.Sprintf("Error generating temporary password. " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
	}

	user.Password = tempPass
	// hashing the password
	if err := utils.HashPassword(&user); err != nil {
		fmt.Println("Error in hashing user password: " + err.Error())
		return
	}

	// update password
	if err := UpdateAccountPassword(DB, retrieved, models.CreateAccountInput{Password: user.Password}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to reset password."})
		fmt.Println("Error in updating database. " + err.Error() + "\n")
		return
	}

	emailInfo := models.ResetInfo{
		Name:      retrieved.Name,
		NUSNET_ID: retrieved.Nusnetid,
		TempPass:  tempPass,
	}
	if err := SendPasswordResetEmail(emailInfo); err != nil {
		errorMessage := fmt.Sprintf("Error sending reset email. " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
	} else {
		successMessage := "Temporary password has been sent to your NUSNET email!" + "\n" + "Check your junk folder if you are unable to find the email."
		c.JSON(http.StatusOK, gin.H{"success": true, "message": successMessage})
		fmt.Println(successMessage)
	}
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
	account, exists, err := GetAccountDetailed(DB, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check database query"})
		fmt.Println("Error in retrieving profile details from Database. " + err.Error() + "\n")
		return
	}
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist"})
		fmt.Println("Account does not exist.")
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": account})
	fmt.Println("Successfully retrieved profile details.")
}

// POST /transfer_points
// Transfers points to a target account
func TransferPoints(c *gin.Context) {
	const (
		ERROR_STRING = "TransferPoints"
	)
	var input models.PointsTarget
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Check input fields"})
		fmt.Sprintln("Error in getting all inputs for function %s. "+err.Error()+"\n", ERROR_STRING)
		return
	}
	// converts id to lowercase
	input.Target = strings.ToLower(input.Target)

	receiver, exists, err := GetAccount(DB, models.User{Nusnetid: input.Target})
	if !exists {
		errorMessage := fmt.Sprintf("Account %s does not exist!", input.Target)
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Sprintln(errorMessage)
		return
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Error retrieving target account."})
		fmt.Sprintln("Error retrieving target account for function %s. "+err.Error()+"\n", ERROR_STRING)
		return
	}

	if receiver.Points+input.Points > config.MAX_POINTS {
		errorMessage := fmt.Sprintf("Transfer amount of %.1f will result in Account %s to exceed points limit of %.1f!"+
			"Please input lesser points to transfer.", input.Points, input.Target, config.MAX_POINTS)
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Sprintln(errorMessage)
		return
	}

	deducted, err := DeductPoints(DB, input.User, input.Points)
	if err != nil {
		errorMessage := fmt.Sprintf("Error in deducting points from user account %s"+err.Error(), input.User)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Sprintln(errorMessage)
		return
	}

	transferred, err := AddPoints(DB, input.Target, input.Points)
	if err != nil {
		errorMessage := fmt.Sprintf("Error in transferring points to target account %s"+err.Error(), input.Target)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Sprintln(errorMessage)
		return
	}

	if deducted != transferred {
		errorMessage := fmt.Sprintf("Points (%.1f points) deducted from account %s not the same as points (%.1f points( transferred to account %s",
			deducted, input.User, transferred, input.Target)
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Sprintln(errorMessage)
		return
	}

	successMessage := fmt.Sprintf("Successfully transferred %.1f points to account with NUSNET ID %s!",
		transferred, input.Target)
	c.JSON(http.StatusOK, gin.H{"success": true, "message": successMessage})
}

// POST /edit_profile
// Edit profile details
func EditProfile(c *gin.Context) {
	// Validate input
	var input models.EditProfile
	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "All input fields required."})
		fmt.Println("Error in parsing inputs for account creation.")
		return
	}

	// check if name is blank space
	if input.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Input name cannot be blank!"})
		fmt.Println("Input name cannot be blank!")
		return
	}

	if err := UpdateProfile(DB, input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": "Encountered an error updating profile."})
		fmt.Println("Encountered an error updating profile." + err.Error())
	} else {
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Profile successfully updated!"})
		fmt.Println("Profile successfully updated!")
	}
}

// POST /create_staff
// Creates a staff account
func CreateStaff(c *gin.Context) {
	// Validate input
	var input models.CreateStaffAccountInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "All input fields required."})
		fmt.Println("Error in parsing inputs for account creation.")
		return
	}

	// check if account already exists
	if GetAccountExists(DB, models.CreateAccountInput{Nusnetid: input.StaffID}) {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account already exists!"})
		fmt.Println("Account already exists.")
		return
	}

	// get accountTypeID
	accountType, exists, err := GetAccountTypeDetails(DB, "Staff")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Unable to determine account type"})
		fmt.Println("Unable to get accountTypeID. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Trying to set account to invalid type"})
		fmt.Println("accountType does not exist. " + err.Error() + "\n")
	}

	// get accountStatusID
	accountStatus, exists, err := GetAccountStatus(DB, "Offline")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Unable to determine account status"})
		fmt.Println("Unable to get accountStatusID. " + err.Error() + "\n")
	}
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Trying to set account to invalid status"})
		fmt.Println("accountStatus does not exist. " + err.Error() + "\n")
	}

	// generate new password
	tempPass, err := password.Generate(10, 3, 3, false, false)
	for !regexPasswordCheck(c, tempPass) {
		tempPass, err = password.Generate(10, 3, 3, false, false)
	}
	if err != nil {
		errorMessage := fmt.Sprintf("Error generating temporary password. " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
	}
	user := models.User{
		Nusnetid: input.StaffID,
		Password: tempPass,
	}

	// hashing the password
	if err := utils.HashPassword(&user); err != nil {
		fmt.Println("Error in hashing user password: " + err.Error())
		return
	}

	staffAcc := models.Accounts{
		Nusnetid:        input.StaffID,
		Passwordhash:    user.Password,
		Name:            input.Name,
		Gradyear:        9999,
		Facultyid:       1,
		Accounttypeid:   accountType.ID,
		Points:          0,
		Createdat:       time.Now(),
		Lastupdated:     time.Now(),
		Accountstatusid: accountStatus.ID,
	}

	if err := CreateAccount(DB, staffAcc); err != nil {
		fmt.Println("Unable to create staff account. " + err.Error() + "\n")
	} else {
		fmt.Println("staff account successfully created!")
	}

	emailInfo := models.StaffCreationInfo{
		Name:     input.Name,
		StaffID:  input.StaffID,
		TempPass: tempPass,
	}
	if err := SendStaffCreationEmail(emailInfo); err != nil {
		errorMessage := fmt.Sprintf("Error sending staff creation email. " + err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "message": errorMessage})
		fmt.Println(errorMessage)
	} else {
		successMessage := "Staff account successfully created." + "\n" + "Temporary password sent to registered staff's email."
		c.JSON(http.StatusOK, gin.H{"success": true, "message": successMessage})
		fmt.Println(successMessage)
	}
}

func CreateAdminAccount() {
	adminID := os.Getenv("STAFF_ID")
	if adminID == "" {
		if config.ADMIN_ID == "" {
			fmt.Println("Error creating admin account. Go to config.go to setup admin's user id.")
		}
		adminID = config.ADMIN_ID
	}
	adminPass := os.Getenv("STAFF_PASS")
	if adminPass == "" {
		if config.ADMIN_PASS == "" {
			fmt.Println("Error creating admin account. Go to config.go to setup admin's password.")
		}
		adminPass = config.ADMIN_PASS
	}

	// check if admin account already created
	if GetAccountExists(DB, models.CreateAccountInput{Nusnetid: adminID}) {
		return
	}

	// hashing the password
	admin := models.User{
		Nusnetid: adminID,
		Password: adminPass,
	}
	err := utils.HashPassword(&admin)
	if err != nil {
		fmt.Println("Error in hashing admin password. " + err.Error())
	}

	// get accountTypeID
	accountType, exists, err := GetAccountTypeDetails(DB, "Admin")
	if err != nil {
		fmt.Println("Unable to get accountTypeID. " + err.Error() + "\n")
		return
	}
	if !exists {
		fmt.Println("accountType does not exist. " + err.Error() + "\n")
		return
	}

	// get accountStatusID
	accountStatus, exists, err := GetAccountStatus(DB, "Offline")
	if err != nil {
		fmt.Println("Unable to get accountStatusID. " + err.Error() + "\n")
		return
	}
	if !exists {
		fmt.Println("accountStatus does not exist. " + err.Error() + "\n")
		return
	}

	adminAcc := models.Accounts{
		Nusnetid:        adminID,
		Passwordhash:    admin.Password,
		Name:            "Admin",
		Gradyear:        9999,
		Facultyid:       1,
		Accounttypeid:   accountType.ID,
		Points:          0,
		Createdat:       time.Now(),
		Lastupdated:     time.Now(),
		Accountstatusid: accountStatus.ID,
	}

	if err := CreateAccount(DB, adminAcc); err != nil {
		fmt.Println("Unable to create admin account. " + err.Error() + "\n")
	} else {
		fmt.Println("Admin account successfully created!")
	}
}

func GetAccountTypeDetails(DB *gorm.DB, theType string) (models.Accounttypes, bool, error) {
	var accountType models.Accounttypes
	query := "SELECT * FROM accounttypes WHERE accounttypename = ?"
	result := DB.Raw(query, theType).Scan(&accountType)
	if result.Error == gorm.ErrRecordNotFound {
		return models.Accounttypes{}, false, nil
	}
	if result.Error != nil {
		return models.Accounttypes{}, false, result.Error
	}
	return accountType, true, nil
}

func GetAccountExists(DB *gorm.DB, input models.CreateAccountInput) bool {
	var retrieved models.Accounts
	return DB.Where("nusnetid = ?", input.Nusnetid).First(&retrieved).RowsAffected != 0
}

func GetAccountStatus(DB *gorm.DB, statusName string) (models.Accountstatuses, bool, error) {
	var accountStatus models.Accountstatuses
	query := "SELECT * FROM accountstatuses WHERE accountstatusname = ?"
	result := DB.Raw(query, statusName).Scan(&accountStatus)
	if result.Error == gorm.ErrRecordNotFound {
		return models.Accountstatuses{}, false, nil
	}
	if result.Error != nil {
		return models.Accountstatuses{}, false, result.Error
	}
	return accountStatus, true, nil
}

func CreateAccount(DB *gorm.DB, account models.Accounts) error {
	if err := DB.Create(&account).Error; err != nil {
		return err
	}
	return nil
}

func GetFacultyList(DB *gorm.DB) ([]models.Faculties, bool, error) {
	var faculties []models.Faculties
	query := "SELECT * FROM faculties"
	result := DB.Raw(query).Scan(&faculties)
	if result.Error == gorm.ErrRecordNotFound {
		return []models.Faculties{}, false, nil
	}
	if result.Error != nil {
		return []models.Faculties{}, false, result.Error
	}
	return faculties, true, nil
}

func GetAccount(DB *gorm.DB, input models.User) (models.Accounts, bool, error) {
	var retrieved models.Accounts
	result := DB.Where("nusnetid = ?", input.Nusnetid).First(&retrieved)
	if result.Error == gorm.ErrRecordNotFound {
		return models.Accounts{}, false, nil
	}
	if result.Error != nil {
		return models.Accounts{}, false, result.Error
	}
	return retrieved, true, nil
}

func UpdateAccountStatus(DB *gorm.DB, statusCode models.Accountstatuses, input models.User) error {
	updateQuery := "UPDATE accounts SET accountstatusid = ?, lastupdated = ? WHERE nusnetid = ?"
	if err := DB.Exec(updateQuery, statusCode.ID, time.Now(), input.Nusnetid).Error; err != nil {
		return err
	}
	return nil
}

func UpdateAccountPassword(DB *gorm.DB, retrieved models.Accounts, input models.CreateAccountInput) error {
	query := "UPDATE accounts SET passwordHash = ? WHERE id = ?"
	if err := DB.Exec(query, input.Password, retrieved.ID).Error; err != nil {
		return err
	}
	return nil
}

func regexPasswordCheck(c *gin.Context, input string) bool {
	num := `[0-9]{1}`
	a_z := `[a-z]{1}`
	A_Z := `[A-Z]{1}`
	symbol := `[!@#$%^&*()+|_]{1}`
	errorMessage := "Password must be 6 - 12 characters long, with a mixture of lower " +
		"and upper case letters, numbers and symbols. "
	if ok, err := regexp.MatchString(num, input); !ok || err != nil {
		if err != nil {
			errorMessage += err.Error()
		}
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return false
	}
	if ok, err := regexp.MatchString(a_z, input); !ok || err != nil {
		if err != nil {
			errorMessage += err.Error()
		}
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return false
	}
	if ok, err := regexp.MatchString(A_Z, input); !ok || err != nil {
		if err != nil {
			errorMessage += err.Error()
		}
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return false
	}
	if ok, err := regexp.MatchString(symbol, input); !ok || err != nil {
		if err != nil {
			errorMessage += err.Error()
		}
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return false
	}
	return true
}

func regexIDCheck(c *gin.Context, input string) bool {
	startE := `^e`
	sixChar := `[0-9]{7}`
	errorMessage := "Invalid NUSNET ID. "
	if ok, err := regexp.MatchString(startE, input); !ok || err != nil {
		if err != nil {
			errorMessage += err.Error()
		}
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return false
	}
	if ok, err := regexp.MatchString(sixChar, input); !ok || err != nil {
		if err != nil {
			errorMessage += err.Error()
		}
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": errorMessage})
		fmt.Println(errorMessage)
		return false
	}
	return true
}

func GetFaculty(DB *gorm.DB, id int) (models.Faculties, bool, error) {
	var faculty models.Faculties
	query := "SELECT * FROM faculties WHERE id = ?"
	result := DB.Raw(query, id).Scan(&faculty)
	if result.Error == gorm.ErrRecordNotFound {
		return models.Faculties{}, false, nil
	}
	if result.Error != nil {
		return models.Faculties{}, false, result.Error
	}
	return faculty, true, nil
}

func GetAccountDetailed(DB *gorm.DB, input models.User) (models.AccountDetailed, bool, error) {
	var retrieved models.AccountDetailed
	query := "SELECT * FROM accounts" +
		" JOIN faculties ON faculties.id = accounts.facultyid" +
		" WHERE nusnetid = ?"
	result := DB.Raw(query, input.Nusnetid).Scan(&retrieved)
	if result.Error == gorm.ErrRecordNotFound {
		return models.AccountDetailed{}, false, nil
	}
	if result.Error != nil {
		return models.AccountDetailed{}, false, result.Error
	}
	URL, err := MakeProfilePicURL(retrieved.Profilepic)
	if err != nil {
		return models.AccountDetailed{}, false, err
	} else {
		retrieved.ProfilepicURL = URL
	}
	return retrieved, true, nil
}

func GetAccountType(DB *gorm.DB, typeID int) (models.Accounttypes, bool, error) {
	query := "SELECT * FROM accounttypes WHERE id = ?"
	var accountType models.Accounttypes
	result := DB.Raw(query, typeID).Scan(&accountType)
	if result.Error == gorm.ErrRecordNotFound {
		return models.Accounttypes{}, false, nil
	}
	if result.Error != nil {
		return models.Accounttypes{}, false, result.Error
	}
	return accountType, true, nil
}

func CreateS3Session() (*session.Session, error) {
	bucketID := os.Getenv("ORBITAL-BOOKING-BUCKET-ID")
	if bucketID == "" {
		if config.ORBITAL_BOOKING_BUCKET_ID == "" {
			return nil, errors.New("AWS bucket ID not setup, go to config.go to input")
		} else {
			bucketID = config.ORBITAL_BOOKING_BUCKET_ID
		}
	}
	bucketKey := os.Getenv("ORBITAL-BOOKING-BUCKET-KEY")
	if bucketKey == "" {
		if config.ORBITAL_BOOKING_BUCKET_KEY == "" {
			return nil, errors.New("AWS bucket key not setup, go to config.go to input")
		} else {
			bucketKey = config.ORBITAL_BOOKING_BUCKET_KEY
		}
	}

	s, err := session.NewSession(&aws.Config{
		Region: aws.String("ap-southeast-1"),
		Credentials: credentials.NewStaticCredentials(
			bucketID,  // id
			bucketKey, // secret
			""),       // token can be left blank for now
	})
	if err != nil {
		return nil, err
	}

	return s, err
}

func UploadFileToS3(s *session.Session, file multipart.File, fileHeader *multipart.FileHeader) (uuid.UUID, error) {
	// get the file size and read
	// the file content into a buffer
	size := fileHeader.Size
	buffer := make([]byte, size)
	file.Read(buffer)

	// create a unique file name for the file
	ID, err := uuid.NewRandom()
	if err != nil {
		fmt.Println("Unable to generate UUID for profile pic. " + err.Error() + "\n")
		return uuid.UUID{}, err
	}
	tempFileName := "profile_pictures/" + ID.String()

	bucketName := os.Getenv("ORBITAL-BOOKING-BUCKET-NAME")
	if bucketName == "" {
		if config.ORBITAL_BOOKING_BUCKET_NAME == "" {
			return uuid.UUID{}, errors.New("AWS bucket name not setup, go to config.go to input")
		} else {
			bucketName = config.ORBITAL_BOOKING_BUCKET_NAME
		}
	}

	// config settings: this is where you choose the bucket,
	// filename, content-type and storage class of the file
	// you're uploading
	_, err = s3.New(s).PutObject(&s3.PutObjectInput{
		Bucket:               aws.String(bucketName),
		Key:                  aws.String(tempFileName),
		ACL:                  aws.String("public-read"), // could be private if you want it to be access by only authorized users
		Body:                 bytes.NewReader(buffer),
		ContentLength:        aws.Int64(int64(size)),
		ContentType:          aws.String(http.DetectContentType(buffer)),
		ContentDisposition:   aws.String("attachment"),
		ServerSideEncryption: aws.String("AES256"),
		StorageClass:         aws.String("INTELLIGENT_TIERING"),
	})
	if err != nil {
		return uuid.UUID{}, err
	}

	return ID, err
}

func MakeProfilePicURL(ID uuid.UUID) (string, error) {
	bucketName := os.Getenv("ORBITAL-BOOKING-BUCKET-NAME")
	if bucketName == "" {
		if config.ORBITAL_BOOKING_BUCKET_NAME == "" {
			return "", errors.New("AWS bucket name not setup, go to config.go to input")
		} else {
			bucketName = config.ORBITAL_BOOKING_BUCKET_NAME
		}
	}

	var fileName string
	if ID == uuid.Nil {
		fileName = "default.png"
	} else {
		fileName = ID.String()
	}

	URL := fmt.Sprintf("https://"+"%s"+".s3."+"%s"+".amazonaws.com/"+"%s"+"%s",
		bucketName, config.ORBITAL_BOOKING_BUCKET_REGION, config.PROFILE_PIC_FOLDER, fileName)
	return URL, nil
}

func UpdateProfile(DB *gorm.DB, newInput models.EditProfile) error {
	query := "UPDATE accounts"
	updated := false
	var tempID uuid.UUID
	if newInput.Name != "" {
		query += fmt.Sprintf(" SET name = '%s'", newInput.Name)
		updated = true
	}
	if newInput.Facultyid != 0 {
		if updated {
			query += ","
		} else {
			query += " SET"
		}
		query += fmt.Sprintf(" facultyid = %d", newInput.Facultyid)
		updated = true
	}
	if newInput.Gradyear != 0 {
		if updated {
			query += ","
		} else {
			query += " SET"
		}
		query += fmt.Sprintf(" gradyear = %d", newInput.Gradyear)
		updated = true
	}
	if newInput.Profilepic != nil {
		var err error
		tempID, err = uuid.NewRandom()
		if err != nil {
			return err
		}

		// create S3 session for profile pic upload
		s, err := CreateS3Session()
		if err != nil {
			return fmt.Errorf("unable to create AWS session for profile pic upload %s", err.Error())
		}

		if newInput.Profilepic != nil {
			file, err := newInput.Profilepic.Open()
			if err != nil {
				return fmt.Errorf("unable to parse profile pic upload %s", err.Error())
			}

			tempID, err = UploadFileToS3(s, file, newInput.Profilepic)
			if err != nil {
				return fmt.Errorf("unable to upload profile pic to S3 %s", err.Error())
			} else {
				fmt.Println("New image uploaded successfully!")
			}
		}

		tempQuery := "UPDATE accounts SET profilepic = ? WHERE nusnetid = ?"
		if err := DB.Exec(tempQuery, tempID, newInput.Nusnetid).Error; err != nil {
			return err
		}
		return nil
	}
	query += fmt.Sprintf(" WHERE nusnetid = '%s'", newInput.Nusnetid)
	if err := DB.Exec(query).Error; err != nil {
		return err
	}

	updateTime := "UPDATE accounts SET lastupdated = ? WHERE nusnetid = ?"
	if err := DB.Exec(updateTime, time.Now(), newInput.Nusnetid).Error; err != nil {
		return err
	}
	return nil
}

func RefillPoints(retrieved models.Accounts) (float64, error) {
	lastYear, lastWeek := retrieved.Lastupdated.ISOWeek()
	currentYear, currentWeek := time.Now().ISOWeek()
	var toAdd float64
	query := "UPDATE accounts SET points = ? WHERE nusnetid = ?"
	if currentYear > lastYear || (currentYear == lastYear && currentWeek > lastWeek) {
		if retrieved.Points <= config.MAX_POINTS-config.WEEKLY_POINTS {
			toAdd = config.WEEKLY_POINTS
		} else {
			toAdd = retrieved.Points + config.WEEKLY_POINTS - config.MAX_POINTS
		}
	} else {
		return 0.0, nil
	}
	if err := DB.Exec(query, toAdd, retrieved.Nusnetid).Error; err != nil {
		return 0.0, err
	} else {
		return toAdd, nil
	}
}

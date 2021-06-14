package services

import (
	"log"
	"net/http"
	"server/models"
	"server/utils"

	"github.com/gin-gonic/gin"
)

// POST /register
// register account
func Register(c *gin.Context) {
	// Validate input
	var input models.CreateAccountInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// check if account already exists
	var retrieved models.Accounts
	if DB.Where("nusnet_id = ?", input.Nusnet_id).First(&retrieved).RowsAffected != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account already exists!"})
		return
	}

	// hashing the password
	input.Password = utils.CreateHashedPassword(input.Password)

	account := models.Accounts{Nusnet_id: input.Nusnet_id, Password: input.Password}
	if err := DB.Create(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Account successfully created!"})
	log.Println("Account successfully created!")
}

// POST /login
func Login(c *gin.Context) {
	var input models.User
	c.ShouldBindJSON(&input) // MUST USE SHOULDBINDJSON instead of Bind!!
	var retrieved models.Accounts

	row := DB.Where("nusnet_id = ?", input.Nusnet_id).First(&retrieved)
	if row.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid NUSNET ID!"})
		return
	}

	match := utils.CheckPasswordHash(input.Password, retrieved.Password) // non hashed input first, followed by hashed one retrieved from DB

	if !match {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid password!"})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"success": true})
	}

	log.Print("Log in successful!")
}

// PATCH /reset
// Reset password
func ResetPassword(c *gin.Context) {
	var input models.CreateAccountInput
	// Validate input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Have you input correctly? " + err.Error()})
		return
	}

	// check if account already exists
	var retrieved models.Accounts
	if DB.Where("nusnet_id = ?", input.Nusnet_id).First(&retrieved).RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Account does not exist!"})
		return
	}

	// check if new password is same as the old password
	match := utils.CheckPasswordHash(input.Password, retrieved.Password) // non hashed input first, followed by hashed one retrieved from DB
	if match {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "New password cannot be the same as old password!"})
		return
	}

	// hashing the password
	input.Password = utils.CreateHashedPassword(input.Password)

	if err := DB.Model(&retrieved).UpdateColumn("password", input.Password).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
	log.Println("Password successfully reset!")
}

// GET /accounts
// get accounts, only shows the ID
func GetAccounts(c *gin.Context) {
	var accounts []models.Accounts
	if err := DB.Select("id", "nusnet_id").Find(&accounts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": accounts})
	log.Println("Return successful!")
}

// GET /accounts/:id
// Find an account
func FindAccount(c *gin.Context) {
	// Get model if exist
	var account models.Accounts

	if err := DB.Where("nusnet_id = ?", c.Param("nusnet_id")).First(&account).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": account})
}

// DELETE /accounts/:id
// Delete an account
func DeleteAccount(c *gin.Context) {
	// Get model if exist
	var account models.Accounts
	if err := DB.Where("nusnet_id = ?", c.Param("nusnet_id")).First(&account).Error; err != nil {
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

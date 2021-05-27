package services

import (
	"fmt"
	"server/config"
	"server/models"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func ConnectDataBase() {

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		config.DB_HOST, config.DB_PORT, config.DB_USER, config.DB_PASSWORD, config.DB_NAME)

	database, err := gorm.Open("postgres", psqlInfo)
	if err != nil {
		panic("Failed to connect to database!")
	}

	fmt.Println("Database successfully connected!")

	database.AutoMigrate(&models.Accounts{})

	DB = database
}

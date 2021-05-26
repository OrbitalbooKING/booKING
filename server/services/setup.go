package services

import (
	"fmt"
	"server/models"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func ConnectDataBase() {
	const (
		host     = "localhost"
		port     = 5433
		user     = "postgres"
		password = "password"
		dbname   = "testing1"
	)

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	database, err := gorm.Open("postgres", psqlInfo)
	if err != nil {
		panic("Failed to connect to database!")
	}

	fmt.Println("Database successfully connected!")

	database.AutoMigrate(&models.Accounts{})

	DB = database
}

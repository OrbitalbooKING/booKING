package services

import (
	"fmt"
	"os"
	"server/config"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func ConnectDataBase() {

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		config.DB_HOST, config.DB_PORT, config.DB_USER, config.DB_PASSWORD, config.DB_NAME)

	if DB_PORT := os.Getenv("DATABASE_URL"); DB_PORT != "" {
		database, err := gorm.Open("postgres", DB_PORT)
		if err != nil {
			panic("Failed to connect to database!" + err.Error())
		} else {
			fmt.Println("Database successfully connected!")
			DB = database
		}
	} else {
		database, err := gorm.Open("postgres", psqlInfo)
		if err != nil {
			panic("Failed to connect to database!" + err.Error())
		} else {
			fmt.Println("Database successfully connected!")
			DB = database
		}
	}
}
